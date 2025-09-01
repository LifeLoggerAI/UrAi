import { onRequest, onCall } from "firebase-functions/v2/https";
import { logger } from "firebase-functions/v2";
import * as admin from "firebase-admin";
import Stripe from "stripe";
import { defineString } from "firebase-functions/params";

// Initialize admin SDK if not already initialized
if (admin.apps.length === 0) {
  admin.initializeApp();
}
const db = admin.firestore();

// Define Stripe API key and webhook secret from environment
const stripeSecretKey = defineString("STRIPE_SECRET_KEY");
const webhookSecret = defineString("STRIPE_WEBHOOK_SECRET");

/**
 * V6 Pro Tier: Create Stripe checkout session
 */
export const createCheckoutSession = onCall(async (request) => {
  const { auth, data } = request;
  
  if (!auth) {
    throw new Error("Authentication required");
  }

  const { priceId, successUrl, cancelUrl } = data;
  
  if (!priceId) {
    throw new Error("Price ID is required");
  }

  try {
    const stripe = new Stripe(stripeSecretKey.value(), {
      apiVersion: "2023-10-16",
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: successUrl || `${request.rawRequest.headers.origin}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl || `${request.rawRequest.headers.origin}/pricing`,
      client_reference_id: auth.uid, // Link session to user
      customer_email: auth.token.email,
      metadata: {
        uid: auth.uid,
      },
    });

    return { sessionId: session.id };
  } catch (error) {
    logger.error("Error creating checkout session:", error);
    throw new Error("Failed to create checkout session");
  }
});

/**
 * V6 Pro Tier: Handle Stripe webhooks
 */
export const stripeWebhook = onRequest(async (request, response) => {
  const stripe = new Stripe(stripeSecretKey.value(), {
    apiVersion: "2023-10-16",
  });

  const sig = request.headers["stripe-signature"];
  if (!sig) {
    logger.error("No Stripe signature found in header");
    response.status(400).send("Webhook Error: No signature provided");
    return;
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(request.rawBody, sig, webhookSecret.value());
  } catch (err) {
    logger.error("Error verifying Stripe webhook signature:", err);
    response.status(400).send(`Webhook Error: ${(err as Error).message}`);
    return;
  }

  // Handle the event
  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const uid = session.client_reference_id;
      if (!uid) {
        logger.error("No UID found in checkout session");
        break;
      }
      
      if (session.subscription) {
        const subscription = await stripe.subscriptions.retrieve(session.subscription as string);
        
        // Update user's pro tier status in Firestore
        await db.collection("proTiers").doc(uid).set({
          active: true,
          plan: subscription.items.data[0]?.price.id,
          currentPeriodEnd: subscription.current_period_end * 1000,
          stripeCustomerId: subscription.customer,
          stripeSubscriptionId: subscription.id,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        }, { merge: true });
      }
      
      logger.info(`User ${uid} completed checkout session`);
      break;
    }
    
    case "customer.subscription.created":
    case "customer.subscription.updated": {
      const subscription = event.data.object as Stripe.Subscription;
      const customer = await stripe.customers.retrieve(subscription.customer as string) as Stripe.Customer;
      const uid = customer.metadata.uid;
      
      if (!uid) {
        logger.error("No UID found for customer subscription event");
        break;
      }
      
      const isActive = subscription.status === 'active' || subscription.status === 'trialing';
      
      await db.collection("proTiers").doc(uid).set({
        active: isActive,
        plan: subscription.items.data[0]?.price.id,
        currentPeriodEnd: subscription.current_period_end * 1000,
        status: subscription.status,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      }, { merge: true });
      
      logger.info(`Subscription for user ${uid} was updated. Active: ${isActive}`);
      break;
    }
    
    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription;
      const customer = await stripe.customers.retrieve(subscription.customer as string) as Stripe.Customer;
      const uid = customer.metadata.uid;
      
      if (!uid) {
        logger.error("No UID found for customer subscription deleted event");
        break;
      }
      
      await db.collection("proTiers").doc(uid).set({
        active: false,
        status: 'canceled',
        canceledAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      }, { merge: true });
      
      logger.info(`Subscription for user ${uid} was canceled`);
      break;
    }
    
    case "invoice.payment_failed": {
      const invoice = event.data.object as Stripe.Invoice;
      const subscription = await stripe.subscriptions.retrieve(invoice.subscription as string);
      const customer = await stripe.customers.retrieve(subscription.customer as string) as Stripe.Customer;
      const uid = customer.metadata.uid;
      
      if (!uid) {
        logger.error("No UID found for failed payment event");
        break;
      }
      
      // Mark subscription as having payment issues
      await db.collection("proTiers").doc(uid).set({
        paymentFailed: true,
        lastPaymentFailure: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      }, { merge: true });
      
      // TODO: Send notification to user about payment failure
      logger.warn(`Payment failed for user ${uid}`);
      break;
    }
    
    default:
      logger.info(`Unhandled Stripe event type: ${event.type}`);
  }

  // Return a response to acknowledge receipt of the event
  response.status(200).send({ received: true });
});

/**
 * V6 Pro Tier: Get user's subscription status
 */
export const getSubscriptionStatus = onCall(async (request) => {
  const { auth } = request;
  
  if (!auth) {
    throw new Error("Authentication required");
  }

  try {
    const proTierDoc = await db.collection("proTiers").doc(auth.uid).get();
    
    if (!proTierDoc.exists) {
      return {
        isProUser: false,
        plan: null,
        status: 'none'
      };
    }

    const proTierData = proTierDoc.data();
    return {
      isProUser: proTierData?.active || false,
      plan: proTierData?.plan || null,
      status: proTierData?.status || 'unknown',
      currentPeriodEnd: proTierData?.currentPeriodEnd || null,
      paymentFailed: proTierData?.paymentFailed || false,
    };
  } catch (error) {
    logger.error("Error getting subscription status:", error);
    throw new Error("Failed to get subscription status");
  }
});

/**
 * V6 Pro Tier: Create customer portal session
 */
export const createPortalSession = onCall(async (request) => {
  const { auth, data } = request;
  
  if (!auth) {
    throw new Error("Authentication required");
  }

  const { returnUrl } = data;

  try {
    const proTierDoc = await db.collection("proTiers").doc(auth.uid).get();
    
    if (!proTierDoc.exists) {
      throw new Error("No subscription found");
    }

    const stripeCustomerId = proTierDoc.data()?.stripeCustomerId;
    
    if (!stripeCustomerId) {
      throw new Error("No Stripe customer ID found");
    }

    const stripe = new Stripe(stripeSecretKey.value(), {
      apiVersion: "2023-10-16",
    });

    const session = await stripe.billingPortal.sessions.create({
      customer: stripeCustomerId,
      return_url: returnUrl || `${request.rawRequest.headers.origin}/dashboard`,
    });

    return { url: session.url };
  } catch (error) {
    logger.error("Error creating portal session:", error);
    throw new Error("Failed to create portal session");
  }
});
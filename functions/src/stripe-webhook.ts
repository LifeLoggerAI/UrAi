
import { onRequest } from "firebase-functions/v2/https";
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
 * Express middleware to handle Stripe webhooks
 */
export const stripeWebhook = onRequest(async (request, response) => {
  const stripe = new Stripe(stripeSecretKey.value(), {
    apiVersion: undefined, // Set to undefined to use Stripe's default or infer latest API version
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
      
      const subscription = (await stripe.subscriptions.retrieve(session.subscription as string)) as Stripe.Subscription;
      
      // Update user's pro tier status in Firestore
      await db.collection("proTiers").doc(uid).set({
        active: true,
        plan: subscription.items.data[0]?.price.id,
        currentPeriodEnd: (subscription as any).current_period_end * 1000, // Cast to any to bypass type error temporarily
        stripeCustomerId: subscription.customer,
      }, { merge: true });
      
      logger.info(`User ${uid} subscribed to a new plan.`);
      break;
    }
    case "customer.subscription.deleted":
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
        currentPeriodEnd: (subscription as any).current_period_end * 1000, // Cast to any to bypass type error temporarily
      }, { merge: true });
      
      logger.info(`Subscription for user ${uid} was updated. Active: ${isActive}`);
      break;
    }
    default:
      logger.info(`Unhandled Stripe event type: ${event.type}`);
  }

  // Return a response to acknowledge receipt of the event
  response.status(200).send({ received: true });
});

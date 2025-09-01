'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/components/auth-provider';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Crown, Check, X, Loader2 } from 'lucide-react';
import { getFunctions, httpsCallable } from 'firebase/functions';

const functions = getFunctions();
const createCheckoutSession = httpsCallable(functions, 'createCheckoutSession');
const getSubscriptionStatus = httpsCallable(functions, 'getSubscriptionStatus');
const createPortalSession = httpsCallable(functions, 'createPortalSession');

interface SubscriptionStatus {
  isProUser: boolean;
  plan: string | null;
  status: string;
  currentPeriodEnd: number | null;
  paymentFailed: boolean;
}

const PLANS = [
  {
    id: 'basic',
    name: 'Basic',
    price: 0,
    priceId: null,
    features: [
      'Basic AI Companion',
      'Voice & Text Logging',
      'Simple Analytics',
      '7-day data retention',
    ],
    limitations: [
      'Limited daily interactions',
      'No premium features',
      'Standard support',
    ]
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 29,
    priceId: 'price_1234567890', // Replace with actual Stripe price ID
    features: [
      'Advanced AI Companion',
      'Unlimited Voice & Text',
      'Dream Analysis & Replay',
      'Social Constellations',
      'Privacy Zones',
      'Advanced Analytics',
      'Unlimited data retention',
      'Priority Support',
    ],
    limitations: []
  },
  {
    id: 'ultra',
    name: 'Ultra',
    price: 99,
    priceId: 'price_0987654321', // Replace with actual Stripe price ID
    features: [
      'Everything in Pro',
      'AI Life Mirror',
      'Soul Vault with Notarization',
      'Team Collaboration',
      'Marketplace Access',
      'Plugin Ecosystem',
      'AR/VR Integration',
      'White-glove Support',
    ],
    limitations: []
  }
];

export function ProTierManagement() {
  const { user } = useAuth();
  const [subscriptionStatus, setSubscriptionStatus] = useState<SubscriptionStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      loadSubscriptionStatus();
    }
  }, [user]);

  const loadSubscriptionStatus = async () => {
    try {
      const result = await getSubscriptionStatus();
      setSubscriptionStatus(result.data as SubscriptionStatus);
    } catch (error) {
      console.error('Error loading subscription status:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpgrade = async (priceId: string) => {
    if (!user || !priceId) return;

    setActionLoading(priceId);
    try {
      const result = await createCheckoutSession({
        priceId,
        successUrl: `${window.location.origin}/dashboard?upgrade=success`,
        cancelUrl: `${window.location.origin}/pricing?upgrade=canceled`,
      });

      // Redirect to Stripe Checkout
      const stripe = (window as any).Stripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
      await stripe.redirectToCheckout({
        sessionId: result.data.sessionId,
      });
    } catch (error) {
      console.error('Error creating checkout session:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleManageSubscription = async () => {
    if (!user) return;

    setActionLoading('manage');
    try {
      const result = await createPortalSession({
        returnUrl: `${window.location.origin}/dashboard`,
      });

      // Redirect to Stripe Customer Portal
      window.location.href = result.data.url;
    } catch (error) {
      console.error('Error creating portal session:', error);
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span className="ml-2">Loading subscription status...</span>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {subscriptionStatus?.isProUser && (
        <Card className="p-6 bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Crown className="h-6 w-6 text-purple-600" />
              <div>
                <h3 className="font-semibold text-purple-900">Pro User</h3>
                <p className="text-sm text-purple-700">
                  {subscriptionStatus.plan} plan active
                  {subscriptionStatus.currentPeriodEnd && (
                    <span className="ml-2">
                      (renews {new Date(subscriptionStatus.currentPeriodEnd).toLocaleDateString()})
                    </span>
                  )}
                </p>
              </div>
            </div>
            <Button
              onClick={handleManageSubscription}
              disabled={actionLoading === 'manage'}
              variant="outline"
              className="border-purple-300 text-purple-700 hover:bg-purple-50"
            >
              {actionLoading === 'manage' ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                'Manage Subscription'
              )}
            </Button>
          </div>

          {subscriptionStatus.paymentFailed && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-700">
                ⚠️ Payment failed. Please update your payment method to continue enjoying Pro features.
              </p>
            </div>
          )}
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {PLANS.map((plan) => (
          <Card 
            key={plan.id} 
            className={`p-6 relative ${
              subscriptionStatus?.plan === plan.priceId 
                ? 'ring-2 ring-purple-500 bg-purple-50' 
                : ''
            }`}
          >
            {subscriptionStatus?.plan === plan.priceId && (
              <Badge className="absolute top-4 right-4 bg-purple-600">
                Current Plan
              </Badge>
            )}

            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold mb-2">{plan.name}</h3>
              <div className="text-3xl font-bold">
                ${plan.price}
                <span className="text-sm font-normal text-gray-600">/month</span>
              </div>
            </div>

            <div className="space-y-3 mb-6">
              {plan.features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                  <span className="text-sm">{feature}</span>
                </div>
              ))}
              {plan.limitations.map((limitation, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <X className="h-4 w-4 text-red-500 flex-shrink-0" />
                  <span className="text-sm text-gray-600">{limitation}</span>
                </div>
              ))}
            </div>

            <div className="mt-auto">
              {plan.priceId ? (
                subscriptionStatus?.plan === plan.priceId ? (
                  <Button 
                    className="w-full" 
                    variant="outline" 
                    disabled
                  >
                    Current Plan
                  </Button>
                ) : (
                  <Button
                    className="w-full"
                    onClick={() => handleUpgrade(plan.priceId!)}
                    disabled={!!actionLoading}
                  >
                    {actionLoading === plan.priceId ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      `Upgrade to ${plan.name}`
                    )}
                  </Button>
                )
              ) : (
                <Button 
                  className="w-full" 
                  variant="outline" 
                  disabled
                >
                  Free Plan
                </Button>
              )}
            </div>
          </Card>
        ))}
      </div>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Subscription Benefits</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <h4 className="font-medium mb-2">Pro Features</h4>
            <ul className="space-y-1 text-gray-600">
              <li>• Advanced AI companion with personality evolution</li>
              <li>• Dream analysis and symbolic insights</li>
              <li>• Social constellation rooms</li>
              <li>• Enhanced privacy controls</li>
              <li>• Unlimited data retention</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2">Ultra Features</h4>
            <ul className="space-y-1 text-gray-600">
              <li>• AI Life Mirror with persona synthesis</li>
              <li>• Soul Vault with blockchain notarization</li>
              <li>• Team collaboration tools</li>
              <li>• Plugin marketplace access</li>
              <li>• AR/VR immersive experiences</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
}
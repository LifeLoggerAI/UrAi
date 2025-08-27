'use client';

import { Sparkles, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useState, useEffect } from 'react';

// Define window interface for custom properties
declare global {
  interface Window {
    __consent: { analytics: boolean };
    __utm: { source: string; medium: string; campaign: string };
    gtag: (...args: any[]) => void;
    fbq: (...args: any[]) => void;
    ttq: {
      track: (...args: any[]) => void;
      page: () => void;
    } & any[];
  }
}

export default function MarketingPage() {
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const trackLeadGA4 = (emailDomain: string) => {
    if (window.gtag) {
      window.gtag('event', 'lead_submit', {
        lead_type: 'email',
        email_domain: emailDomain || '',
        utm_source: (window.__utm || {}).source,
        utm_medium: (window.__utm || {}).medium,
        utm_campaign: (window.__utm || {}).campaign,
      });
    }
  };

  const trackLeadMeta = () => {
    if (window.fbq) {
      window.fbq('track', 'Lead', {
        content_name: 'Early Access',
        status: 'submitted',
      });
    }
  };

  const trackLeadTikTok = () => {
    if (window.ttq && window.__consent.analytics) {
      window.ttq.track('SubmitForm', { form_name: 'Early Access' });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast({
        variant: 'destructive',
        title: 'Email required',
        description: 'Please enter your email address.',
      });
      return;
    }
    setIsLoading(true);

    try {
      const emailDomain = (email.split('@')[1] || '').toLowerCase();
      
      // 1. Track events
      if (window.__consent?.analytics) {
        trackLeadGA4(emailDomain);
        trackLeadMeta();
        trackLeadTikTok();
      }

      // 2. Send to backend
      const response = await fetch(`/api/writeLead`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, utm_source: window.__utm?.source || '', utm_campaign: window.__utm?.campaign || '' })
      });

      if (!response.ok) {
        throw new Error('Failed to submit lead.');
      }
      
      // 3. UX success
      toast({
        title: 'Thank You!',
        description: "You're on the early access list.",
      });
      setEmail('');

    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Submission Failed',
        description: (error as Error).message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isClient) {
    return null; // or a skeleton loader
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex flex-col items-center justify-center p-4 text-center overflow-hidden">
      <header className="w-full max-w-4xl mx-auto">
        <div className="mb-8 mx-auto bg-primary/20 p-4 rounded-full w-20 h-20 flex items-center justify-center border border-primary/30">
          <Sparkles className="h-10 w-10 text-primary" />
        </div>
        
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-headline text-foreground mb-6 animate-fadeIn">
          UrAi: The Passive Emotional OS
        </h1>
        
        <p className="text-lg md:text-xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed animate-fadeIn">
          Your life, reflected — privately, symbolically, intelligently. Stop logging, start living. UrAi passively captures the signals of your life and reflects them back as meaningful insights.
        </p>

        <form onSubmit={handleSubmit} className="max-w-md mx-auto flex flex-col sm:flex-row gap-2 animate-fadeIn" style={{ animationDelay: '500ms' }}>
          <Input
            type="email"
            name="email"
            placeholder="Enter your email for early access"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
            required
            className="text-center sm:text-left"
          />
          <Button 
            type="submit"
            size="lg"
            className="group"
            disabled={isLoading}
          >
            {isLoading ? 'Submitting...' : 'Join the Waitlist'}
            <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </form>

        <p className="text-sm text-muted-foreground mt-6 opacity-70">
          Be the first to experience a new era of self-reflection.
        </p>
      </header>
    </main>
  );
}

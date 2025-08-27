
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth-provider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Mic, MapPin, Activity, Bell, ShieldQuestion, Sparkles, CheckCircle2 } from 'lucide-react';
import type { Permissions } from '@/lib/types';
import { db } from '@/lib/firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { AnimatePresence, motion } from 'framer-motion';

const permissionItems = [
  {
    key: 'micPermission' as const,
    icon: Mic,
    title: 'Microphone (Passive Audio)',
    description: 'Allows UrAi to passively capture ambient sounds and voice tones to understand your environment and emotional state without recording conversations.',
  },
  {
    key: 'gpsPermission' as const,
    icon: MapPin,
    title: 'Location (GPS)',
    description: 'Helps find meaning in your movement, routines, and the places you visit. Your specific location data is never shared.',
  },
  {
    key: 'notificationsPermission' as const,
    icon: Bell,
    title: 'Notifications',
    description: 'Enables UrAi to send you gentle nudges, important insights, and ritual reminders when something meaningful arises.',
  },
];

type OnboardingStep = 'intro' | 'permissions' | 'consent' | 'finalizing';

export default function PermissionsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [step, setStep] = useState<OnboardingStep>('intro');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [permissions, setPermissions] = useState<Record<string, boolean>>({
    micPermission: false,
    gpsPermission: false,
    notificationsPermission: true, // Often enabled by default
  });

  const [acceptedConsent, setAcceptedConsent] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  const handlePermissionRequest = async (key: keyof typeof permissions) => {
    let granted = false;
    try {
      if (key === 'micPermission') {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        stream.getTracks().forEach(track => track.stop()); // Immediately stop track after getting permission
        granted = true;
      } else if (key === 'gpsPermission') {
        await new Promise((resolve, reject) => navigator.geolocation.getCurrentPosition(resolve, reject));
        granted = true;
      } else if (key === 'notificationsPermission') {
        const permission = await Notification.requestPermission();
        granted = permission === 'granted';
      }
      setPermissions(prev => ({ ...prev, [key]: granted }));
      if (!granted) {
         toast({ variant: 'destructive', title: 'Permission Denied', description: 'You can enable this later in your browser or system settings.' });
      }
    } catch (error) {
       toast({ variant: 'destructive', title: 'Permission Error', description: 'Could not request permission. You can enable it manually later.' });
    }
  };

  const handleFinalSubmit = async () => {
    if (!user) {
      toast({ variant: 'destructive', title: 'Error', description: 'You must be logged in.' });
      return;
    }
    if (!acceptedConsent) {
      toast({ variant: 'destructive', title: 'Consent Required', description: 'You must accept the terms to continue.' });
      return;
    }

    setIsSubmitting(true);
    setStep('finalizing');

    const finalPermissionsData: Partial<Permissions> & { uid: string } = {
      ...permissions,
      motionPermission: false, // Defaulting as we don't request it in this flow
      shareAnonymizedData: false, // Defaulting
      acceptedTerms: true,
      acceptedPrivacyPolicy: true,
      consentTimestamp: Date.now(),
      acceptedTermsVersion: '1.2', // Increment version
      uid: user.uid,
    };
    
    const userUpdatePayload = {
        onboardingComplete: true,
        'settings.micPermission': permissions.micPermission,
        'settings.gpsPermission': permissions.gpsPermission,
        'settings.notificationsPermission': permissions.notificationsPermission,
        'settings.acceptedTermsVersion': '1.2',
        'settings.consentTimestamp': serverTimestamp(),
    };

    try {
      const userRef = doc(db, 'users', user.uid);
      await setDoc(userRef, userUpdatePayload, { merge: true });

      toast({ title: 'Welcome to UrAi!', description: 'Your journey begins now.' });
      setTimeout(() => router.push('/'), 2000);
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Setup Failed', description: error.message });
      setIsSubmitting(false);
      setStep('consent'); // Go back to consent step on failure
    }
  };

  if (loading || !user) {
    return (
        <div className="flex h-screen w-full items-center justify-center bg-background">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
    );
  }

  const renderStepContent = () => {
    switch(step) {
      case 'intro':
        return (
          <motion.div key="intro" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}>
            <CardHeader className="text-center">
              <Sparkles className="mx-auto h-12 w-12 text-primary" />
              <CardTitle className="font-headline text-3xl mt-4">Welcome to UrAi</CardTitle>
              <CardDescription>Let's set up your cognitive mirror. This will only take a moment.</CardDescription>
            </CardHeader>
            <CardFooter>
              <Button className="w-full" onClick={() => setStep('permissions')}>Begin Setup</Button>
            </CardFooter>
          </motion.div>
        );
      case 'permissions':
        return (
          <motion.div key="permissions" initial={{ opacity: 0, x: 300 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -300 }}>
             <CardHeader>
                <CardTitle className="font-headline text-2xl">Core Permissions</CardTitle>
                <CardDescription>To reflect your world, I need to perceive it. Grant permissions for the experiences you want to enable.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {permissionItems.map(item => (
                <div key={item.key} className="flex items-start gap-4 rounded-lg border p-4 transition-colors hover:bg-muted/50">
                  <item.icon className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                  <div className="flex-1 space-y-1">
                    <label className="text-base font-medium">{item.title}</label>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </div>
                  <Button size="sm" variant={permissions[item.key] ? 'secondary' : 'outline'} onClick={() => handlePermissionRequest(item.key)} disabled={permissions[item.key] === true}>
                    {permissions[item.key] ? 'Granted' : 'Grant'}
                  </Button>
                </div>
              ))}
            </CardContent>
            <CardFooter>
                <Button className="w-full" onClick={() => setStep('consent')}>Continue</Button>
            </CardFooter>
          </motion.div>
        );
      case 'consent':
        return (
            <motion.div key="consent" initial={{ opacity: 0, x: 300 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -300 }}>
                 <CardHeader>
                    <CardTitle className="flex items-center gap-3 font-headline text-2xl"><ShieldQuestion />Final Agreement</CardTitle>
                    <CardDescription>One last step to confirm your ownership and control over your data.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                     <div className="text-sm p-4 border rounded-md max-h-48 overflow-y-auto text-muted-foreground bg-muted/20">
                        <p>By checking this box, you confirm that you own your data, you decide what to share, and you can delete it at any time. You agree to our <a href="/tos" target="_blank" className="underline text-primary">Terms of Service</a> and <a href="/privacy" target="_blank" className="underline text-primary">Privacy Policy</a>, which explain how we protect your information. UrAi is a tool for reflection, not a substitute for medical advice.</p>
                     </div>
                     <div className="flex items-center space-x-2 pt-2">
                        <Checkbox id="terms" checked={acceptedConsent} onCheckedChange={(checked) => setAcceptedConsent(Boolean(checked))} />
                        <label htmlFor="terms" className="text-sm font-medium leading-none">I have read and accept the Terms and Privacy Policy.</label>
                    </div>
                </CardContent>
                 <CardFooter className="flex-col gap-2">
                    <Button className="w-full" onClick={handleFinalSubmit} disabled={!acceptedConsent || isSubmitting}>
                        {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null} Complete Setup
                    </Button>
                    <Button variant="ghost" className="w-full" onClick={() => setStep('permissions')}>Back</Button>
                </CardFooter>
            </motion.div>
        );
    case 'finalizing':
        return (
             <motion.div key="finalizing" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center text-center p-8">
                <CheckCircle2 className="h-16 w-16 text-green-500 mb-4" />
                <h2 className="text-2xl font-bold font-headline">Setup Complete!</h2>
                <p className="text-muted-foreground">Redirecting you to your new cognitive mirror...</p>
                <Loader2 className="h-6 w-6 animate-spin text-primary mt-6" />
            </motion.div>
        )
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background p-4 sm:p-8 md:p-12">
      <Card className="w-full max-w-lg animate-fadeIn overflow-hidden">
        <AnimatePresence mode="wait">
            {renderStepContent()}
        </AnimatePresence>
      </Card>
    </main>
  );
}

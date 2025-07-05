
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth-provider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Mic, MapPin, Activity, Bell, ShieldQuestion, Users } from 'lucide-react';
import type { Permissions } from '@/lib/types';
import { db } from '@/lib/firebase';
import { doc, setDoc } from 'firebase/firestore';

const permissionItems = [
    {
        key: 'micPermission' as const,
        icon: Mic,
        title: 'Microphone (Passive Audio)',
        description: 'Can I quietly listen to the world around you? I’ll never record words unless you ask.',
    },
    {
        key: 'gpsPermission' as const,
        icon: MapPin,
        title: 'Location (GPS)',
        description: 'Knowing your place in space helps me find meaning in movement and routines.',
    },
    {
        key: 'motionPermission' as const,
        icon: Activity,
        title: 'Motion & Activity',
        description: 'How you move tells a story. May I watch gently to detect steps, movement, and periods of rest?',
    },
    {
        key: 'notificationsPermission' as const,
        icon: Bell,
        title: 'Notifications',
        description: 'I’ll only speak softly when something meaningful arises. This includes ritual reminders and gentle nudges.',
    },
    {
        key: 'shareAnonymizedData' as const,
        icon: Users,
        title: 'Data Contribution (Optional)',
        description: 'Would you like to let your growth guide others? I’ll share only patterns — never identity.',
    },
];

export default function PermissionsPage() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const { toast } = useToast();
    const [step, setStep] = useState<'permissions' | 'consent'>('permissions');
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const [permissions, setPermissions] = useState({
        micPermission: false,
        gpsPermission: false,
        motionPermission: false,
        notificationsPermission: false,
        shareAnonymizedData: false,
    });
    
    const [acceptedConsent, setAcceptedConsent] = useState(false);

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
        }
    }, [user, loading, router]);
    
    const handleToggle = (key: keyof typeof permissions, value: boolean) => {
        setPermissions(prev => ({...prev, [key]: value}));
    };

    const handleBackToPermissions = () => {
        setStep('permissions');
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

        const finalPermissionsData: Permissions & { uid: string } = {
            ...permissions,
            acceptedTerms: true,
            acceptedPrivacyPolicy: true,
            consentTimestamp: Date.now(),
            acceptedTermsVersion: "1.1",
            uid: user.uid,
        };

        try {
            const permissionsRef = doc(db, "permissions", user.uid);
            await setDoc(permissionsRef, finalPermissionsData, { merge: true });

            toast({ title: 'Permissions Saved', description: "Now for the final step." });
            router.push('/onboarding/voice');
        } catch (error) {
            const err = error as { code?: string, message: string };
            toast({ variant: 'destructive', title: 'Error Saving Permissions', description: err.message });
            console.error("Error saving permissions:", err);
        } finally {
            setIsSubmitting(false);
        }
    };
    
    // The AuthProvider shows a global loader. We will just return null here to prevent
    // rendering the page with a null user object before the redirect happens.
    if (loading || !user) {
        return null;
    }

    return (
        <main className="flex min-h-screen flex-col items-center justify-center bg-background p-4 sm:p-8 md:p-12">
            <Card className="w-full max-w-lg animate-fadeIn">
                {step === 'permissions' && (
                    <>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-3 font-headline text-2xl"><ShieldQuestion/> Your Story, Your Rules</CardTitle>
                            <CardDescription>To reflect your world, I need to perceive it. Please grant permissions for the experiences you want to enable.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {permissionItems.map(item => (
                                <div key={item.key} className="flex items-start gap-4 rounded-lg border p-4">
                                    <item.icon className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                                    <div className="flex-1 space-y-1">
                                        <Label htmlFor={item.key} className="text-base font-medium">{item.title}</Label>
                                        <p className="text-sm text-muted-foreground">{item.description}</p>
                                    </div>
                                    <Switch
                                        id={item.key}
                                        checked={permissions[item.key]}
                                        onCheckedChange={(checked) => handleToggle(item.key, checked)}
                                    />
                                </div>
                            ))}
                        </CardContent>
                        <CardFooter>
                            <Button className="w-full" onClick={() => setStep('consent')}>Continue to Final Consent</Button>
                        </CardFooter>
                    </>
                )}
                {step === 'consent' && (
                    <>
                        <CardHeader>
                            <CardTitle className="font-headline text-2xl">Final Agreement</CardTitle>
                            <CardDescription>One last step to confirm your ownership and control.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <ScrollArea className="h-64 w-full rounded-md border p-4 text-sm">
                                <h3 className="font-bold text-foreground">Your Story, Your Rights</h3>
                                <p className="mt-2 text-muted-foreground">Welcome to Life Logger. Before we begin, we honor your right to:</p>
                                <ul className="my-2 ml-6 list-disc [&>li]:mt-2 text-muted-foreground">
                                    <li>Own your data</li>
                                    <li>Decide what’s shared</li>
                                    <li>Delete anything, anytime</li>
                                </ul>
                                <p className="text-muted-foreground">
                                    By continuing, you agree to our <a href="#" className="underline hover:text-primary">Terms of Service</a> and <a href="#" className="underline hover:text-primary">Privacy Policy</a>. These documents explain:
                                </p>
                                <ul className="my-2 ml-6 list-disc [&>li]:mt-2 text-muted-foreground">
                                    <li>What data we collect (only with your consent)</li>
                                    <li>How it’s protected (end-to-end encryption)</li>
                                    <li>How we anonymize insights (never identifiable)</li>
                                    <li>What control you retain (full ownership and export rights)</li>
                                </ul>
                                <p className="mt-4 font-semibold text-foreground">We never sell your identity or raw data. Only anonymized, aggregated patterns may be used to help others — if you explicitly opt-in.</p>
                                <p className="mt-2 text-muted-foreground">You can revisit this agreement anytime from Settings.</p>
                            </ScrollArea>
                            <div className="flex items-center space-x-2 pt-2">
                                <Checkbox
                                    id="terms"
                                    checked={acceptedConsent}
                                    onCheckedChange={(checked) => setAcceptedConsent(Boolean(checked))}
                                />
                                <label
                                    htmlFor="terms"
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                    I have read and accept the Terms and Privacy Policy
                                </label>
                            </div>
                        </CardContent>
                        <CardFooter className="flex flex-col gap-4">
                             <Button className="w-full" onClick={handleFinalSubmit} disabled={isSubmitting || !acceptedConsent}>
                                {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                Save and Continue
                            </Button>
                            <Button variant="ghost" className="w-full" onClick={handleBackToPermissions} disabled={isSubmitting}>Back to Permissions</Button>
                        </CardFooter>
                    </>
                )}
            </Card>
        </main>
    );
}

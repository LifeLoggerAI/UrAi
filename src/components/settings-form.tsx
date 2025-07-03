
'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { doc, getDoc } from 'firebase/firestore';
import { updateProfile } from 'firebase/auth';
import type { UpdateUserSettings } from '@/lib/types';
import { UpdateUserSettingsSchema } from '@/lib/types';
import { useAuth } from './auth-provider';
import { db, auth } from '@/lib/firebase';
import { updateUserSettingsAction } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Save } from 'lucide-react';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from './ui/form';
import { Skeleton } from './ui/skeleton';

export function SettingsForm() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);

  const form = useForm<UpdateUserSettings>({
    resolver: zodResolver(UpdateUserSettingsSchema),
    defaultValues: {
      displayName: '',
      moodTrackingEnabled: true,
      passiveAudioEnabled: true,
      faceEmotionEnabled: false,
      dataExportEnabled: true,
    },
  });

  useEffect(() => {
    async function fetchUserData() {
      if (user) {
        try {
          const userDocRef = doc(db, 'users', user.uid);
          const userDocSnap = await getDoc(userDocRef);
          if (userDocSnap.exists()) {
            const userData = userDocSnap.data();
            form.reset({
              displayName: userData.displayName || user.displayName || '',
              ...userData.settings,
            });
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          toast({
            variant: "destructive",
            title: "Failed to load settings",
            description: "Could not fetch your current settings. Please try again later."
          })
        } finally {
          setIsLoadingData(false);
        }
      }
    }
    fetchUserData();
  }, [user, form, toast]);

  async function onSubmit(data: UpdateUserSettings) {
    if (!user) return;
    setIsSubmitting(true);
    try {
      const serverUpdatePromise = updateUserSettingsAction({ userId: user.uid, data });
      const authUpdatePromise = updateProfile(user, { displayName: data.displayName });
      
      const [serverResult] = await Promise.all([serverUpdatePromise, authUpdatePromise]);

      if (!serverResult.success) {
        throw new Error(serverResult.error || 'Server update failed');
      }

      toast({
        title: 'Settings Updated',
        description: 'Your profile and settings have been saved.',
      });
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Update Failed",
        description: (error as Error).message,
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoadingData) {
    return (
        <Card>
            <CardHeader>
                <Skeleton className="h-7 w-48" />
                <Skeleton className="h-4 w-full max-w-sm" />
            </CardHeader>
            <CardContent className="space-y-8">
                <div className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-10 w-full" />
                </div>
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-6 w-11 rounded-full" />
                    </div>
                     <div className="flex items-center justify-between">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-6 w-11 rounded-full" />
                    </div>
                </div>
            </CardContent>
             <CardFooter>
                 <Skeleton className="h-10 w-32" />
            </CardFooter>
        </Card>
    )
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle className="font-headline text-2xl">Profile Settings</CardTitle>
            <CardDescription>Manage your display name and application preferences.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            <FormField
              control={form.control}
              name="displayName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Display Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Your Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-4">
                 <h3 className="text-lg font-medium">Data Collection</h3>
                <FormField
                control={form.control}
                name="moodTrackingEnabled"
                render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                            <FormLabel>Enable Mood Tracking</FormLabel>
                            <FormDescription>
                                Allow AI to analyze emotions and sentiment from your entries.
                            </FormDescription>
                        </div>
                         <FormControl>
                            <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            />
                        </FormControl>
                    </FormItem>
                )}
                />
                 <FormField
                control={form.control}
                name="passiveAudioEnabled"
                render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                            <FormLabel>Enable Passive Audio Analysis</FormLabel>
                            <FormDescription>
                                Let the app analyze ambient sounds and conversations.
                            </FormDescription>
                        </div>
                         <FormControl>
                            <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            />
                        </FormControl>
                    </FormItem>
                )}
                />
                 <FormField
                control={form.control}
                name="faceEmotionEnabled"
                render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                            <FormLabel>Enable Facial Emotion Analysis</FormLabel>
                            <FormDescription>
                                Allow camera access to analyze facial expressions.
                            </FormDescription>
                        </div>
                         <FormControl>
                            <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            />
                        </FormControl>
                    </FormItem>
                )}
                />
                 <FormField
                control={form.control}
                name="dataExportEnabled"
                render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                            <FormLabel>Enable Data Export</FormLabel>
                            <FormDescription>
                                Allow your data to be exported in the future.
                            </FormDescription>
                        </div>
                         <FormControl>
                            <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            />
                        </FormControl>
                    </FormItem>
                )}
                />
            </div>

          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isSubmitting || !form.formState.isDirty}>
              {isSubmitting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}
              Save Changes
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}

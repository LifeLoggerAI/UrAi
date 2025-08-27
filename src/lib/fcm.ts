
'use client';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import { app, db } from './firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

export async function saveFcmToken(uid: string) {
  try {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      const messaging = getMessaging(app);
      const vapidKey = process.env.NEXT_PUBLIC_VAPID_KEY;
      if (!vapidKey) {
        console.error("VAPID key is not configured. Push notifications will not work.");
        return;
      }
      
      const currentToken = await getToken(messaging, { vapidKey });

      if (currentToken) {
        console.log('FCM Token:', currentToken);
        const tokenRef = doc(db, `users/${uid}/devices`, currentToken);
        await setDoc(tokenRef, {
          token: currentToken,
          createdAt: serverTimestamp(),
          platform: 'web',
        }, { merge: true });
      } else {
        console.log('No registration token available. Request permission to generate one.');
      }
    } else {
      console.log('Unable to get permission to notify.');
    }
  } catch (err) {
    console.error('An error occurred while retrieving token. ', err);
  }
}

// Handle foreground messages if window is defined
if (typeof window !== 'undefined' && 'Notification' in window) {
    try {
        const messaging = getMessaging(app);
        onMessage(messaging, (payload) => {
            console.log('Foreground message received. ', payload);
            new Notification(payload.notification?.title || 'New Message', {
                body: payload.notification?.body,
                icon: payload.notification?.icon,
            });
        });
    } catch(e) {
        console.error("Could not initialize foreground message handler", e);
    }
}

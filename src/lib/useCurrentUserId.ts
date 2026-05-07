'use client';

import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';

export function useCurrentUserId(fallbackUserId = 'demo-user') {
  const [userId, setUserId] = useState(fallbackUserId);
  const [isAuthReady, setIsAuthReady] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth(), (user) => {
      setUserId(user?.uid ?? fallbackUserId);
      setIsAuthReady(true);
    });

    return unsubscribe;
  }, [fallbackUserId]);

  return { userId, isAuthReady, isDemoUser: userId === fallbackUserId };
}

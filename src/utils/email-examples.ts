// Example: Integration of email system into user registration
// This would go in your authentication/signup component

import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { sendWelcomeEmail } from '../utils/email';

export async function registerUser(email: string, password: string, displayName: string) {
  try {
    // Create user account
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Create user profile in Firestore
    await setDoc(doc(db, 'users', user.uid), {
      email: user.email,
      displayName,
      createdAt: new Date(),
      transactionalEmailOptOut: false, // Default to receiving emails
    });

    // Send welcome email
    await sendWelcomeEmail(user.email!, displayName);

    console.log('✅ User registered and welcome email sent');
    return { success: true, user };

  } catch (error) {
    console.error('❌ Registration failed:', error);
    return { success: false, error };
  }
}

// Example: Send security alert on suspicious login
export async function handleSuspiciousLogin(userEmail: string, ipAddress: string, userAgent: string) {
  const { sendSecurityAlert } = await import('../utils/email');
  
  await sendSecurityAlert(
    userEmail,
    'Suspicious Login Detected',
    `A login was detected from IP ${ipAddress} using ${userAgent}. If this wasn't you, please secure your account immediately.`
  );
}

// Example: Manually trigger weekly summary (for testing)
export async function sendTestWeeklySummary(userEmail: string) {
  const { sendTransactionalEmail } = await import('../utils/email');
  
  const testSummaryHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background-color: #4f46e5; color: white; padding: 20px; text-align: center;">
        <h1>🌱 Your Weekly UrAi Update</h1>
        <p>Test Summary for Development</p>
      </div>
      <div style="padding: 20px;">
        <h2>Hi there,</h2>
        <p>This is a test weekly summary email.</p>
        
        <div style="background-color: #eef2ff; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
          <h3 style="margin: 0 0 5px 0; color: #4338ca;">🌤 Mood Forecast</h3>
          <p style="margin: 0; color: #1e3a8a;">Feeling balanced and reflective this week 🌿</p>
        </div>
        
        <div style="background-color: #ecfdf5; padding: 15px; border-radius: 8px;">
          <h3 style="margin: 0 0 5px 0; color: #065f46;">🏃 Activity Overview</h3>
          <p style="margin: 0; color: #064e3b;">Great job staying active! Keep it up.</p>
        </div>
      </div>
    </div>
  `;

  await sendTransactionalEmail(
    userEmail,
    'Test: Your Weekly UrAi Update 🌱',
    testSummaryHtml
  );
}
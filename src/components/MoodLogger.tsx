// Example: Integrating email notifications into mood logging
// This shows how to trigger emails based on user actions in UrAi

'use client';

import { useState } from 'react';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '../lib/firebase';
import { sendTransactionalEmail } from '../utils/email';

interface MoodLog {
  mood: string;
  score: number;
  notes?: string;
}

export function MoodLogger() {
  const [user] = useAuthState(auth);
  const [mood, setMood] = useState('');
  const [score, setScore] = useState(0);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  const handleMoodSubmission = async (moodData: MoodLog) => {
    if (!user) return;

    setLoading(true);
    
    try {
      // Save mood to Firestore
      await addDoc(collection(db, 'moods'), {
        userId: user.uid,
        mood: moodData.mood,
        score: moodData.score,
        notes: moodData.notes,
        timestamp: serverTimestamp(),
      });

      // Check if this is a concerning mood pattern
      if (moodData.score <= -3) {
        await sendLowMoodSupportEmail(user.email!, user.displayName);
      }

      // Check for milestone achievements
      await checkMoodMilestones(user.uid, moodData.score);

      console.log('✅ Mood logged successfully');
      
      // Reset form
      setMood('');
      setScore(0);
      setNotes('');
      
    } catch (error) {
      console.error('❌ Failed to log mood:', error);
    }
    
    setLoading(false);
  };

  const sendLowMoodSupportEmail = async (email: string, displayName?: string | null) => {
    const supportHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #7c3aed; color: white; padding: 20px; text-align: center;">
          <h1>💜 We're Here for You</h1>
        </div>
        <div style="padding: 20px;">
          <h2>Hi ${displayName || 'there'},</h2>
          <p>We noticed you've been going through a challenging time lately. Remember that it's completely normal to have ups and downs.</p>
          
          <div style="background-color: #f0f9ff; border-left: 4px solid #0ea5e9; padding: 15px; margin: 20px 0;">
            <h3 style="margin: 0 0 10px 0; color: #0c4a6e;">✨ Gentle Reminders</h3>
            <ul style="margin: 0; padding-left: 20px; color: #075985;">
              <li>Your feelings are valid and temporary</li>
              <li>Small steps forward still count as progress</li>
              <li>You've overcome difficult times before</li>
              <li>Seeking support is a sign of strength</li>
            </ul>
          </div>

          <p>Consider trying:</p>
          <ul>
            <li>A short walk or gentle movement</li>
            <li>Reaching out to a friend or loved one</li>
            <li>Practicing a mindfulness exercise</li>
            <li>Engaging in a creative activity</li>
          </ul>

          <div style="background-color: #fef2f2; border: 1px solid #fecaca; padding: 15px; border-radius: 6px; margin: 20px 0;">
            <strong>If you're in crisis:</strong> Please reach out for immediate support:
            <ul style="margin: 10px 0 0 20px;">
              <li>Crisis Text Line: Text HOME to 741741</li>
              <li>National Suicide Prevention Lifeline: 988</li>
              <li>Or contact your local emergency services</li>
            </ul>
          </div>

          <p>Remember, you're not alone in this journey. We're here to support you every step of the way.</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="https://urai.app" style="background-color: #7c3aed; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">
              Open UrAi
            </a>
          </div>
        </div>
      </div>
    `;

    await sendTransactionalEmail(email, '💜 You Matter - Support from UrAi', supportHtml);
  };

  const checkMoodMilestones = async (userId: string, currentScore: number) => {
    // This is a simplified example - in a real app you'd query recent moods
    // and check for patterns like "7 days of positive moods" etc.
    
    if (currentScore >= 4) {
      // High positive mood - celebrate!
      const user = auth.currentUser;
      if (user?.email) {
        await sendMilestoneCelebrationEmail(user.email, user.displayName, 'High Positive Mood');
      }
    }
  };

  const sendMilestoneCelebrationEmail = async (email: string, displayName: string | null, milestone: string) => {
    const celebrationHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #059669; color: white; padding: 20px; text-align: center;">
          <h1>🎉 Milestone Achieved!</h1>
        </div>
        <div style="padding: 20px;">
          <h2>Congratulations, ${displayName || 'there'}!</h2>
          <p>We're excited to celebrate this milestone with you:</p>
          
          <div style="background-color: #f0fdf4; border: 2px solid #22c55e; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0;">
            <h3 style="margin: 0; color: #166534;">✨ ${milestone} ✨</h3>
          </div>

          <p>This achievement shows your dedication to understanding and nurturing your emotional well-being. Keep up the amazing work!</p>
          
          <p>Your journey of self-discovery is inspiring, and every step forward matters.</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="https://urai.app" style="background-color: #059669; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">
              Continue Your Journey
            </a>
          </div>
        </div>
      </div>
    `;

    await sendTransactionalEmail(email, `🎉 Milestone Achieved: ${milestone}`, celebrationHtml);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mood && score !== 0) {
      handleMoodSubmission({ mood, score, notes: notes || undefined });
    }
  };

  if (!user) {
    return <div>Please log in to track your mood.</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-6 max-w-md">
      <h2 className="text-xl font-semibold">How are you feeling?</h2>
      
      <div>
        <label className="block text-sm font-medium mb-1">Mood</label>
        <select 
          value={mood} 
          onChange={(e) => setMood(e.target.value)}
          className="w-full px-3 py-2 border rounded-md"
          required
        >
          <option value="">Select a mood...</option>
          <option value="joyful">😄 Joyful</option>
          <option value="content">🙂 Content</option>
          <option value="neutral">😐 Neutral</option>
          <option value="low">😕 Low</option>
          <option value="distressed">😞 Distressed</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          Intensity (-5 to +5): {score}
        </label>
        <input
          type="range"
          min="-5"
          max="5"
          value={score}
          onChange={(e) => setScore(parseInt(e.target.value))}
          className="w-full"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Notes (Optional)</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="What's contributing to this mood?"
          className="w-full px-3 py-2 border rounded-md"
          rows={3}
        />
      </div>

      <button
        type="submit"
        disabled={loading || !mood}
        className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
      >
        {loading ? 'Logging...' : 'Log Mood'}
      </button>
    </form>
  );
}
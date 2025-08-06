'use client';

import { useState } from 'react';
import { sendTransactionalEmail, sendWelcomeEmail, sendSecurityAlert } from '../utils/email';

/**
 * Email Testing Component
 * This component provides a simple UI for testing the email system during development
 * Remove this from production builds
 */
export function EmailTestingPanel() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<string[]>([]);

  const addResult = (message: string) => {
    setResults(prev => [`${new Date().toLocaleTimeString()}: ${message}`, ...prev.slice(0, 9)]);
  };

  const handleTestWelcome = async () => {
    if (!email) return;
    setLoading(true);
    
    try {
      await sendWelcomeEmail(email, name || undefined);
      addResult(`✅ Welcome email sent to ${email}`);
    } catch (error) {
      addResult(`❌ Failed to send welcome email: ${error}`);
    }
    
    setLoading(false);
  };

  const handleTestSecurity = async () => {
    if (!email) return;
    setLoading(true);
    
    try {
      await sendSecurityAlert(email, 'Test Alert', 'This is a test security alert from UrAi development.');
      addResult(`✅ Security alert sent to ${email}`);
    } catch (error) {
      addResult(`❌ Failed to send security alert: ${error}`);
    }
    
    setLoading(false);
  };

  const handleTestCustom = async () => {
    if (!email) return;
    setLoading(true);
    
    const customHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #4f46e5; color: white; padding: 20px; text-align: center;">
          <h1>🧪 Test Email</h1>
        </div>
        <div style="padding: 20px;">
          <h2>Hello ${name || 'there'}!</h2>
          <p>This is a custom test email from the UrAi development team.</p>
          <p>If you received this, the transactional email system is working correctly! 🎉</p>
          <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <strong>System Status:</strong> ✅ All systems operational
          </div>
        </div>
      </div>
    `;
    
    try {
      await sendTransactionalEmail(email, '🧪 UrAi Email System Test', customHtml);
      addResult(`✅ Custom test email sent to ${email}`);
    } catch (error) {
      addResult(`❌ Failed to send custom email: ${error}`);
    }
    
    setLoading(false);
  };

  // Only show in development
  if (process.env.NODE_ENV === 'production') {
    return null;
  }

  return (
    <div className="border border-gray-300 rounded-lg p-6 m-4 bg-gray-50">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">
        📧 Email System Testing Panel
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email Address
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="test@example.com"
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Name (Optional)
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="John Doe"
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        <button
          onClick={handleTestWelcome}
          disabled={!email || loading}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        >
          Send Welcome Email
        </button>
        
        <button
          onClick={handleTestSecurity}
          disabled={!email || loading}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
        >
          Send Security Alert
        </button>
        
        <button
          onClick={handleTestCustom}
          disabled={!email || loading}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
        >
          Send Custom Test
        </button>
      </div>

      {loading && (
        <p className="text-blue-600 mb-4">Sending email...</p>
      )}

      {results.length > 0 && (
        <div className="mt-4">
          <h4 className="font-medium text-gray-700 mb-2">Recent Results:</h4>
          <div className="bg-white border rounded-md p-3 max-h-40 overflow-y-auto">
            {results.map((result, index) => (
              <div key={index} className="text-sm text-gray-600 py-1">
                {result}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-4 text-xs text-gray-500">
        <p><strong>Note:</strong> This panel only appears in development mode.</p>
        <p>Emails are queued in Firestore and sent via Cloud Functions + SendGrid.</p>
      </div>
    </div>
  );
}
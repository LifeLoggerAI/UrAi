# UrAi Transactional Email System

This document describes the transactional email system implemented for UrAi using SendGrid and Firebase Cloud Functions.

## Overview

The email system consists of:

1. **Cloud Functions** for sending emails via SendGrid
2. **Frontend utilities** for queuing emails from the app
3. **Scheduled weekly summary** emails with personalized data
4. **Beautiful HTML templates** with mood/activity visualizations

## Setup Instructions

### 1. Configure SendGrid

1. Create a SendGrid account and get your API key
2. Set up a verified sender email (e.g., `noreply@urai.app`)
3. Configure the SendGrid API key as a Firebase secret:

```bash
firebase functions:secret:set SENDGRID_API_KEY
```

Enter your SendGrid API key when prompted.

### 2. Update Sender Email

In `functions/src/email-engine.ts`, update the `from` field to your verified sender:

```typescript
from: "noreply@urai.app", // Change to your verified SendGrid sender
```

### 3. Deploy Functions

```bash
cd functions
npm install
npm run build
firebase deploy --only functions
```

## Usage

### Frontend Email Utilities

Use the email utilities in your React components:

```typescript
import { sendTransactionalEmail, sendWelcomeEmail, sendSecurityAlert } from '@/utils/email';

// Send a custom transactional email
await sendTransactionalEmail(
  'user@example.com',
  'Your Weekly UrAi Update',
  '<h1>Custom HTML content</h1>'
);

// Send a welcome email to new users
await sendWelcomeEmail('newuser@example.com', 'John Doe');

// Send security alerts
await sendSecurityAlert(
  'user@example.com', 
  'New Login Detected', 
  'Someone logged into your account from a new device.'
);
```

### Automatic Weekly Summaries

The system automatically sends weekly summary emails every Monday at 9 AM to all users who haven't opted out. These emails include:

- **Mood Forecast**: Summary of the user's mood trends with SVG visualization
- **Activity Overview**: Total activity minutes with bar chart visualization  
- **Weekly Highlights**: Key statistics and milestones

Users can opt out by setting `transactionalEmailOptOut: true` in their user document.

## Data Structure Requirements

The email system expects these Firestore collections:

### `/users` Collection
```typescript
{
  email: string;
  displayName?: string;
  transactionalEmailOptOut?: boolean;
}
```

### `/moods` Collection
```typescript
{
  userId: string;
  score: number;      // -5 to +5 scale
  timestamp: Timestamp;
}
```

### `/activity` Collection  
```typescript
{
  userId: string;
  duration: number;   // minutes
  activityType?: string;
  timestamp: Timestamp;
}
```

### `/emails` Collection (Auto-created)
```typescript
{
  to: string;
  subject: string;
  body: string;       // HTML content
  sent: boolean;
  createdAt: Timestamp;
  sentAt?: Timestamp;
  error?: string;
  errorAt?: Timestamp;
}
```

## Email Templates

The system includes responsive HTML email templates that work across:
- Gmail
- Outlook  
- Apple Mail
- Mobile clients

Templates feature:
- UrAi branding and colors
- Responsive design
- SVG charts for mood trends
- Activity bar charts
- Proper unsubscribe links

## Cloud Functions

### `sendTransactionalEmail`
- **Trigger**: Document created in `/emails` collection
- **Action**: Sends email via SendGrid and updates status
- **Secrets**: Requires `SENDGRID_API_KEY`

### `sendWeeklySummaryEmails`  
- **Trigger**: Scheduled (Mondays at 9 AM EST)
- **Action**: Generates personalized weekly summaries for all users
- **Features**: Mood trends, activity charts, highlights

## Testing

Run the email system tests:

```bash
npm test -- test/email.test.ts
```

Tests cover:
- Email queuing functionality
- Welcome email generation
- Proper data structure validation

## Security & Privacy

- All email sending is done server-side via Cloud Functions
- Users can opt out via `transactionalEmailOptOut` flag
- Emails are only sent to verified users in your Firestore
- No external marketing or promotional emails
- Unsubscribe links point to app settings

## Monitoring

Monitor email delivery via:

1. **Firebase Functions logs**:
   ```bash
   firebase functions:log
   ```

2. **SendGrid dashboard**: Track delivery, opens, clicks

3. **Firestore `/emails` collection**: Check sent status and errors

## Troubleshooting

### Common Issues

1. **Emails not sending**
   - Check SendGrid API key is set correctly
   - Verify sender email is verified in SendGrid
   - Check Cloud Function logs for errors

2. **Weekly summaries not generating**  
   - Verify the scheduled function is deployed
   - Check timezone configuration
   - Ensure users have required data (moods/activity)

3. **Template rendering issues**
   - Test email HTML in multiple clients
   - Verify all template variables are provided
   - Check for missing user data

### Debug Commands

```bash
# Check function deployment
firebase functions:list

# View function logs  
firebase functions:log --only sendTransactionalEmail

# Check secret configuration
firebase functions:secret:access SENDGRID_API_KEY

# Test email manually (add document to /emails collection)
```

## Future Enhancements

Potential improvements:
- Email delivery analytics dashboard
- A/B testing for email templates  
- Personalized send time optimization
- Rich text email composer for admins
- Email template versioning
- Advanced segmentation and targeting
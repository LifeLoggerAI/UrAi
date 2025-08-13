import { onDocumentCreated } from 'firebase-functions/v2/firestore';
import { SecretParam, defineSecret } from 'firebase-functions/v2/secrets';
import { logger } from 'firebase-functions';
import * as admin from 'firebase-admin';
import { DocumentSnapshot, FirestoreEvent } from 'firebase-functions/v2/firestore';

const sendgridKey = defineSecret('SENDGRID_API_KEY');

// Initialize admin SDK if not already initialized
if (admin.apps.length === 0) {
  admin.initializeApp();
}

/**
 * Sends transactional emails via SendGrid when documents are added to /emails collection
 */
export const sendTransactionalEmail = onDocumentCreated(
  {
    document: "emails/{emailId}",
    secrets: [sendgridKey],
  },
  async (event: FirestoreEvent<DocumentSnapshot | undefined, {emailId: string}>) => {
    const emailId = event.params.emailId;
    const snapshot = event.data;

    if (!snapshot) {
      logger.log('No data associated with the event.');
      return null;
    }

    const emailData = snapshot.data();

    // TODO: Implement actual SendGrid integration here
    logger.info(`Sending email ${emailId} to ${emailData.to} with subject: ${emailData.subject}`);
    logger.debug(`Email content: ${emailData.html || emailData.text}`);

    // Mark email as sent (or failed)
    await snapshot.ref.update({ status: 'sent', sentAt: admin.firestore.FieldValue.serverTimestamp() });

    return null;
  }
);

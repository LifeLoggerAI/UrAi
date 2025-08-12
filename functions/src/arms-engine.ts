import { onDocumentWritten } from "firebase-functions/v2/firestore";
import { Change, DocumentSnapshot } from "firebase-functions/v2/firestore";
import { FirestoreEvent } from "firebase-functions/v2/firestore";
import { logger } from "firebase-functions";

// Replace detectEmotionalOverload with this safer version
export const detectEmotionalOverload = onDocumentWritten(
  "armMetrics/{uid}/{dateKey}",
  async (
    event: FirestoreEvent<
      Change<DocumentSnapshot> | undefined,
      { uid: string; dateKey: string }
    >
  ) => {
    // Narrow everything first
    if (!event.data) return;

    const after = event.data.after;
    if (!after.exists) return;

    type ArmMetricsDoc = {
      emotionalEffortLoad?: number;
      connectionEchoScore?: number;
      // add any other fields you read here
    };

    const data = after.data() as ArmMetricsDoc;

    const effort = data.emotionalEffortLoad ?? 0;
    const echo = data.connectionEchoScore ?? 100;

    if (effort > 70 && echo < 40) {
      logger.info(`Emotional overload detected for user ${event.params.uid}.`);
      // TODO: create narratorInsights + push a notification
    }
    return;
  }
);

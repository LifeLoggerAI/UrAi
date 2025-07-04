
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

// Initialize admin SDK if not already initialized
if (admin.apps.length === 0) {
  admin.initializeApp();
}
const db = admin.firestore();

/**
 * Ingests a voice interaction and updates social contact data.
 * This is a placeholder for a complex data ingestion pipeline.
 */
export const voiceInteractionIngest = functions.https.onCall(async (data, context) => {
  const uid = context.auth?.uid;
  if (!uid) {
    throw new functions.https.HttpsError("unauthenticated", "User must be authenticated.");
  }

  functions.logger.info(`Ingesting voice interaction for user ${uid}.`);
  // Logic to:
  // 1. Match or create a /people record.
  // 2. Update interactionCount, voiceMemoryStrength, lastHeardAt, silenceDurationDays.
  // 3. Write a /socialEvents document.
  // 4. Recalculate echoLoopScore.

  return {success: true};
});

/**
 * Analyzes interaction history to determine a contact's social archetype.
 * Triggered when social contact data is updated. Placeholder.
 */
export const socialArchetypeEngine = functions.firestore
  .document("people/{personId}")
  .onUpdate(async (change, context) => {
    const personData = change.after.data();
    if (!personData) return null;

    functions.logger.info(`Running social archetype engine for user ${personData.uid}, contact ${context.params.personId}.`);
    // Logic to call 'ArchetypeShiftEngine' AI model and update socialArchetype.
    return null;
  });

/**
 * Daily check for contacts that have gone silent.
 */
export const checkSilenceThresholds = functions.pubsub
  .schedule("every day 04:30")
  .timeZone("UTC")
  .onRun(async () => {
    functions.logger.info("Running daily social silence check for all users.");

    const usersSnap = await db.collection("users").get();

    for (const userDoc of usersSnap.docs) {
      const uid = userDoc.id;
      const contactsRef = db.collection("people").where("uid", "==", uid);
      const contactsSnap = await contactsRef.get();

      if (contactsSnap.empty) {
        continue;
      }

      const sixtyDaysAgo = Date.now() - (60 * 24 * 60 * 60 * 1000);

      for (const contactDoc of contactsSnap.docs) {
        const contact = contactDoc.data();
        const lastSeen = contact.lastSeen || 0;

        if (lastSeen < sixtyDaysAgo) {
          // Silence threshold met.
          const daysSilent = Math.floor((Date.now() - lastSeen) / (1000 * 60 * 60 * 24));
          const insightId = `silence-${uid}-${contactDoc.id}-${new Date().toISOString().split("T")[0]}`;
          const existingInsight = await db.collection("narratorInsights").doc(insightId).get();

          if (existingInsight.exists) {
            // Insight for this user/contact/day already exists, skip.
            continue;
          }

          functions.logger.info(`Silence threshold met for user ${uid}, contact ${contact.name} (${daysSilent} days). Creating insight.`);

          const insightPayload = {
            uid: uid,
            insightId: insightId,
            insightType: "silence_threshold",
            payload: {
              personId: contactDoc.id,
              personName: contact.name,
              daysSilent: daysSilent,
            },
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            consumed: false,
            ttsUrl: null,
          };
          await db.collection("narratorInsights").doc(insightId).set(insightPayload);

          // Enqueue a push notification
          const notificationPayload = {
            uid: uid,
            type: "insight",
            body: `It's been a while since you've connected with ${contact.name}. A little silence can mean many things.`,
          };
          await db.collection("messages/queue").add(notificationPayload);
        }
      }
    }
    return null;
  });


/**
 * Detects post-interaction emotional echoes.
 * Triggered on new social events. Placeholder.
 */
export const echoLoopDetection = functions.firestore
  .document("socialEvents/{eventId}")
  .onWrite(async (change, context) => {
    const eventData = change.after.data();
    if (!eventData) return null;

    functions.logger.info(`Detecting echo loops for user ${eventData.uid}.`);
    // Logic to compare post-interaction mood signals.
    // If lingering effects, increase echoLoopScore on the socialContact.
    return null;
  });

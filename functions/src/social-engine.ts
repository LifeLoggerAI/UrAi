
import {onCall, HttpsError} from "firebase-functions/v2/https";
import {onDocumentWritten, onDocumentUpdated} from "firebase-functions/v2/firestore";
import {onSchedule} from "firebase-functions/v2/scheduler";
import {logger} from "firebase-functions/v2";
import type {CallableRequest} from "firebase-functions/v2/https";
import type {FirestoreEvent} from "firebase-functions/v2/firestore";
import * as admin from "firebase-admin";
import {genkit} from "genkit";
import {googleAI} from "@genkit-ai/googleai";

// Initialize admin SDK if not already initialized
if (admin.apps.length === 0) {
  admin.initializeApp();
}
const db = admin.firestore();

// Initialize genkit for AI operations
const ai = genkit({
  plugins: [googleAI()],
});

/**
 * Analyzes voice interaction and updates social contact data with pattern detection.
 * This replaces the placeholder implementation with full social pattern engine.
 */
export const analyzeSocialVoice = onCall(async (request: CallableRequest) => {
  const uid = request.auth?.uid;
  if (!uid) {
    throw new HttpsError("unauthenticated", "User must be authenticated.");
  }

  const {contactId, transcript, emotionMeta, duration} = request.data;
  if (!contactId || !transcript) {
    throw new HttpsError("invalid-argument", "Missing required parameters.");
  }

  logger.info(`Analyzing social voice interaction for user ${uid}, contact ${contactId}.`);

  try {
    const summaryPrompt = `
You are a symbolic social AI. Analyze this transcript and emotion data to determine:
- dominant emotional pattern
- archetypal social role (e.g., "The Confidant", "The Challenger", "The Ghost")
- signs of trust, conflict, distance
Return JSON with:
{
  "dominantEmotion": "string",
  "archetype": "string", 
  "conflictEvent": "string or null",
  "symbolicTags": ["array", "of", "tags"]
}

Transcript: ${transcript}
Emotion Metadata: ${JSON.stringify(emotionMeta)}
`;

    const result = await ai.generate({
      model: "googleai/gemini-1.5-flash",
      prompt: summaryPrompt,
    });

    let analysis;
    try {
      analysis = JSON.parse(result.text);
    } catch (parseError) {
      logger.warn("Failed to parse AI response, using defaults", parseError);
      analysis = {
        dominantEmotion: "neutral curiosity",
        archetype: "The Observer",
        conflictEvent: null,
        symbolicTags: ["first-contact"],
      };
    }

    // Update or create social connection
    const connectionRef = db.collection("socialConnections").doc(`${uid}_${contactId}`);
    const existingConnection = await connectionRef.get();

    const connectionData = {
      uid,
      contactId,
      voiceImprint: {
        firstHeard: existingConnection.exists ? 
          existingConnection.data()?.voiceImprint?.firstHeard : Date.now(),
        lastHeard: Date.now(),
        totalDuration: (existingConnection.data()?.voiceImprint?.totalDuration || 0) + (duration || 0),
        dominantEmotion: analysis.dominantEmotion,
        patternLabel: `${analysis.archetype.toLowerCase()}-pattern`,
      },
      archetype: analysis.archetype,
      conflictEvents: analysis.conflictEvent ? 
        [...(existingConnection.data()?.conflictEvents || []), {
          timestamp: Date.now(),
          label: analysis.conflictEvent,
        }] : (existingConnection.data()?.conflictEvents || []),
      lastPatternShift: Date.now(),
      tags: analysis.symbolicTags,
      constellationStrength: Math.min(0.92, 
        (existingConnection.data()?.constellationStrength || 0.1) + 0.1),
    };

    await connectionRef.set(connectionData, {merge: true});

    // Create conversation thread entry
    await createOrUpdateConversationThread(uid, contactId, {
      timestamp: Date.now(),
      type: "voice",
      summary: `Voice interaction: ${analysis.dominantEmotion}`,
      emotion: analysis.dominantEmotion,
    });

    return {success: true, analysis};
  } catch (error) {
    logger.error("Error in analyzeSocialVoice:", error);
    throw new HttpsError("internal", "Failed to analyze social voice interaction.");
  }
});

/**
 * Helper function to create or update conversation threads
 */
async function createOrUpdateConversationThread(
  uid: string, 
  contactId: string, 
  newEntry: any
): Promise<void> {
  // Check for existing thread within 48h window
  const recentThreads = await db.collection("conversationThreads")
    .where("uid", "==", uid)
    .where("contactId", "==", contactId)
    .where("endedAt", ">=", Date.now() - 48 * 3600 * 1000)
    .orderBy("endedAt", "desc")
    .limit(1)
    .get();

  const threadRef = recentThreads.empty
    ? db.collection("conversationThreads").doc()
    : recentThreads.docs[0].ref;

  const threadData = recentThreads.empty
    ? {
        uid,
        contactId,
        threadId: threadRef.id,
        startedAt: Date.now(),
        entries: [],
        dominantEmotion: "neutral",
        symbolicLabel: "New Connection",
        tags: [],
        strengthShift: 0,
      }
    : recentThreads.docs[0].data();

  const updatedEntries = [...(threadData.entries || []), newEntry];

  // Generate thread summary with AI
  try {
    const summaryPrompt = `
Given these interaction summaries, extract:
- dominant emotional arc
- symbolic label for this conversation thread
- descriptive tags
- strength shift (-1 to 1, negative for weakening, positive for strengthening)

Interactions: ${JSON.stringify(updatedEntries.map((e: any) => e.summary))}

Return JSON:
{
  "dominantEmotion": "string",
  "symbolicLabel": "string", 
  "tags": ["array"],
  "strengthShift": number
}
`;

    const result = await ai.generate({
      model: "googleai/gemini-1.5-flash",
      prompt: summaryPrompt,
    });

    let summary;
    try {
      summary = JSON.parse(result.text);
    } catch {
      summary = {
        dominantEmotion: newEntry.emotion,
        symbolicLabel: "Ongoing Dialogue",
        tags: ["continuing"],
        strengthShift: 0.1,
      };
    }

    await threadRef.set({
      ...threadData,
      entries: updatedEntries,
      endedAt: Date.now(),
      dominantEmotion: summary.dominantEmotion,
      symbolicLabel: summary.symbolicLabel,
      tags: summary.tags,
      strengthShift: summary.strengthShift,
    });
  } catch (error) {
    logger.warn("Failed to generate thread summary, using defaults:", error);
    await threadRef.set({
      ...threadData,
      entries: updatedEntries,
      endedAt: Date.now(),
    });
  }
}

/**
 * Detects emotional echoes after social interactions
 */
export const detectEmotionalEcho = onCall(async (request: CallableRequest) => {
  const uid = request.auth?.uid;
  if (!uid) {
    throw new HttpsError("unauthenticated", "User must be authenticated.");
  }

  const {contactId, preMood, postMood, duration, context} = request.data;
  if (!contactId || !preMood || !postMood) {
    throw new HttpsError("invalid-argument", "Missing required parameters.");
  }

  logger.info(`Detecting emotional echo for user ${uid}, contact ${contactId}.`);

  try {
    const prompt = `
Compare these emotional states before and after an interaction:

Pre: ${preMood}
Post: ${postMood}
Context: ${context}
Duration: ${duration} seconds

Determine:
- Emotional delta (change in state)
- Loop detected? (if repeating pattern)
- Symbolic label (e.g., caretaker collapse, ghost drift, validation loop)
- Tags + intensity score (0–1)

Return JSON:
{
  "emotionalDelta": "string",
  "loopDetected": boolean,
  "loopLabel": "string or null",
  "tags": ["array"],
  "intensityScore": number
}
`;

    const result = await ai.generate({
      model: "googleai/gemini-1.5-flash",
      prompt,
    });

    let echo;
    try {
      echo = JSON.parse(result.text);
    } catch {
      echo = {
        emotionalDelta: "neutral shift",
        loopDetected: false,
        loopLabel: null,
        tags: ["standard-interaction"],
        intensityScore: 0.3,
      };
    }

    // Store emotional echo
    await db.collection("emotionalEchoes").add({
      uid,
      contactId,
      timestamp: Date.now(),
      interactionType: "voice",
      duration: duration || 0,
      preState: preMood,
      postState: postMood,
      ...echo,
    });

    // If loop detected, check for shadow patterns
    if (echo.loopDetected) {
      await checkForShadowLoops(uid, contactId);
    }

    return {status: "recorded", ...echo};
  } catch (error) {
    logger.error("Error in detectEmotionalEcho:", error);
    throw new HttpsError("internal", "Failed to detect emotional echo.");
  }
});

/**
 * Helper function to check for shadow loop patterns
 */
async function checkForShadowLoops(uid: string, contactId: string): Promise<void> {
  try {
    // Get recent conversation threads
    const recentThreads = await db.collection("conversationThreads")
      .where("uid", "==", uid)
      .where("contactId", "==", contactId)
      .orderBy("endedAt", "desc")
      .limit(5)
      .get();

    if (recentThreads.size < 3) return; // Need enough data for pattern detection

    const threadSummaries = recentThreads.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        label: data.symbolicLabel,
        emotion: data.dominantEmotion,
        strengthShift: data.strengthShift,
      };
    });

    const prompt = `
You are a relational shadow AI.

Analyze the following conversation arcs and patterns:
${JSON.stringify(threadSummaries)}

Determine:
- Is a negative loop detected?
- Label of the loop (Ghost Drift, Caretaker Collapse, Validation Spiral, etc.)
- Emotional drain score (0–1)
- Symbolic warning message

Return JSON:
{
  "patternType": "string or null",
  "loopStrength": number,
  "symbolicWarning": "string",
  "matchedThreads": ["array", "of", "thread", "ids"],
  "emotionalDrainScore": number
}
`;

    const result = await ai.generate({
      model: "googleai/gemini-1.5-flash",
      prompt,
    });

    let loopAnalysis;
    try {
      loopAnalysis = JSON.parse(result.text);
    } catch {
      return; // Skip if parsing fails
    }

    // Only create shadow loop if pattern detected and significant
    if (loopAnalysis.patternType && loopAnalysis.loopStrength > 0.6) {
      const loopId = `${uid}_${contactId}_${Date.now()}`;
      
      await db.collection("shadowLoops").doc(loopId).set({
        uid,
        contactId,
        loopId,
        detectedAt: Date.now(),
        resolved: false,
        ...loopAnalysis,
      });

      // Suggest a ritual for this shadow loop
      await suggestRitualForShadowLoop(uid, contactId, loopId, loopAnalysis.patternType);
    }
  } catch (error) {
    logger.warn("Error checking shadow loops:", error);
  }
}

/**
 * Suggests a relational ritual for shadow loop resolution
 */
async function suggestRitualForShadowLoop(
  uid: string, 
  contactId: string, 
  loopId: string, 
  patternType: string
): Promise<void> {
  try {
    const prompt = `
A relational shadow loop was detected: ${patternType}

Generate a symbolic ritual to help process or transform this pattern.
Output:
{
  "type": "ritual type (Echo Message, Silent Flame, Boundary Seal, etc.)",
  "prompt": "short emotional prompt text for the user",
  "symbolicAsset": "visual theme/asset name",
  "auraShiftIfCompleted": {
    "before": "current aura color",
    "after": "healed aura color"
  }
}
`;

    const result = await ai.generate({
      model: "googleai/gemini-1.5-flash",
      prompt,
    });

    let ritual;
    try {
      ritual = JSON.parse(result.text);
    } catch {
      ritual = {
        type: "Echo Message",
        prompt: "Write them a letter you'll never send. Say what was never heard.",
        symbolicAsset: "burning-page",
        auraShiftIfCompleted: {
          before: "gray",
          after: "lavender",
        },
      };
    }

    await db.collection("relationalRituals").doc().set({
      uid,
      contactId,
      ritualId: `ritual_${Date.now()}`,
      suggestedAt: Date.now(),
      status: "suggested",
      reason: `Shadow loop resolution: ${patternType}`,
      ...ritual,
    });
  } catch (error) {
    logger.warn("Error suggesting ritual:", error);
  }
}

/**
 * Generates relationship forecasts based on interaction patterns
 */
export const generateRelationshipForecast = onCall(async (request: CallableRequest) => {
  const uid = request.auth?.uid;
  if (!uid) {
    throw new HttpsError("unauthenticated", "User must be authenticated.");
  }

  const {contactId} = request.data;
  if (!contactId) {
    throw new HttpsError("invalid-argument", "Missing contactId parameter.");
  }

  logger.info(`Generating relationship forecast for user ${uid}, contact ${contactId}.`);

  try {
    // Gather recent data
    const [threadsSnap, shadowsSnap, bloomsSnap] = await Promise.all([
      db.collection("conversationThreads")
        .where("uid", "==", uid)
        .where("contactId", "==", contactId)
        .orderBy("endedAt", "desc")
        .limit(5)
        .get(),
      db.collection("shadowLoops")
        .where("uid", "==", uid)
        .where("contactId", "==", contactId)
        .orderBy("detectedAt", "desc")
        .limit(1)
        .get(),
      db.collection("recoveryBlooms")
        .where("uid", "==", uid)
        .where("contactId", "==", contactId)
        .orderBy("triggeredAt", "desc")
        .limit(1)
        .get(),
    ]);

    const prompt = `
Given these relational data points:
- Recent thread labels and emotional tones: ${JSON.stringify(threadsSnap.docs.map(doc => doc.data()))}
- Most recent shadow loop: ${shadowsSnap.empty ? "none" : JSON.stringify(shadowsSnap.docs[0].data())}
- Most recent recovery bloom: ${bloomsSnap.empty ? "none" : JSON.stringify(bloomsSnap.docs[0].data())}

Forecast for this week:
- Emotional tone shift
- Distance trend (connecting, drifting, stable)
- Aura projection (color and animation)
- Symbolic reading (one poetic sentence)
- Warning if any

Return JSON:
{
  "toneShift": "string",
  "distanceTrend": "string",
  "warning": "string or null",
  "symbolicReading": "string",
  "auraProjection": {
    "color": "string",
    "animation": "string"
  },
  "predictiveConfidence": number
}
`;

    const result = await ai.generate({
      model: "googleai/gemini-1.5-flash",
      prompt,
    });

    let forecast;
    try {
      forecast = JSON.parse(result.text);
    } catch {
      forecast = {
        toneShift: "gentle stability",
        distanceTrend: "maintaining connection",
        warning: null,
        symbolicReading: "Two hearts in quiet orbit, neither pulling closer nor away.",
        auraProjection: {
          color: "soft blue",
          animation: "gentle pulse",
        },
        predictiveConfidence: 0.5,
      };
    }

    // Store forecast
    await db.collection("relationshipForecasts").doc().set({
      uid,
      contactId,
      forecastId: `forecast_${Date.now()}`,
      generatedAt: Date.now(),
      forecastWindow: "This Week",
      ...forecast,
    });

    return {status: "forecast generated", ...forecast};
  } catch (error) {
    logger.error("Error in generateRelationshipForecast:", error);
    throw new HttpsError("internal", "Failed to generate relationship forecast.");
  }
});

/**
 * Triggers recovery bloom when positive patterns are detected
 */
export const triggerRecoveryBloom = onCall(async (request: CallableRequest) => {
  const uid = request.auth?.uid;
  if (!uid) {
    throw new HttpsError("unauthenticated", "User must be authenticated.");
  }

  const {contactId, resolvedLoopId, cause} = request.data;
  if (!contactId) {
    throw new HttpsError("invalid-argument", "Missing required parameters.");
  }

  logger.info(`Triggering recovery bloom for user ${uid}, contact ${contactId}.`);

  try {
    const prompt = `
A relational healing moment occurred.

Generate:
- Symbolic title of recovery
- Aura color shift (before/after)
- Bloom quote (1 sentence insight)
- Visual theme

Context: ${cause || "Positive interaction pattern detected"}

Return JSON:
{
  "symbolicType": "string",
  "bloomQuote": "string",
  "visualStyle": "string",
  "auraChange": {
    "before": "string",
    "after": "string"
  }
}
`;

    const result = await ai.generate({
      model: "googleai/gemini-1.5-flash",
      prompt,
    });

    let bloom;
    try {
      bloom = JSON.parse(result.text);
    } catch {
      bloom = {
        symbolicType: "Emotional Regrowth",
        bloomQuote: "You learned to hold space without losing yourself.",
        visualStyle: "rose-glow-orbit",
        auraChange: {
          before: "gray",
          after: "rose",
        },
      };
    }

    // Store recovery bloom
    await db.collection("recoveryBlooms").doc().set({
      uid,
      contactId,
      bloomId: `bloom_${Date.now()}`,
      triggeredAt: Date.now(),
      cause: cause || "Pattern resolution",
      resolvedLoopId,
      ...bloom,
    });

    // Mark shadow loop as resolved if applicable
    if (resolvedLoopId) {
      await db.collection("shadowLoops").doc(resolvedLoopId).update({
        resolved: true,
        resolutionEvent: `Recovery bloom: ${bloom.symbolicType}`,
      });
    }

    return {status: "recovery bloom triggered", ...bloom};
  } catch (error) {
    logger.error("Error in triggerRecoveryBloom:", error);
    throw new HttpsError("internal", "Failed to trigger recovery bloom.");
  }
});

/**
 * Social archetype analysis triggered on people updates
 */
export const socialArchetypeEngine = onDocumentUpdated("people/{personId}", async (event: FirestoreEvent<any>) => {
  const personData = event.data?.after.data();
  if (!personData) return;

  const {uid} = personData;
  const contactId = event.params.personId;

  logger.info(`Running social archetype engine for user ${uid}, contact ${contactId}.`);

  try {
    // Check if we have a social connection record
    const connectionRef = db.collection("socialConnections").doc(`${uid}_${contactId}`);
    const connectionSnap = await connectionRef.get();

    if (!connectionSnap.exists) {
      // Create initial social connection
      await connectionRef.set({
        uid,
        contactId,
        voiceImprint: {
          firstHeard: personData.lastSeen || Date.now(),
          lastHeard: personData.lastSeen || Date.now(),
          totalDuration: 0,
          dominantEmotion: "neutral curiosity",
          patternLabel: "new-connection",
        },
        archetype: "The Observer",
        conflictEvents: [],
        lastPatternShift: Date.now(),
        tags: ["initial-contact"],
        constellationStrength: 0.1,
      });
    }

    // Update person archetype based on interaction history
    const recentThreads = await db.collection("conversationThreads")
      .where("uid", "==", uid)
      .where("contactId", "==", contactId)
      .orderBy("endedAt", "desc")
      .limit(3)
      .get();

    if (!recentThreads.empty) {
      const threadData = recentThreads.docs.map(doc => doc.data());
      const dominantEmotions = threadData.map(t => t.dominantEmotion);
      
      // Simple archetype inference based on dominant emotions
      let inferredArchetype = "The Observer";
      
      if (dominantEmotions.some(e => e.includes("support") || e.includes("comfort"))) {
        inferredArchetype = "The Confidant";
      } else if (dominantEmotions.some(e => e.includes("challenge") || e.includes("debate"))) {
        inferredArchetype = "The Challenger";
      } else if (dominantEmotions.some(e => e.includes("distant") || e.includes("absent"))) {
        inferredArchetype = "The Ghost";
      } else if (dominantEmotions.some(e => e.includes("guidance") || e.includes("wisdom"))) {
        inferredArchetype = "The Guide";
      }

      // Update social connection with inferred archetype
      await connectionRef.update({
        archetype: inferredArchetype,
        lastPatternShift: Date.now(),
      });
    }
  } catch (error) {
    logger.warn("Error in socialArchetypeEngine:", error);
  }
});


/**
 * Daily check for contacts that have gone silent and relationship pattern analysis.
 */
export const checkSilenceThresholds = onSchedule("30 04 * * *", async () => {
  logger.info("Running daily social silence check and pattern analysis.");

  const sixtyDaysAgo = Date.now() - (60 * 24 * 60 * 60 * 1000);
  const staleContactsQuery = db.collection("people").where("lastSeen", "<", sixtyDaysAgo);

  const staleContactsSnap = await staleContactsQuery.get();

  if (staleContactsSnap.empty) {
    logger.info("No stale contacts found.");
  } else {
    for (const contactDoc of staleContactsSnap.docs) {
      const contact = contactDoc.data();
      const {uid, name: personName} = contact;
      const daysSilent = Math.floor((Date.now() - contact.lastSeen) / (1000 * 60 * 60 * 24));
      
      // Prevents sending multiple notifications for the same stale contact on the same day
      const insightId = `silence-${uid}-${contactDoc.id}-${new Date().toISOString().split("T")[0]}`;
      const existingInsight = await db.collection("narratorInsights").doc(insightId).get();

      if (existingInsight.exists) {
        continue;
      }

      logger.info(`Silence threshold met for user ${uid}, contact ${personName} (${daysSilent} days). Creating insight.`);

      const insightPayload = {
        uid: uid,
        insightId: insightId,
        insightType: "silence_threshold",
        payload: {
          personId: contactDoc.id,
          personName: personName,
          daysSilent: daysSilent,
        },
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        consumed: false,
        ttsUrl: null,
      };
      await db.collection("narratorInsights").doc(insightId).set(insightPayload);

      // Suggest silence ritual
      try {
        await db.collection("relationalRituals").doc().set({
          uid,
          contactId: contactDoc.id,
          ritualId: `ritual_silence_${Date.now()}`,
          suggestedAt: Date.now(),
          type: "Silent Flame",
          prompt: `Light a candle for ${personName}. Let the silence speak what words cannot.`,
          reason: `${daysSilent} days of silence`,
          symbolicAsset: "candle-flame",
          auraShiftIfCompleted: {
            before: "gray",
            after: "warm-gold",
          },
          status: "suggested",
        });
      } catch (error) {
        logger.warn("Failed to create silence ritual:", error);
      }

      // Enqueue a push notification
      const notificationPayload = {
        uid: uid,
        type: "insight",
        body: `It's been a while since you've connected with ${personName}. A little silence can mean many things.`,
      };
      await db.collection("messages/queue").add(notificationPayload);
    }
  }

  // Also run weekly relationship forecasts for active connections
  await generateWeeklyForecasts();
  
  return;
});

/**
 * Helper function to generate weekly forecasts for active connections
 */
async function generateWeeklyForecasts(): Promise<void> {
  try {
    // Get all active social connections (interacted within last 30 days)
    const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
    const activeConnections = await db.collection("socialConnections")
      .where("voiceImprint.lastHeard", ">=", thirtyDaysAgo)
      .get();

    logger.info(`Generating forecasts for ${activeConnections.size} active connections.`);

    const forecastPromises = activeConnections.docs.map(async (connectionDoc) => {
      const connection = connectionDoc.data();
      try {
        // Generate forecast for each active connection
        const forecast = await generateForecastForConnection(connection.uid, connection.contactId);
        return forecast;
      } catch (error) {
        logger.warn(`Failed to generate forecast for ${connection.uid}_${connection.contactId}:`, error);
        return null;
      }
    });

    await Promise.allSettled(forecastPromises);
  } catch (error) {
    logger.error("Error in generateWeeklyForecasts:", error);
  }
}

/**
 * Helper to generate forecast for a specific connection
 */
async function generateForecastForConnection(uid: string, contactId: string): Promise<any> {
  // Get recent interaction patterns
  const [threadsSnap, echoesSnap] = await Promise.all([
    db.collection("conversationThreads")
      .where("uid", "==", uid)
      .where("contactId", "==", contactId)
      .orderBy("endedAt", "desc")
      .limit(3)
      .get(),
    db.collection("emotionalEchoes")
      .where("uid", "==", uid)
      .where("contactId", "==", contactId)
      .orderBy("timestamp", "desc")
      .limit(5)
      .get(),
  ]);

  if (threadsSnap.empty && echoesSnap.empty) {
    return null; // No data to forecast from
  }

  const prompt = `
Based on recent interaction patterns:
- Threads: ${JSON.stringify(threadsSnap.docs.map(doc => doc.data().symbolicLabel))}
- Echo patterns: ${JSON.stringify(echoesSnap.docs.map(doc => doc.data().emotionalDelta))}

Predict this week's relational weather:
{
  "toneShift": "string",
  "distanceTrend": "string", 
  "symbolicReading": "string",
  "predictiveConfidence": number
}
`;

  const result = await ai.generate({
    model: "googleai/gemini-1.5-flash",
    prompt,
  });

  let forecast;
  try {
    forecast = JSON.parse(result.text);
  } catch {
    return null;
  }

  // Store the forecast
  await db.collection("relationshipForecasts").doc().set({
    uid,
    contactId,
    forecastId: `weekly_${Date.now()}`,
    generatedAt: Date.now(),
    forecastWindow: "This Week",
    auraProjection: {
      color: "soft-blue",
      animation: "gentle-pulse",
    },
    ...forecast,
  });

  return forecast;
}

/**
 * Enhanced echo loop detection triggered on new social events
 */
export const echoLoopDetection = onDocumentWritten("socialEvents/{eventId}", async (event: FirestoreEvent<any>) => {
  const eventData = event.data?.after.data();
  if (!eventData) return;

  const {uid, personId} = eventData;
  logger.info(`Enhanced echo loop detection for user ${uid}, person ${personId}.`);

  try {
    // Check for recent emotional echoes
    const recentEchoes = await db.collection("emotionalEchoes")
      .where("uid", "==", uid)
      .where("contactId", "==", personId)
      .orderBy("timestamp", "desc")
      .limit(3)
      .get();

    if (recentEchoes.size >= 2) {
      const echoes = recentEchoes.docs.map(doc => doc.data());
      const drainPattern = echoes.filter(echo => echo.intensityScore > 0.7).length;

      // If multiple high-intensity negative echoes, trigger pattern analysis
      if (drainPattern >= 2) {
        await checkForShadowLoops(uid, personId);
      }
    }
  } catch (error) {
    logger.warn("Error in echoLoopDetection:", error);
  }
});

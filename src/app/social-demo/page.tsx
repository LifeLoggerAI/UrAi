"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SocialConstellation } from "@/components/social-constellation";
import { ConversationThreadList } from "@/components/conversation-thread-list";
import { EmotionalEchoMap } from "@/components/emotional-echo-map";
import { RelationalRitualCard } from "@/components/relational-ritual-card";
import { Users, Heart, Activity, Sparkles } from "lucide-react";

// Mock data for demonstration
const mockSocialConnections = [
  {
    uid: "user123",
    contactId: "contact1",
    voiceImprint: {
      firstHeard: Date.now() - 30 * 24 * 60 * 60 * 1000,
      lastHeard: Date.now() - 2 * 24 * 60 * 60 * 1000,
      totalDuration: 3600,
      dominantEmotion: "warm curiosity",
      patternLabel: "deep-listener",
    },
    archetype: "The Confidant",
    conflictEvents: [],
    lastPatternShift: Date.now() - 7 * 24 * 60 * 60 * 1000,
    tags: ["deep-connection", "emotional-support"],
    constellationStrength: 0.85,
  },
  {
    uid: "user123",
    contactId: "contact2",
    voiceImprint: {
      firstHeard: Date.now() - 60 * 24 * 60 * 60 * 1000,
      lastHeard: Date.now() - 14 * 24 * 60 * 60 * 1000,
      totalDuration: 1200,
      dominantEmotion: "distant tension",
      patternLabel: "fading-echo",
    },
    archetype: "The Ghost",
    conflictEvents: [
      { timestamp: Date.now() - 14 * 24 * 60 * 60 * 1000, label: "sudden silence after vulnerability" },
      { timestamp: Date.now() - 21 * 24 * 60 * 60 * 1000, label: "tone drop after disagreement" },
    ],
    lastPatternShift: Date.now() - 14 * 24 * 60 * 60 * 1000,
    tags: ["ghost-loop", "emotional-distance", "unresolved"],
    constellationStrength: 0.3,
  },
  {
    uid: "user123",
    contactId: "contact3",
    voiceImprint: {
      firstHeard: Date.now() - 90 * 24 * 60 * 60 * 1000,
      lastHeard: Date.now() - 1 * 24 * 60 * 60 * 1000,
      totalDuration: 7200,
      dominantEmotion: "challenging growth",
      patternLabel: "truth-mirror",
    },
    archetype: "The Challenger",
    conflictEvents: [
      { timestamp: Date.now() - 7 * 24 * 60 * 60 * 1000, label: "heated debate about values" },
    ],
    lastPatternShift: Date.now() - 1 * 24 * 60 * 60 * 1000,
    tags: ["growth-catalyst", "intellectual-sparring", "boundary-pushing"],
    constellationStrength: 0.7,
  },
];

const mockConversationThreads = [
  {
    uid: "user123",
    contactId: "contact1",
    threadId: "thread1",
    startedAt: Date.now() - 3 * 24 * 60 * 60 * 1000,
    endedAt: Date.now() - 2 * 24 * 60 * 60 * 1000,
    entries: [
      {
        timestamp: Date.now() - 3 * 24 * 60 * 60 * 1000,
        type: "voice",
        summary: "Shared deep fears about career transition",
        emotion: "vulnerable openness",
      },
      {
        timestamp: Date.now() - 2.5 * 24 * 60 * 60 * 1000,
        type: "text",
        summary: "They offered practical advice and emotional support",
        emotion: "caring guidance",
      },
      {
        timestamp: Date.now() - 2 * 24 * 60 * 60 * 1000,
        type: "voice",
        summary: "Felt heard and understood, made action plans together",
        emotion: "empowered clarity",
      },
    ],
    dominantEmotion: "healing connection",
    symbolicLabel: "The Bridge Back to Courage",
    tags: ["vulnerability", "support", "growth"],
    strengthShift: 0.4,
  },
  {
    uid: "user123",
    contactId: "contact2",
    threadId: "thread2",
    startedAt: Date.now() - 14 * 24 * 60 * 60 * 1000,
    endedAt: Date.now() - 14 * 24 * 60 * 60 * 1000,
    entries: [
      {
        timestamp: Date.now() - 14 * 24 * 60 * 60 * 1000,
        type: "voice",
        summary: "Opened up about feeling lost and confused",
        emotion: "raw vulnerability",
      },
      {
        timestamp: Date.now() - 14 * 24 * 60 * 60 * 1000 + 3600000,
        type: "text",
        summary: "They responded with short, distant message",
        emotion: "cold acknowledgment",
      },
    ],
    dominantEmotion: "unfinished yearning",
    symbolicLabel: "The Open Door That Closed Again",
    tags: ["ghost-loop", "emotional-exposure", "abandonment"],
    strengthShift: -0.6,
  },
];

const mockEmotionalEchoes = [
  {
    uid: "user123",
    contactId: "contact1",
    timestamp: Date.now() - 2 * 24 * 60 * 60 * 1000,
    interactionType: "voice" as const,
    duration: 1800,
    preState: "anxious uncertainty",
    postState: "calm clarity",
    emotionalDelta: "lifted from heavy to light",
    loopDetected: false,
    tags: ["healing-conversation", "energy-gain"],
    intensityScore: 0.3,
  },
  {
    uid: "user123",
    contactId: "contact2",
    timestamp: Date.now() - 14 * 24 * 60 * 60 * 1000,
    interactionType: "voice" as const,
    duration: 600,
    preState: "hopeful openness",
    postState: "confused disappointment",
    emotionalDelta: "dropped from hope to hollow",
    loopDetected: true,
    loopLabel: "Caretaker Collapse",
    tags: ["energy-drain", "emotional-whiplash", "abandonment-trigger"],
    intensityScore: 0.8,
  },
  {
    uid: "user123",
    contactId: "contact3",
    timestamp: Date.now() - 1 * 24 * 60 * 60 * 1000,
    interactionType: "voice" as const,
    duration: 2400,
    preState: "comfortable routine",
    postState: "energized challenge",
    emotionalDelta: "shaken awake from complacency",
    loopDetected: false,
    tags: ["growth-catalyst", "boundary-expansion", "intellectual-stimulation"],
    intensityScore: 0.6,
  },
];

const mockRelationalRituals = [
  {
    uid: "user123",
    contactId: "contact2",
    ritualId: "ritual1",
    suggestedAt: Date.now() - 12 * 60 * 60 * 1000,
    type: "Echo Message",
    prompt: "Write them a letter you'll never send. Say what was never heard.",
    reason: "Shadow loop resolution: Ghost Drift pattern detected",
    symbolicAsset: "burning-page",
    auraShiftIfCompleted: {
      before: "gray",
      after: "lavender",
    },
    status: "suggested" as const,
  },
  {
    uid: "user123",
    contactId: "contact3",
    ritualId: "ritual2",
    suggestedAt: Date.now() - 2 * 24 * 60 * 60 * 1000,
    type: "Boundary Seal",
    prompt: "Light a candle and speak your truth aloud. Let the flame hold what words cannot carry.",
    reason: "After challenging conversation - integration needed",
    symbolicAsset: "protective-flame",
    auraShiftIfCompleted: {
      before: "orange",
      after: "gold",
    },
    status: "completed" as const,
  },
];

const mockContacts = {
  contact1: { name: "Alex Chen", archetype: "The Confidant" },
  contact2: { name: "Morgan River", archetype: "The Ghost" },
  contact3: { name: "Sam Torres", archetype: "The Challenger" },
};

export default function SocialPatternDemo() {
  const [selectedConnection, setSelectedConnection] = useState<string | null>(null);
  
  const handleConnectionClick = (connection: any) => {
    setSelectedConnection(connection.contactId);
  };

  const handleRitualComplete = async (ritual: any) => {
    console.log("Completing ritual:", ritual);
    // In real implementation, this would call the Firebase function
    await new Promise(resolve => setTimeout(resolve, 1000));
  };

  const handleRitualDismiss = (ritual: any) => {
    console.log("Dismissing ritual:", ritual);
    // In real implementation, this would update the ritual status
  };

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Social Pattern Engine</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Experience the symbolic visualization of your relationship patterns, emotional echoes, 
          and healing rituals. This demo showcases the Social Pattern Engine in action.
        </p>
      </div>

      <Tabs defaultValue="constellation" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="constellation" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Constellation
          </TabsTrigger>
          <TabsTrigger value="threads" className="flex items-center gap-2">
            <Heart className="h-4 w-4" />
            Threads
          </TabsTrigger>
          <TabsTrigger value="echoes" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Echoes
          </TabsTrigger>
          <TabsTrigger value="rituals" className="flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            Rituals
          </TabsTrigger>
        </TabsList>

        <TabsContent value="constellation" className="space-y-4">
          <SocialConstellation 
            connections={mockSocialConnections}
            onConnectionClick={handleConnectionClick}
          />
          
          {selectedConnection && (
            <Card>
              <CardHeader>
                <CardTitle>Connection Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Selected: {mockContacts[selectedConnection as keyof typeof mockContacts]?.name}
                </p>
                <p className="text-xs mt-2">
                  Click on different nodes in the constellation to explore their patterns and relationships.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="threads" className="space-y-4">
          <ConversationThreadList 
            threads={mockConversationThreads}
            onThreadClick={(thread) => console.log("Thread clicked:", thread)}
          />
        </TabsContent>

        <TabsContent value="echoes" className="space-y-4">
          <EmotionalEchoMap 
            echoes={mockEmotionalEchoes}
            contacts={mockContacts}
          />
        </TabsContent>

        <TabsContent value="rituals" className="space-y-4">
          <RelationalRitualCard
            rituals={mockRelationalRituals}
            onRitualComplete={handleRitualComplete}
            onRitualDismiss={handleRitualDismiss}
          />
        </TabsContent>
      </Tabs>

      {/* Implementation Status */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Implementation Status</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <h4 className="font-medium text-green-600">✓ Implemented</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Social connection schemas and types</li>
                <li>• Voice interaction analysis functions</li>
                <li>• Emotional echo detection</li>
                <li>• Conversation thread grouping</li>
                <li>• Shadow loop pattern detection</li>
                <li>• Recovery bloom triggers</li>
                <li>• Relationship forecasting</li>
                <li>• Relational ritual suggestions</li>
                <li>• Complete UI components with symbolic visualization</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-blue-600">⚙️ Ready for Integration</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Connect to existing voice processing pipeline</li>
                <li>• Add Firebase Functions deployment</li>
                <li>• Create social pattern data fetching hooks</li>
                <li>• Integrate with existing people/person management</li>
                <li>• Add real-time pattern updates</li>
                <li>• Connect ritual completion to aura changes</li>
              </ul>
            </div>
          </div>
          
          <div className="pt-4 border-t">
            <p className="text-xs text-muted-foreground">
              This demo shows the complete Social Pattern Engine with mock data. All core functionality 
              has been implemented following the minimal-change approach, building upon existing URAI systems.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
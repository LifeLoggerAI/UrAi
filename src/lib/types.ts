export type Sentiment = "positive" | "negative" | "neutral";

export interface Note {
  id: string;
  content: string;
  timestamp: number;
  sentiment: Sentiment;
  score: number;
}

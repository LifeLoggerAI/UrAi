import type { ChapterId, MemoryEmotion } from './lifeMapEvents';
import type { MemoryStar } from './useMemoryStars';

export type PatternClusterType = 'emotion' | 'chapter' | 'unresolved-loop' | 'recovery-thread';

export type PatternCluster = {
  id: string;
  type: PatternClusterType;
  label: string;
  starIds: string[];
  emotion?: MemoryEmotion;
  chapterId?: ChapterId;
  intensity: number;
  unresolvedWeight: number;
  recency: number;
  narrativeLine: string;
};

function average(values: number[]) {
  if (!values.length) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function clusterLabel(type: PatternClusterType, key: string) {
  if (type === 'unresolved-loop') return 'Unresolved Loop';
  if (type === 'recovery-thread') return 'Recovery Thread';
  return key
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function clusterLine(cluster: Omit<PatternCluster, 'narrativeLine'>) {
  if (cluster.type === 'unresolved-loop') {
    return `This cluster is repeating with high unresolved weight across ${cluster.starIds.length} memories.`;
  }

  if (cluster.type === 'recovery-thread') {
    return `This recovery thread shows ${cluster.starIds.length} moments where pressure began turning into return.`;
  }

  if (cluster.type === 'chapter' && cluster.chapterId) {
    return `A ${clusterLabel('chapter', cluster.chapterId)} pattern is forming across ${cluster.starIds.length} memories.`;
  }

  if (cluster.type === 'emotion' && cluster.emotion) {
    return `A recurring ${cluster.emotion} signal is visible across ${cluster.starIds.length} memories.`;
  }

  return `A recurring pattern is visible across ${cluster.starIds.length} memories.`;
}

function makeCluster(type: PatternClusterType, key: string, stars: MemoryStar[]): PatternCluster {
  const base = {
    id: `${type}:${key}`,
    type,
    label: clusterLabel(type, key),
    starIds: stars.map((star) => star.id),
    emotion: type === 'emotion' ? (key as MemoryEmotion) : undefined,
    chapterId: type === 'chapter' ? (key as ChapterId) : undefined,
    intensity: average(stars.map((star) => star.intensity)),
    unresolvedWeight: average(stars.map((star) => star.unresolvedWeight)),
    recency: average(stars.map((star) => star.recency)),
  };

  return {
    ...base,
    narrativeLine: clusterLine(base),
  };
}

function groupBy<T extends string>(stars: MemoryStar[], picker: (star: MemoryStar) => T) {
  const groups = new Map<T, MemoryStar[]>();
  stars.forEach((star) => {
    const key = picker(star);
    groups.set(key, [...(groups.get(key) ?? []), star]);
  });
  return groups;
}

export function buildPatternClusters(stars: MemoryStar[]) {
  const clusters: PatternCluster[] = [];

  groupBy(stars, (star) => star.emotion).forEach((items, emotion) => {
    if (items.length >= 2) clusters.push(makeCluster('emotion', emotion, items));
  });

  groupBy(stars, (star) => star.chapterId).forEach((items, chapterId) => {
    if (items.length >= 2) clusters.push(makeCluster('chapter', chapterId, items));
  });

  const unresolved = stars.filter((star) => star.unresolvedWeight >= 0.65);
  if (unresolved.length >= 2) clusters.push(makeCluster('unresolved-loop', 'unresolved', unresolved));

  const recovery = stars.filter((star) => star.emotion === 'recovery' || star.chapterId === 'recovery-arc');
  if (recovery.length >= 2) clusters.push(makeCluster('recovery-thread', 'recovery', recovery));

  return clusters.sort((a, b) => {
    const aScore = a.intensity * 0.35 + a.unresolvedWeight * 0.4 + a.recency * 0.25;
    const bScore = b.intensity * 0.35 + b.unresolvedWeight * 0.4 + b.recency * 0.25;
    return bScore - aScore;
  });
}

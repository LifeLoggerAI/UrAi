const RATE_LIMIT = 100; // requests per hour per user
const userBuckets = new Map();

export function checkRateLimit(userId) {
  const now = Date.now();
  let bucket = userBuckets.get(userId) || { count: 0, last: now };
  if (now - bucket.last > 3600000) bucket = { count: 0, last: now };
  bucket.count += 1;
  userBuckets.set(userId, bucket);
  return bucket.count <= RATE_LIMIT;
}
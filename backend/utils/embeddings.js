import { pipeline, env } from '@xenova/transformers';

// Run fully locally: never try to hit a remote inference API, only download
// the (small, ~30MB) model weights once and cache them on disk.
env.allowRemoteModels = true;
env.allowLocalModels = true;

const MODEL_NAME = 'Xenova/all-MiniLM-L6-v2';

// Lazy singleton: the model is loaded once on first use and reused for every
// subsequent call. We also guard against concurrent first-time loads so two
// requests arriving together don't each spin up their own pipeline.
let extractorPromise = null;

const getExtractor = () => {
  if (!extractorPromise) {
    extractorPromise = pipeline('feature-extraction', MODEL_NAME);
  }
  return extractorPromise;
};

/**
 * Turn a piece of text into a normalized embedding vector (384 dims).
 * Because the vectors are normalized, cosine similarity reduces to a dot
 * product, but we keep a general cosineSimilarity helper for clarity.
 * @param {string} text
 * @returns {Promise<number[]>}
 */
export const embed = async (text) => {
  const clean = (text || '').toString().trim();
  if (!clean) return [];

  const extractor = await getExtractor();
  const output = await extractor(clean, { pooling: 'mean', normalize: true });
  return Array.from(output.data);
};

/**
 * Cosine similarity between two equal-length numeric vectors.
 * Returns a value in roughly [-1, 1]; higher means more similar.
 * @param {number[]} a
 * @param {number[]} b
 * @returns {number}
 */
export const cosineSimilarity = (a = [], b = []) => {
  if (!a.length || !b.length || a.length !== b.length) return 0;

  let dot = 0;
  let magA = 0;
  let magB = 0;
  for (let i = 0; i < a.length; i += 1) {
    dot += a[i] * b[i];
    magA += a[i] * a[i];
    magB += b[i] * b[i];
  }

  if (magA === 0 || magB === 0) return 0;
  return dot / (Math.sqrt(magA) * Math.sqrt(magB));
};

/**
 * Build the canonical text used to embed a found item, so that found items and
 * lost-item queries are described in a comparable way.
 */
export const buildFoundText = ({ title, description, category, location } = {}) =>
  [title, description, category && `Category: ${category}`, location && `Found at ${location}`]
    .filter(Boolean)
    .join('. ');

/**
 * Build the canonical text used to embed a lost-item request.
 */
export const buildLostText = ({ title, description, itemLostLocation } = {}) =>
  [title, description, itemLostLocation && `Lost at ${itemLostLocation}`]
    .filter(Boolean)
    .join('. ');

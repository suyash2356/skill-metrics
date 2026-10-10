/**
 * src/lib/skillEncoder.ts
 *
 * 64-dim semantic encoder for Skill-Metrics search.
 * Matches Python reference exactly: FNV-1a, word + char n-grams, mean-pool, L2-norm.
 * Model files are fetched once on first call and cached in module scope.
 */

// ── FNV-1a 32-bit ─────────────────────────────────────────────────────────────

const _utf8 = new TextEncoder();

function fnv1a(s: string): number {
  const bytes = _utf8.encode(s);
  let h = 2166136261; // 0x811c9dc5
  for (let i = 0; i < bytes.length; i++) {
    h ^= bytes[i];
    h = Math.imul(h, 16777619) >>> 0;
  }
  return h >>> 0;
}

// ── Query cleaning ────────────────────────────────────────────────────────────

export const FILLER = new Set([
  'become', 'learn', 'what', 'after', 'how', 'to', 'a', 'an', 'the', 'for',
  'and', 'my', 'me', 'want', 'i', 'basics', 'beginner', 'beginners',
  'guide', 'course', 'courses',
]);

export function cleanQuery(text: string): string {
  const tokens = (text.toLowerCase().match(/[a-z0-9+#]+/g) ?? []).filter(
    (t) => !FILLER.has(t),
  );
  return tokens.length > 0 ? tokens.join(' ') : text;
}

// ── Module-level model cache ──────────────────────────────────────────────────

let _meta: { B: number; D: number } | null = null;
let _weights: Float32Array | null = null;
let _loadPromise: Promise<void> | null = null;

export function isModelLoaded(): boolean {
  return !!(_meta && _weights);
}

export async function loadModel(): Promise<void> {
  if (_meta && _weights) return;
  if (_loadPromise) return _loadPromise;

  _loadPromise = (async () => {
    const [mRes, wRes] = await Promise.all([
      fetch('/model/meta.json'),
      fetch('/model/weights.f32'),
    ]);
    if (!mRes.ok) throw new Error(`meta.json fetch failed (${mRes.status})`);
    if (!wRes.ok) throw new Error(`weights.f32 fetch failed (${wRes.status})`);

    _meta = (await mRes.json()) as { B: number; D: number };
    const buf = await wRes.arrayBuffer();
    _weights = new Float32Array(buf);

    if (import.meta.env.DEV) {
      _runSelfTest();
    }
  })();

  return _loadPromise;
}

// ── Encoder ───────────────────────────────────────────────────────────────────

/**
 * Encode text into a 64-dim L2-normalised Float32Array.
 * Algorithm (matches Python exactly):
 * 1. lowercase; tokens = /[a-z0-9+#]+/g
 * 2. Per token: word-id = fnv("w:"+token) % B
 *              p = "<"+token+">"
 *              for n in [3,4,5]: every len-n substring -> fnv("g:"+sub) % B
 * 3. If no ids, use [0]
 * 4. Mean of weight rows over ALL ids (duplicates kept)
 * 5. L2-normalise
 */
export function encode(text: string): Float32Array {
  if (!_meta || !_weights) {
    throw new Error('Model not loaded — call loadModel() first');
  }
  const { B, D } = _meta;

  const lower = text.toLowerCase();
  const tokens = lower.match(/[a-z0-9+#]+/g) ?? [];

  const ids: number[] = [];
  for (const tok of tokens) {
    ids.push(fnv1a('w:' + tok) % B);
    const p = '<' + tok + '>';
    for (const n of [3, 4, 5] as const) {
      for (let i = 0; i <= p.length - n; i++) {
        ids.push(fnv1a('g:' + p.slice(i, i + n)) % B);
      }
    }
  }
  if (ids.length === 0) ids.push(0);

  const vec = new Float32Array(D);
  for (const id of ids) {
    const base = id * D;
    for (let j = 0; j < D; j++) vec[j] += _weights[base + j];
  }
  const cnt = ids.length;
  for (let j = 0; j < D; j++) vec[j] /= cnt;

  let norm = 0;
  for (let j = 0; j < D; j++) norm += vec[j] * vec[j];
  norm = Math.sqrt(norm);
  if (norm > 1e-12) {
    for (let j = 0; j < D; j++) vec[j] /= norm;
  }

  return vec;
}

// ── Self-test (DEV only, runs once after weights load) ────────────────────────

const _TEST_CASES: [string, number[]][] = [
  ['python',        [ 0.0814, -0.1107,  0.0715, -0.2256,  0.0543]],
  ['data analyst',  [ 0.1130, -0.1291, -0.1177, -0.0552,  0.0547]],
  ['pythn',         [ 0.1509, -0.0412,  0.0988, -0.2886,  0.0485]],
  ['aws cloud',     [ 0.2627, -0.0673,  0.0084, -0.0428, -0.0525]],
];

function _runSelfTest(): void {
  let allPass = true;
  for (const [text, expected] of _TEST_CASES) {
    const got = encode(text);
    const pass = expected.every((e, i) => Math.abs(got[i] - e) < 1e-3);
    if (pass) {
      console.log(`[skillEncoder] PASS  encode("${text}")`);
    } else {
      allPass = false;
      const gotFmt = Array.from(got.slice(0, 5)).map((v) => v.toFixed(4)).join(', ');
      console.error(`[skillEncoder] FAIL  encode("${text}")`);
      console.error(`  expected: [${expected.join(', ')}]`);
      console.error(`  got:      [${gotFmt}]`);
    }
  }
  if (!allPass) {
    console.error('[skillEncoder] SELF-TEST FAILED — encoder broken, search results unreliable');
  }
}

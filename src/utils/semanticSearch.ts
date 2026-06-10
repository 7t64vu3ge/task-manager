import { Task } from '../types/task';

// ---------------------------------------------------------------------------
// Synonym map — query words that map to canonical task field values
// ---------------------------------------------------------------------------
const SYNONYMS: Record<string, string[]> = {
  // Priority synonyms
  high: ['urgent', 'critical', 'important', 'asap', 'top', 'priority'],
  medium: ['moderate', 'normal', 'average', 'mid', 'middle'],
  low: ['easy', 'minor', 'trivial', 'simple', 'later', 'low'],
  // Status synonyms
  completed: ['done', 'finished', 'complete', 'closed', 'resolved', 'fixed'],
  pending: ['todo', 'open', 'incomplete', 'unfinished', 'outstanding', 'active'],
};

/**
 * Given a single query token, return all canonical expansions.
 * e.g. "urgent" → ["high"]
 *      "done"   → ["completed"]
 *      "high"   → ["high"]   (already canonical)
 */
function expandSynonyms(token: string): string[] {
  const expansions: string[] = [token];
  for (const [canonical, aliases] of Object.entries(SYNONYMS)) {
    if (aliases.includes(token) || canonical === token) {
      if (!expansions.includes(canonical)) expansions.push(canonical);
    }
  }
  return expansions;
}

// ---------------------------------------------------------------------------
// Fuzzy matching — Levenshtein distance
// ---------------------------------------------------------------------------
function levenshtein(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  // Use a flat array for the DP table to keep memory tight
  const dp: number[] = Array.from({ length: (m + 1) * (n + 1) }, (_, i) => {
    const row = Math.floor(i / (n + 1));
    const col = i % (n + 1);
    if (row === 0) return col;
    if (col === 0) return row;
    return 0;
  });

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i * (n + 1) + j] = Math.min(
        dp[(i - 1) * (n + 1) + j] + 1,        // deletion
        dp[i * (n + 1) + (j - 1)] + 1,        // insertion
        dp[(i - 1) * (n + 1) + (j - 1)] + cost // substitution
      );
    }
  }
  return dp[m * (n + 1) + n];
}

/**
 * Returns true if `token` fuzzy-matches `word` within an acceptable edit distance.
 * Threshold: ≤1 for words shorter than 5 chars, ≤2 for longer.
 */
function fuzzyMatch(token: string, word: string): boolean {
  if (token === word) return true;
  if (Math.abs(token.length - word.length) > 2) return false; // quick reject
  const threshold = token.length < 5 ? 1 : 2;
  return levenshtein(token, word) <= threshold;
}

// ---------------------------------------------------------------------------
// Tokeniser
// ---------------------------------------------------------------------------
function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(Boolean);
}

// ---------------------------------------------------------------------------
// Scoring
// ---------------------------------------------------------------------------
const SCORE = {
  TITLE_EXACT: 6,       // token found as a substring of title
  TITLE_FUZZY: 3,       // fuzzy match in title
  DESC_EXACT: 3,        // token found as a substring of description
  DESC_FUZZY: 1,        // fuzzy match in description
  FIELD_SYNONYM: 5,     // synonym expansion matched priority or status
} as const;

/**
 * Score a single task against an array of query tokens.
 * Returns a numeric relevance score; 0 means "no match".
 */
function scoreTask(task: Task, queryTokens: string[]): number {
  let total = 0;

  const titleTokens = tokenize(task.title);
  const descTokens = tokenize(task.description ?? '');
  const priorityLower = task.priority.toLowerCase();
  const statusLower = task.status.toLowerCase();

  for (const qToken of queryTokens) {
    const expansions = expandSynonyms(qToken); // includes the token itself + synonyms
    let tokenScore = 0;

    // --- priority / status synonym match ---
    for (const exp of expansions) {
      if (priorityLower === exp || statusLower === exp) {
        tokenScore = Math.max(tokenScore, SCORE.FIELD_SYNONYM);
      }
    }

    // --- title exact substring ---
    const titleText = task.title.toLowerCase();
    for (const exp of expansions) {
      if (titleText.includes(exp)) {
        tokenScore = Math.max(tokenScore, SCORE.TITLE_EXACT);
        break;
      }
    }

    // --- title fuzzy token-by-token ---
    if (tokenScore < SCORE.TITLE_EXACT) {
      for (const tWord of titleTokens) {
        for (const exp of expansions) {
          if (fuzzyMatch(exp, tWord)) {
            tokenScore = Math.max(tokenScore, SCORE.TITLE_FUZZY);
          }
        }
      }
    }

    // --- description exact substring ---
    const descText = (task.description ?? '').toLowerCase();
    for (const exp of expansions) {
      if (descText.includes(exp)) {
        tokenScore = Math.max(tokenScore, SCORE.DESC_EXACT);
        break;
      }
    }

    // --- description fuzzy ---
    if (tokenScore < SCORE.DESC_EXACT) {
      for (const dWord of descTokens) {
        for (const exp of expansions) {
          if (fuzzyMatch(exp, dWord)) {
            tokenScore = Math.max(tokenScore, SCORE.DESC_FUZZY);
          }
        }
      }
    }

    // If this token matched nothing at all, the task doesn't qualify (AND logic)
    if (tokenScore === 0) return 0;

    total += tokenScore;
  }

  return total;
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Semantically filter and rank tasks by `query`.
 *
 * - Multi-field: searches title, description, priority, status
 * - Synonym-aware: "urgent" → High priority, "done" → Completed, etc.
 * - Fuzzy: small typos are tolerated
 * - AND logic: every query token must match somewhere
 * - Ranked by relevance score (highest first)
 */
export function semanticFilter(tasks: Task[], query: string): Task[] {
  const tokens = tokenize(query);
  if (tokens.length === 0) return tasks;

  const scored = tasks
    .map((task) => ({ task, score: scoreTask(task, tokens) }))
    .filter(({ score }) => score > 0);

  scored.sort((a, b) => b.score - a.score);
  return scored.map(({ task }) => task);
}

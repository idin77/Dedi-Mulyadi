import React from 'react';

/**
 * Escapes regex special characters to prevent RegExp syntax errors.
 */
function escapeRegExp(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Highlights occurrences of keywords in text.
 * Multi-word queries are broken into individual search tokens.
 * Exact phrases and individual tokens are matched case-insensitively while preserving original text casing.
 */
export function highlightKeyword(
  text: string | null | undefined,
  query: string | null | undefined,
  options?: {
    enabled?: boolean;
    className?: string;
  }
): React.ReactNode {
  if (!text) return '';
  if (!query || options?.enabled === false) return text;

  const trimmed = query.trim();
  if (!trimmed) return text;

  // Split query into distinct tokens
  const tokens = Array.from(
    new Set(
      trimmed
        .split(/\s+/)
        .map((t) => t.trim())
        .filter((t) => t.length > 0)
    )
  );

  if (tokens.length === 0) return text;

  // Sort tokens by descending length so longer terms match first
  tokens.sort((a, b) => b.length - a.length);

  try {
    const pattern = `(${tokens.map(escapeRegExp).join('|')})`;
    const regex = new RegExp(pattern, 'gi');
    const parts = text.split(regex);

    if (parts.length === 1) {
      return text;
    }

    const markClassName =
      options?.className ||
      'bg-amber-300 text-navy font-bold px-1 py-0.5 rounded shadow-2xs border-b border-amber-500 selection:bg-amber-400';

    return (
      <>
        {parts.map((part, index) => {
          const isMatch = tokens.some(
            (token) => token.toLowerCase() === part.toLowerCase()
          );

          if (isMatch) {
            return (
              <mark
                key={index}
                className={markClassName}
                title={`Kecocokan pencarian: "${part}"`}
              >
                {part}
              </mark>
            );
          }
          return <React.Fragment key={index}>{part}</React.Fragment>;
        })}
      </>
    );
  } catch (err) {
    console.error('Highlight error:', err);
    return text;
  }
}

/**
 * Counts total keyword matches in a string.
 */
export function countKeywordMatches(
  text: string | null | undefined,
  query: string | null | undefined
): number {
  if (!text || !query) return 0;
  const trimmed = query.trim();
  if (!trimmed) return 0;

  const tokens = Array.from(
    new Set(
      trimmed
        .split(/\s+/)
        .map((t) => t.trim())
        .filter((t) => t.length > 0)
    )
  );

  if (tokens.length === 0) return 0;

  try {
    const pattern = `(${tokens.map(escapeRegExp).join('|')})`;
    const regex = new RegExp(pattern, 'gi');
    const matches = text.match(regex);
    return matches ? matches.length : 0;
  } catch {
    return 0;
  }
}

/**
 * Calculates total match statistics across FAQ item fields.
 */
export function getFaqMatchStats(
  item: {
    question: string;
    answer?: string;
    summary?: string;
    details?: { title: string; desc: string }[];
  },
  query: string
): {
  total: number;
  questionMatches: number;
  answerMatches: number;
} {
  if (!query.trim()) {
    return { total: 0, questionMatches: 0, answerMatches: 0 };
  }

  const qMatches = countKeywordMatches(item.question, query);
  let aMatches = countKeywordMatches(item.answer || '', query);

  if (item.summary) {
    aMatches += countKeywordMatches(item.summary, query);
  }

  if (item.details && item.details.length > 0) {
    for (const d of item.details) {
      aMatches += countKeywordMatches(d.title, query);
      aMatches += countKeywordMatches(d.desc, query);
    }
  }

  return {
    total: qMatches + aMatches,
    questionMatches: qMatches,
    answerMatches: aMatches,
  };
}

import React from 'react';

interface HighlightTextProps {
  text: string;
  query?: string;
  className?: string;
  highlightClassName?: string;
}

/**
 * Escapes regex special characters to prevent errors with symbols like +, *, ?, (, ), etc.
 */
function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * HighlightText component
 * Wraps matching query terms with a styled <mark> element to improve discoverability.
 * Supports multi-word queries, case-insensitivity, and safe regex parsing.
 */
export const HighlightText: React.FC<HighlightTextProps> = ({
  text,
  query,
  className = '',
  highlightClassName = 'bg-amber-200/90 dark:bg-amber-400/25 text-amber-950 dark:text-amber-200 px-0.5 py-0.2 rounded-xs font-semibold selection:bg-amber-300',
}) => {
  if (!text) return null;
  if (!query || !query.trim()) {
    return <span className={className}>{text}</span>;
  }

  // Tokenize the query into non-empty terms and escape each
  const rawTerms = query
    .trim()
    .split(/\s+/)
    .filter((term) => term.length > 0);

  if (rawTerms.length === 0) {
    return <span className={className}>{text}</span>;
  }

  // Also include the exact full query phrase first so multi-word matches take precedence
  const sortedTerms = Array.from(new Set([query.trim(), ...rawTerms]))
    .sort((a, b) => b.length - a.length)
    .map(escapeRegExp);

  try {
    const pattern = new RegExp(`(${sortedTerms.join('|')})`, 'gi');
    const parts = text.split(pattern);

    return (
      <span className={className}>
        {parts.map((part, index) => {
          // Check if this part matches any of the query terms (case-insensitive)
          const isMatch = rawTerms.some(
            (term) => part.toLowerCase() === term.toLowerCase()
          ) || part.toLowerCase() === query.trim().toLowerCase();

          if (isMatch) {
            return (
              <mark key={index} className={highlightClassName}>
                {part}
              </mark>
            );
          }
          return <React.Fragment key={index}>{part}</React.Fragment>;
        })}
      </span>
    );
  } catch {
    // Fallback if regex construction fails
    return <span className={className}>{text}</span>;
  }
};

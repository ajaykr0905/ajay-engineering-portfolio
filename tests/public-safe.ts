/**
 * Patterns that must never appear in public copy: ticket-like keys (KEY-1234),
 * merge request numbers, shard names, internal hostnames, and claims the record
 * does not support. The key pattern is case-sensitive so lowercase slugs such as
 * "kill-2026" pass, and standard identifiers (SHA-256, ISO-8601, CVE, RFC, UTF)
 * are excluded.
 */
export const PUBLIC_SAFE_DENYLIST: RegExp =
  /\b(?!(?:SHA|ISO|CVE|RFC|UTF)-)[A-Z]{2,10}-\d{3,}\b|![0-9]{2,}|\b[Ss][Hh][Aa][Rr][Dd]\b|\.[Cc][Ii][Ss][Cc][Oo]\.[Cc][Oo][Mm]|3\+ [Yy]ears|[Cc]onnection [Pp]ool/;

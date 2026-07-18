/** Curated invalid program names for negative-path tests — not generated at runtime. */
export const WHITESPACE_ONLY_NAMES = ['', '   ', '\t\t\t'] as const;

export const SQL_INJECTION_NAMES = ["'; DROP TABLE programs; --", '1 OR 1=1'] as const;

export const XSS_STRINGS = ["<script>alert('XSS')</script>", '<img src=x onerror=alert(1)>'] as const;

export const OVER_MAX_LENGTH_NAME = 'B'.repeat(300);

// Sanitization utility for messages (React)
import DOMPurify from 'dompurify';

export function sanitizeMessageContent(content: string): string {
  return DOMPurify.sanitize(content, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] }); // No HTML allowed
}

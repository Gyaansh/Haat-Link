/**
 * FieldError — renders a form field validation error message.
 * Returns null when children is empty/falsy (no layout shift).
 */
export function FieldError({ children }) {
  return children ? <small className="field-error">{children}</small> : null;
}

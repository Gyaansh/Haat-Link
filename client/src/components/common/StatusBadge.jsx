/**
 * StatusBadge — inline status indicator (e.g. "Ready to Sell", "Growing").
 */
export function StatusBadge({ children }) {
  return <b className="status">{children}</b>;
}

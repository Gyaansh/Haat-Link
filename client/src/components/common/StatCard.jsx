/**
 * StatCard — a metric card used on dashboard/overview sections.
 *
 * Props:
 *   icon   — emoji or symbol character
 *   label  — metric label
 *   value  — primary value (string or number)
 *   detail — secondary detail text
 */
export function StatCard({ icon, label, value, detail }) {
  return (
    <article>
      <i>{icon}</i>
      <div>
        <p>{label}</p>
        <strong>{value}</strong>
        <small>{detail}</small>
      </div>
    </article>
  );
}

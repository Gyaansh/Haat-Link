/**
 * PageTitle — section header used at the top of every page.
 *
 * Props:
 *   kicker — small uppercase label (e.g. "FARM INVENTORY")
 *   title  — main h1 heading
 *   action — optional JSX rendered on the right (e.g. a button)
 */
export function PageTitle({ kicker, title, action }) {
  return (
    <section className="title">
      <div>
        <small>{kicker}</small>
        <h1>{title}</h1>
      </div>
      {action}
    </section>
  );
}

import { useApp } from '../../context/AppContext';
import { money } from '../../utils/format';
import { PageTitle } from '../../components/common/PageTitle';
import { StatusBadge } from '../../components/common/StatusBadge';

export function OrdersPage() {
  const { deals, dealsLoading, dealsError } = useApp();

  return (
    <>
      <PageTitle kicker="BUYER PROCUREMENT" title="Orders" />

      {dealsLoading && <p className="intro">Loading orders…</p>}

      {dealsError && (
        <p className="intro" style={{ color: 'var(--danger, #e53e3e)' }}>
          Failed to load orders: {dealsError}
        </p>
      )}

      {!dealsLoading && !dealsError && deals.length === 0 && (
        <p className="intro" style={{ opacity: 0.6 }}>
          No orders found.
        </p>
      )}

      {!dealsLoading && !dealsError && deals.length > 0 && (
        <section className="deals">
          {deals.map((d) => (
            <article className="card deal" key={d._id}>
              <div className="card-title">
                <div>
                  <small>{d._id}</small>
                  <h2>
                    {d.crop} from {d.buyer}
                  </h2>
                </div>
                <StatusBadge>{d.status}</StatusBadge>
              </div>
              <div className="deal-data">
                <span>
                  Quantity<b>{d.quantity} quintals</b>
                </span>
                <span>
                  Rate<b>{money(d.price)}/q</b>
                </span>
                <span>
                  Order value<b>{money(d.total)}</b>
                </span>
              </div>
            </article>
          ))}
        </section>
      )}
    </>
  );
}

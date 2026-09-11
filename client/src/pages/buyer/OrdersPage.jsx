import { useApp } from '../../context/AppContext';
import { money } from '../../utils/format';
import { PageTitle } from '../../components/common/PageTitle';
import { StatusBadge } from '../../components/common/StatusBadge';

export function OrdersPage() {
  const { deals } = useApp();

  return (
    <>
      <PageTitle kicker="BUYER PROCUREMENT" title="Orders" />
      <section className="deals">
        {deals.map((d) => (
          <article className="card deal" key={d.id}>
            <div className="card-title">
              <div>
                <small>{d.id}</small>
                <h2>
                  {d.crop} from{' '}
                  {d.buyer === 'ABC Foods' ? 'Ramesh Patil' : d.buyer}
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
    </>
  );
}

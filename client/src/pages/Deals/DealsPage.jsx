import { useApp } from '../../context/AppContext';
import { money } from '../../utils/format';
import { PageTitle } from '../../components/common/PageTitle';
import { StatusBadge } from '../../components/common/StatusBadge';

const DEAL_STAGES = [
  'Deal Created',
  'Pickup Scheduled',
  'In Transit',
  'Delivered',
  'Payment Received',
];

export function DealsPage() {
  const { deals } = useApp();

  return (
    <>
      <PageTitle kicker="DEAL TRACKING" title="My Deals" />
      <section className="deals">
        {deals.map((d) => (
          <article className="card deal" key={d.id}>
            <div className="card-title">
              <div>
                <small>{d.id}</small>
                <h2>
                  {d.crop} · {d.quantity} quintals
                </h2>
              </div>
              <StatusBadge>{d.status}</StatusBadge>
            </div>
            <div className="deal-data">
              <span>
                Buyer<b>{d.buyer}</b>
              </span>
              <span>
                Price<b>{money(d.price)}/q</b>
              </span>
              <span>
                Total value<b>{money(d.total)}</b>
              </span>
              <span>
                Net realization<b>{money(d.net)}/q</b>
              </span>
            </div>
            <div className="timeline">
              {DEAL_STAGES.map((stage, i) => {
                const done =
                  ['Deal Created', 'Pickup Scheduled'].indexOf(d.status) >= i ||
                  d.status === stage;
                return (
                  <span className={done ? 'done' : ''} key={stage}>
                    <i>{done ? '✓' : '○'}</i>
                    {stage}
                  </span>
                );
              })}
            </div>
          </article>
        ))}
      </section>
    </>
  );
}

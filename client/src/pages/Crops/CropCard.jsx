import { useState } from 'react';
import { formatDate } from '../../utils/validation';
import { money } from '../../utils/format';
import { CropDetailsModal } from './CropDetailsModal';
import { CropEditModal } from './CropEditModal';
import { StatusBadge } from '../../components/common/StatusBadge';

/**
 * CropCard — displays a single crop with View, Edit, and Find Buyers actions.
 */
export function CropCard({ crop, onFindBuyers }) {
  const [viewOpen, setViewOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  return (
    <article className="card crop-card">
      <div className="crop-head">
        <b>{crop.emoji}</b>
        <StatusBadge>{crop.status}</StatusBadge>
      </div>
      <h2>{crop.name}</h2>
      <p>
        {crop.quality} · Harvest: {formatDate(crop.harvestDate)}
      </p>
      <div className="crop-numbers">
        <span>
          <strong>{crop.quantity}</strong>
          <small>quintals</small>
        </span>
        <span>
          <strong>{money(crop.price)}</strong>
          <small>market price / q</small>
        </span>
      </div>
      <div className="actions">
        <button className="secondary" onClick={() => setViewOpen(true)}>
          View
        </button>
        <button className="secondary" onClick={() => setEditOpen(true)}>
          Edit
        </button>
        <button className="primary" onClick={onFindBuyers}>
          Find Buyers
        </button>
      </div>

      {viewOpen && (
        <CropDetailsModal
          crop={crop}
          onClose={() => setViewOpen(false)}
          onFindBuyers={() => {
            setViewOpen(false);
            onFindBuyers();
          }}
        />
      )}
      {editOpen && (
        <CropEditModal crop={crop} onClose={() => setEditOpen(false)} />
      )}
    </article>
  );
}

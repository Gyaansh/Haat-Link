import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../../components/common/Modal';
import { formatDate } from '../../utils/validation';
import { money } from '../../utils/format';
import { CropEditModal } from './CropEditModal';

/**
 * CropDetailsModal — read-only view of a crop's details.
 *
 * Props:
 *   crop         — crop object from AppContext
 *   onClose      — called when the modal should close
 *   onFindBuyers — called when "Find Buyers" is clicked
 */
export function CropDetailsModal({ crop, onClose, onFindBuyers }) {
  const { farmer } = useApp();
  const [editOpen, setEditOpen] = useState(false);

  return (
    <>
      <Modal title="Crop Details" onClose={onClose}>
        <div className="detail">
          <p>
            <b>Crop</b>
            <span>
              {crop.emoji} {crop.name}
            </span>
          </p>
          <p>
            <b>Quantity</b>
            <span>{crop.quantity} Quintals</span>
          </p>
          <p>
            <b>Quality</b>
            <span>{crop.quality}</span>
          </p>
          <p>
            <b>Harvest Date</b>
            <span>{formatDate(crop.harvestDate)}</span>
          </p>
          <p>
            <b>Status</b>
            <span>{crop.status}</span>
          </p>
          <p>
            <b>Current Market Price</b>
            <span>{money(crop.price)}/q</span>
          </p>
          <p>
            <b>Location</b>
            <span>{farmer.location}</span>
          </p>
          <div className="actions" style={{ marginTop: '1rem' }}>
            <button className="secondary" onClick={() => setEditOpen(true)}>
              Edit Crop
            </button>
            <button className="primary" onClick={onFindBuyers}>
              Find Buyers
            </button>
            <button className="secondary" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      </Modal>

      {editOpen && (
        <CropEditModal
          crop={crop}
          onClose={() => {
            setEditOpen(false);
            onClose();
          }}
        />
      )}
    </>
  );
}

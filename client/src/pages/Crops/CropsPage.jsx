import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { PageTitle } from '../../components/common/PageTitle';
import { CropCard } from './CropCard';
import { CropForm } from './CropForm';

/**
 * CropsPage — Farmer Inventory / My Crops.
 *
 * Lists all crops from AppContext (sourced from MongoDB via API).
 * "Add Crop" opens CropForm modal.
 * Each card has View, Edit, and Find Buyers actions.
 */
export function CropsPage() {
  const { crops, cropsLoading, cropsError, setSelectedCrop } = useApp();
  const n = useNavigate();
  const [addOpen, setAddOpen] = useState(false);

  return (
    <>
      <PageTitle
        kicker="FARM INVENTORY"
        title="My Crops"
        action={
          <button className="primary" onClick={() => setAddOpen(true)}>
            + Add Crop
          </button>
        }
      />

      {cropsLoading && <p className="intro">Loading crops…</p>}

      {cropsError && (
        <p className="intro" style={{ color: 'var(--danger, #e53e3e)' }}>
          Failed to load crops: {cropsError}
        </p>
      )}

      {!cropsLoading && !cropsError && crops.length === 0 && (
        <p className="intro" style={{ opacity: 0.6 }}>
          You have no crops yet. Add your first crop to get started.
        </p>
      )}

      {!cropsLoading && !cropsError && crops.length > 0 && (
        <section className="crop-grid">
          {crops.map((c) => (
            <CropCard
              key={c._id}
              crop={c}
              onFindBuyers={() => {
                setSelectedCrop(c._id);
                n(`/buyers?crop=${c._id}`);
              }}
            />
          ))}
        </section>
      )}

      {addOpen && <CropForm onClose={() => setAddOpen(false)} />}
    </>
  );
}

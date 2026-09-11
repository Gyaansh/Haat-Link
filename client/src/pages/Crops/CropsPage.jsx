import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { PageTitle } from '../../components/common/PageTitle';
import { CropCard } from './CropCard';
import { CropForm } from './CropForm';

/**
 * CropsPage — Farmer Inventory / My Crops.
 *
 * Lists all crops from AppContext with View, Edit, and Find Buyers per card.
 * "+ Add Crop" button opens CropForm modal.
 */
export function CropsPage() {
  const { crops, setSelectedCrop } = useApp(),
    n = useNavigate(),
    [addOpen, setAddOpen] = useState(false);

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
      <section className="crop-grid">
        {crops.map((c) => (
          <CropCard
            key={c.id}
            crop={c}
            onFindBuyers={() => {
              setSelectedCrop(c.id);
              n(`/buyers?crop=${c.id}`);
            }}
          />
        ))}
      </section>
      {addOpen && <CropForm onClose={() => setAddOpen(false)} />}
    </>
  );
}

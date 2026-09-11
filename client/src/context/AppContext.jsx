import { createContext, useContext, useEffect, useState } from 'react';
import {
  farmer,
  buyerUser,
  initialCrops,
  initialDeals,
  buyerRequirements,
  notifications,
} from '../data/mockData';
import { isValidIsoDate } from '../utils/validation';

const C = createContext(null);

const read = (k, f) => {
  try {
    const value = JSON.parse(localStorage.getItem(k));
    return Array.isArray(f) ? (Array.isArray(value) ? value : f) : (value ?? f);
  } catch {
    return f;
  }
};

const validRequirements = (items) =>
  items.filter(
    (item) =>
      item &&
      typeof item.crop === 'string' &&
      Number.isFinite(Number(item.quantity)) &&
      Number(item.quantity) > 0 &&
      Number.isFinite(Number(item.offeredPrice)) &&
      Number(item.offeredPrice) > 0 &&
      isValidIsoDate(item.requiredBy)
  );

export function AppProvider({ children }) {
  const [role, setRole] = useState(
      () => localStorage.getItem('agrilink-role') || 'farmer'
    ),
    [crops, setCrops] = useState(() => read('agrilink-crops', initialCrops)),
    [deals, setDeals] = useState(() => read('agrilink-deals', initialDeals)),
    [offers, setOffers] = useState(() => read('agrilink-offers', [])),
    [requirements, setRequirements] = useState(() =>
      validRequirements(read('agrilink-requirements', buyerRequirements))
    ),
    [selectedCrop, setSelectedCrop] = useState(() =>
      read('agrilink-selected-crop', 'onion')
    ),
    [toast, setToast] = useState(null);
  useEffect(() => localStorage.setItem('agrilink-role', role), [role]);
  useEffect(
    () => localStorage.setItem('agrilink-crops', JSON.stringify(crops)),
    [crops]
  );
  useEffect(
    () => localStorage.setItem('agrilink-deals', JSON.stringify(deals)),
    [deals]
  );
  useEffect(
    () => localStorage.setItem('agrilink-offers', JSON.stringify(offers)),
    [offers]
  );
  useEffect(
    () =>
      localStorage.setItem(
        'agrilink-requirements',
        JSON.stringify(requirements)
      ),
    [requirements]
  );
  useEffect(
    () =>
      localStorage.setItem(
        'agrilink-selected-crop',
        JSON.stringify(selectedCrop)
      ),
    [selectedCrop]
  );
  const addCrop = (c) =>
      setCrops((x) => [...x, { ...c, id: `crop-${Date.now()}`, emoji: '🌾' }]),
    updateCrop = (id, patch) =>
      setCrops((x) => x.map((c) => (c.id === id ? { ...c, ...patch } : c))),
    createOffer = (o) => {
      setOffers((x) => [
        { ...o, id: `OFF-${Date.now().toString().slice(-4)}` },
        ...x,
      ]);
      setToast('Offer submitted successfully');
    },
    createDeal = (d) => {
      setDeals((x) => [
        { ...d, id: `AGR-${Math.floor(10000 + Math.random() * 89999)}` },
        ...x,
      ]);
      setToast('Deal created successfully');
    },
    createRequirement = (requirement) => {
      setRequirements((items) => [
        {
          ...requirement,
          id: `REQ-${Math.floor(1000 + Math.random() * 9000)}`,
          buyerId: buyerUser.id,
          received: 0,
          status: 'Active',
          createdAt: new Date().toISOString().slice(0, 10),
        },
        ...items,
      ]);
      setToast('Requirement created successfully.');
    };
  return (
    <C.Provider
      value={{
        farmer,
        buyerUser,
        role,
        setRole,
        crops,
        addCrop,
        updateCrop,
        deals,
        createDeal,
        offers,
        createOffer,
        requirements,
        createRequirement,
        selectedCrop,
        setSelectedCrop,
        notifications,
        toast,
        setToast,
      }}
    >
      {children}
    </C.Provider>
  );
} // eslint-disable-next-line react-refresh/only-export-components
export const useApp = () => useContext(C);

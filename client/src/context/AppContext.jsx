import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from 'react';
import { useAuth } from './AuthContext.jsx';
import * as cropService from '../services/cropService.js';
import * as dealService from '../services/dealService.js';
import * as offerService from '../services/offerService.js';
import * as requirementService from '../services/requirementService.js';

function getInitials(name) {
  if (!name) return 'HL';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

const defaultFarmer = {
  name: 'Ramesh Patil',
  initials: 'RP',
  location: 'Nashik, Maharashtra',
  phone: '+91 98765 43120',
};

const defaultBuyerUser = {
  name: 'ABC Foods',
  initials: 'AF',
  location: 'Pune, Maharashtra',
  phone: '+91 98765 98765',
};

const C = createContext(null);

export function AppProvider({ children }) {
  const { user } = useAuth();

  const activeFarmer = user
    ? {
        name: user.name || user.username,
        initials: getInitials(user.name || user.username),
        location: 'Maharashtra, India',
        phone: user.phone || '+91 98765 43120',
      }
    : defaultFarmer;

  const activeBuyer = user
    ? {
        name: user.name || user.username,
        initials: getInitials(user.name || user.username),
        location: 'Maharashtra, India',
        phone: user.phone || '+91 98765 98765',
      }
    : defaultBuyerUser;

  // ── UI Preferences (localStorage is appropriate here) ──────
  const [role, setRole] = useState(
    () => localStorage.getItem('agrilink-role') || user?.role || 'farmer'
  );
  const [selectedCrop, setSelectedCrop] = useState(
    () => localStorage.getItem('agrilink-selected-crop') || ''
  );
  const [toast, setToast] = useState(null);

  // ── Business Data (sourced from MongoDB via API) ───────────
  const [crops, setCrops] = useState([]);
  const [cropsLoading, setCropsLoading] = useState(true);
  const [cropsError, setCropsError] = useState(null);

  const [deals, setDeals] = useState([]);
  const [dealsLoading, setDealsLoading] = useState(true);
  const [dealsError, setDealsError] = useState(null);

  const [offers, setOffers] = useState([]);
  const [offersLoading, setOffersLoading] = useState(true);
  const [offersError, setOffersError] = useState(null);

  const [requirements, setRequirements] = useState([]);
  const [requirementsLoading, setRequirementsLoading] = useState(true);
  const [requirementsError, setRequirementsError] = useState(null);

  // ── Persist UI preferences only ────────────────────────────
  useEffect(() => {
    localStorage.setItem('agrilink-role', role);
  }, [role]);

  useEffect(() => {
    localStorage.setItem('agrilink-selected-crop', selectedCrop);
  }, [selectedCrop]);

  // ── Fetch crops ────────────────────────────────────────────
  const fetchCrops = useCallback(async () => {
    setCropsLoading(true);
    setCropsError(null);
    try {
      const data = await cropService.getCrops();
      setCrops(data);
    } catch (err) {
      setCropsError(err.message);
    } finally {
      setCropsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCrops();
  }, [fetchCrops]);

  // ── Fetch deals ────────────────────────────────────────────
  const fetchDeals = useCallback(async () => {
    setDealsLoading(true);
    setDealsError(null);
    try {
      const data = await dealService.getDeals();
      setDeals(data);
    } catch (err) {
      setDealsError(err.message);
    } finally {
      setDealsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDeals();
  }, [fetchDeals]);

  // ── Fetch offers ───────────────────────────────────────────
  const fetchOffers = useCallback(async () => {
    setOffersLoading(true);
    setOffersError(null);
    try {
      const data = await offerService.getOffers();
      setOffers(data);
    } catch (err) {
      setOffersError(err.message);
    } finally {
      setOffersLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOffers();
  }, [fetchOffers]);

  // ── Fetch requirements ─────────────────────────────────────
  const fetchRequirements = useCallback(async () => {
    setRequirementsLoading(true);
    setRequirementsError(null);
    try {
      const data = await requirementService.getRequirements();
      setRequirements(data);
    } catch (err) {
      setRequirementsError(err.message);
    } finally {
      setRequirementsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRequirements();
  }, [fetchRequirements]);

  // ── Mutations ──────────────────────────────────────────────

  const addCrop = useCallback(async (cropData) => {
    const created = await cropService.createCrop({
      ...cropData,
      quantity: Number(cropData.quantity),
      price: Number(cropData.price) || 0,
      emoji: cropData.emoji || '🌾',
    });
    setCrops((prev) => [created, ...prev]);
    setToast('Crop added successfully.');
  }, []);

  const updateCrop = useCallback(async (id, patch) => {
    const updated = await cropService.updateCrop(id, patch);
    setCrops((prev) => prev.map((c) => (c._id === id ? updated : c)));
  }, []);

  const deleteCrop = useCallback(async (id) => {
    await cropService.deleteCrop(id);
    setCrops((prev) => prev.filter((c) => c._id !== id));
    setToast('Crop deleted.');
  }, []);

  const createDeal = useCallback(async (dealData) => {
    const created = await dealService.createDeal(dealData);
    setDeals((prev) => [created, ...prev]);
    setToast('Deal created successfully.');
  }, []);

  const createOffer = useCallback(
    async (offerData) => {
      const created = await offerService.createOffer({
        ...offerData,
        farmer: user?.name || activeFarmer.name,
        farmerId: user?.id,
      });
      setOffers((prev) => [created, ...prev]);
      setToast('Offer submitted successfully.');
    },
    [user, activeFarmer.name]
  );

  const createRequirement = useCallback(
    async (requirementData) => {
      const created = await requirementService.createRequirement({
        ...requirementData,
        buyer: activeBuyer.name,
        buyerId: user?.id,
        quantity: Number(requirementData.quantity),
        offeredPrice: Number(requirementData.offeredPrice),
      });
      setRequirements((prev) => [created, ...prev]);
      setToast('Requirement created successfully.');
      return created;
    },
    [activeBuyer.name, user?.id]
  );

  return (
    <C.Provider
      value={{
        farmer: activeFarmer,
        buyerUser: activeBuyer,
        role,
        setRole,
        // crops
        crops,
        cropsLoading,
        cropsError,
        addCrop,
        updateCrop,
        deleteCrop,
        fetchCrops,
        // deals
        deals,
        dealsLoading,
        dealsError,
        createDeal,
        // offers
        offers,
        offersLoading,
        offersError,
        createOffer,
        // requirements
        requirements,
        requirementsLoading,
        requirementsError,
        createRequirement,
        fetchRequirements,
        // UI state
        selectedCrop,
        setSelectedCrop,
        toast,
        setToast,
      }}
    >
      {children}
    </C.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useApp = () => useContext(C);

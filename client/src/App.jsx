import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Layout, BuyerLayout } from './components/layout/Layout';
import { LoginPage } from './pages/Login/LoginPage';
import { DashboardPage } from './pages/Dashboard/DashboardPage';
import { CropsPage } from './pages/Crops/CropsPage';
import { MarketPage } from './pages/Market/MarketPage';
import { BuyersPage } from './pages/Buyers/BuyersPage';
import { RecommendationPage } from './pages/Recommendation/RecommendationPage';
import { DealsPage } from './pages/Deals/DealsPage';
import { BuyerDashboardPage } from './pages/buyer/BuyerDashboardPage';
import { RequirementsPage } from './pages/buyer/RequirementsPage';
import { OrdersPage } from './pages/buyer/OrdersPage';

export default function App() {
  return (
    <ErrorBoundary>
      <AppProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route element={<Layout />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/crops" element={<CropsPage />} />
              <Route path="/market" element={<MarketPage />} />
              <Route path="/buyers" element={<BuyersPage />} />
              <Route path="/recommendation" element={<RecommendationPage />} />
              <Route path="/deals" element={<DealsPage />} />
            </Route>
            <Route path="/buyer" element={<BuyerLayout />}>
              <Route path="dashboard" element={<BuyerDashboardPage />} />
              <Route path="requirements" element={<RequirementsPage />} />
              <Route path="orders" element={<OrdersPage />} />
            </Route>
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </BrowserRouter>
      </AppProvider>
    </ErrorBoundary>
  );
}

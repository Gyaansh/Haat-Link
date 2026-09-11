import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Layout, BuyerLayout } from './components/Layout';
import {
  Login,
  Dashboard,
  Crops,
  Market,
  Buyers,
  Recommendation,
  Deals,
  BuyerDashboard,
  Requirements,
  Orders,
} from './pages/Pages';
export default function App() {
  return (
    <ErrorBoundary>
      <AppProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route element={<Layout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/crops" element={<Crops />} />
              <Route path="/market" element={<Market />} />
              <Route path="/buyers" element={<Buyers />} />
              <Route path="/recommendation" element={<Recommendation />} />
              <Route path="/deals" element={<Deals />} />
            </Route>
            <Route path="/buyer" element={<BuyerLayout />}>
              <Route path="dashboard" element={<BuyerDashboard />} />
              <Route path="requirements" element={<Requirements />} />
              <Route path="orders" element={<Orders />} />
            </Route>
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </BrowserRouter>
      </AppProvider>
    </ErrorBoundary>
  );
}

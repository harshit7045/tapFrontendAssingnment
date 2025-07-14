import { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import './App.css';

const LoginPage = lazy(() => import('./pages/LoginPage.jsx'));
const RegistrationPage = lazy(() => import('./pages/RegistrationPage.jsx'));
const Dashboard = lazy(() => import('./pages/Dashboard.jsx'));
const EmergencyContactsPage = lazy(() => import('./pages/EmergencyContactsPage.jsx'));
const DangerZoneMapPage = lazy(() => import('./pages/DangerZoneMapPage.jsx'));
const AlertHistoryPage = lazy(() => import('./pages/AlertHistoryPage.jsx'));
const SettingsPage = lazy(() => import('./pages/SettingsPage.jsx'));
const ProtectedRoute = lazy(() => import('./components/ProtectedRoute.jsx'));

function App() {
  return (
    <Layout>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegistrationPage />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/contacts" element={<EmergencyContactsPage />} />
            <Route path="/danger-zones" element={<DangerZoneMapPage />} />
            <Route path="/alerts" element={<AlertHistoryPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Route>
        </Routes>
      </Suspense>
    </Layout>
  );
}

export default App;

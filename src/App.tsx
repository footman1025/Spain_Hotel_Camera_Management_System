import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { Layout } from './components/Layout';
import { DemoProvider } from './store/DemoContext';
import { RoleProvider } from './store/RoleContext';
import { LanguageProvider } from './i18n/LanguageContext';
import { Dashboard } from './pages/Dashboard';
import { Operations } from './pages/Operations';
import { LiveView } from './pages/LiveView';
import { Watchlists } from './pages/Watchlists';
import { Rules } from './pages/Rules';
import { Alerts } from './pages/Alerts';
import { SearchPage } from './pages/Search';
import { GdprPage } from './pages/GdprPage';

export default function App() {
  return (
    <LanguageProvider>
      <RoleProvider>
        <DemoProvider>
          <BrowserRouter>
            <Routes>
              <Route element={<Layout />}>
                <Route index element={<Navigate to="/dashboard" replace />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="operations" element={<Operations />} />
                <Route path="live" element={<LiveView />} />
                <Route path="watchlists" element={<Watchlists />} />
                <Route path="rules" element={<Rules />} />
                <Route path="alerts" element={<Alerts />} />
                <Route path="search" element={<SearchPage />} />
                <Route path="gdpr" element={<GdprPage />} />
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </DemoProvider>
      </RoleProvider>
    </LanguageProvider>
  );
}

import { useState } from 'react';
import { Layout } from './components/Layout';
import { DemoProvider } from './store/DemoContext';
import { LanguageProvider } from './i18n/LanguageContext';
import type { PageId } from './types';
import { Dashboard } from './pages/Dashboard';
import { Operations } from './pages/Operations';
import { LiveView } from './pages/LiveView';
import { Watchlists } from './pages/Watchlists';
import { Rules } from './pages/Rules';
import { Alerts } from './pages/Alerts';
import { SearchPage } from './pages/Search';
import { GdprPage } from './pages/GdprPage';

function AppInner() {
  const [page, setPage] = useState<PageId>('dashboard');

  return (
    <Layout page={page} onNavigate={setPage}>
      {page === 'dashboard' && <Dashboard onNavigate={setPage} />}
      {page === 'operations' && <Operations />}
      {page === 'live' && <LiveView />}
      {page === 'watchlists' && <Watchlists />}
      {page === 'rules' && <Rules />}
      {page === 'alerts' && <Alerts />}
      {page === 'search' && <SearchPage />}
      {page === 'gdpr' && <GdprPage />}
    </Layout>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <DemoProvider>
        <AppInner />
      </DemoProvider>
    </LanguageProvider>
  );
}

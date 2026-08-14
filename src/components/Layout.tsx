import {
  LayoutDashboard,
  Monitor,
  Video,
  Users,
  GitBranch,
  Bell,
  Search,
  Shield,
  Zap,
  Languages,
} from 'lucide-react';
import type { ReactNode } from 'react';
import type { PageId } from '../types';
import { useDemo } from '../store/DemoContext';
import { useLanguage } from '../i18n/LanguageContext';
import { ToastStack } from './ToastStack';

const NAV_ICONS: Record<PageId, typeof LayoutDashboard> = {
  dashboard: LayoutDashboard,
  operations: Monitor,
  live: Video,
  watchlists: Users,
  rules: GitBranch,
  alerts: Bell,
  search: Search,
  gdpr: Shield,
};

const NAV_ORDER: PageId[] = [
  'dashboard',
  'operations',
  'live',
  'watchlists',
  'rules',
  'alerts',
  'search',
  'gdpr',
];

interface Props {
  page: PageId;
  onNavigate: (p: PageId) => void;
  children: ReactNode;
}

export function Layout({ page, onNavigate, children }: Props) {
  const { t, lang, setLang } = useLanguage();
  const { unreadCritical, scenarioActive, scenarioKey, cameras } = useDemo();

  const online = cameras.filter((c) => c.status !== 'offline').length;
  const scenarioLabel =
    scenarioKey && scenarioKey in t.events
      ? t.events[scenarioKey as keyof typeof t.events]
      : '';

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <button
            type="button"
            className="brand-title"
            onClick={() => onNavigate('dashboard')}
            title={t.brandTitle}
          >
            {t.brandTitle}
          </button>
          <div className="brand-sub">{t.brandSub}</div>
        </div>
        <nav className="nav">
          {NAV_ORDER.map((id) => {
            const Icon = NAV_ICONS[id];
            return (
              <button
                key={id}
                type="button"
                className={`nav-item ${page === id ? 'active' : ''}`}
                onClick={() => onNavigate(id)}
              >
                <Icon size={16} />
                {t.nav[id]}
                {id === 'alerts' && unreadCritical > 0 && (
                  <span className="nav-badge">{unreadCritical}</span>
                )}
              </button>
            );
          })}
        </nav>
        <div className="sidebar-footer">
          {t.footerLine1}
          <br />
          {t.footerLine2}
        </div>
      </aside>

      <header className="topbar">
        <div className="topbar-title">{t.titles[page]}</div>
        <div className="topbar-spacer" />
        <div className="lang-switch" title={t.langSwitch}>
          <Languages size={14} aria-hidden />
          <button
            type="button"
            className={lang === 'es' ? 'active' : ''}
            onClick={() => setLang('es')}
          >
            ES
          </button>
          <button
            type="button"
            className={lang === 'en' ? 'active' : ''}
            onClick={() => setLang('en')}
          >
            EN
          </button>
        </div>
        <span className="chip live">
          {online}/30 {t.online}
        </span>
      </header>

      <main className="main">
        {scenarioActive && (
          <div className="scenario-banner">
            <Zap size={16} color="var(--accent)" />
            <strong>{t.scenarioDemo}</strong>{' '}
            {scenarioLabel || t.scenarioStarting}
          </div>
        )}
        {children}
      </main>
      <ToastStack />
    </div>
  );
}

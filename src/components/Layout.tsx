import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
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

const PATH_TO_PAGE: Record<string, PageId> = {
  '/': 'dashboard',
  '/dashboard': 'dashboard',
  '/operations': 'operations',
  '/live': 'live',
  '/watchlists': 'watchlists',
  '/rules': 'rules',
  '/alerts': 'alerts',
  '/search': 'search',
  '/gdpr': 'gdpr',
};

export function Layout() {
  const { t, lang, setLang } = useLanguage();
  const { unreadCritical, scenarioActive, scenarioKey, cameras } = useDemo();
  const location = useLocation();
  const navigate = useNavigate();

  const page = PATH_TO_PAGE[location.pathname] ?? 'dashboard';
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
            onClick={() => navigate('/dashboard')}
            title={t.brandTitle}
          >
            {t.brandTitle}
          </button>
          <div className="brand-sub">{t.brandSub}</div>
        </div>
        <nav className="nav">
          {NAV_ORDER.map((id) => {
            const Icon = NAV_ICONS[id];
            const to = id === 'dashboard' ? '/dashboard' : `/${id}`;
            return (
              <NavLink
                key={id}
                to={to}
                end={id === 'dashboard'}
                className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
              >
                <Icon size={16} />
                {t.nav[id]}
                {id === 'alerts' && unreadCritical > 0 && (
                  <span className="nav-badge">{unreadCritical}</span>
                )}
              </NavLink>
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
        <Outlet />
      </main>
      <ToastStack />
    </div>
  );
}

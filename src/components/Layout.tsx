import { useEffect } from 'react';
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
  UserCog,
} from 'lucide-react';
import type { OperatorRole, PageId } from '../types';
import { useDemo } from '../store/DemoContext';
import { useRole } from '../store/RoleContext';
import { useLanguage } from '../i18n/LanguageContext';
import { ToastStack } from './ToastStack';

const ROLE_ORDER: OperatorRole[] = ['admin', 'security', 'reception'];

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
  const { role, setRole, canAccess } = useRole();
  const location = useLocation();
  const navigate = useNavigate();

  const page = PATH_TO_PAGE[location.pathname] ?? 'dashboard';
  const online = cameras.filter((c) => c.status !== 'offline').length;
  const scenarioLabel =
    scenarioKey && scenarioKey in t.events
      ? t.events[scenarioKey as keyof typeof t.events]
      : '';
  const visibleNav = NAV_ORDER.filter((id) => canAccess(id));

  // If the active role loses access to the current page (role switched, or a
  // restricted role deep-links a URL directly), bounce back to a page it can see.
  useEffect(() => {
    if (!canAccess(page)) {
      navigate('/dashboard', { replace: true });
    }
  }, [page, canAccess, navigate]);

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
          {visibleNav.map((id) => {
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
        <div className="lang-switch" title={t.roleSwitch}>
          <UserCog size={14} aria-hidden />
          {ROLE_ORDER.map((r) => (
            <button
              key={r}
              type="button"
              className={role === r ? 'active' : ''}
              onClick={() => setRole(r)}
              title={t.gdpr[r === 'admin' ? 'roleAdminDesc' : r === 'security' ? 'roleSecurityDesc' : 'roleReceptionDesc']}
            >
              {t.gdpr[r === 'admin' ? 'roleAdmin' : r === 'security' ? 'roleSecurity' : 'roleReception']}
            </button>
          ))}
        </div>
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

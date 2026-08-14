import type { CameraZone, OperatorRole, PageId } from '../types';

/**
 * Pages each operator role can reach in the sidebar. Mirrors the access levels
 * described on the GDPR page (Admin / Seguridad / Recepción):
 *  - Admin: full configuration + reporting access.
 *  - Security: live monitoring, alerts, and limited search — no rule/watchlist editing.
 *  - Reception: lobby / check-in alerts only.
 */
export const ROLE_PAGES: Record<OperatorRole, PageId[]> = {
  admin: ['dashboard', 'operations', 'live', 'watchlists', 'rules', 'alerts', 'search', 'gdpr'],
  security: ['dashboard', 'operations', 'live', 'alerts', 'search', 'gdpr'],
  reception: ['dashboard', 'alerts'],
};

/** Camera zones visible to a Reception operator when filtering alerts. */
export const RECEPTION_ZONES: CameraZone[] = ['lobby', 'reception'];

export function canAccessPage(role: OperatorRole, page: PageId): boolean {
  return ROLE_PAGES[role].includes(page);
}

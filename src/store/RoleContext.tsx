import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { OperatorRole } from '../types';
import { canAccessPage } from '../data/roles';
import type { PageId } from '../types';

interface RoleContextValue {
  role: OperatorRole;
  setRole: (role: OperatorRole) => void;
  canAccess: (page: PageId) => boolean;
}

const RoleContext = createContext<RoleContextValue | null>(null);

const STORAGE_KEY = 'hotel-vms-role';
const VALID_ROLES: OperatorRole[] = ['admin', 'security', 'reception'];

export function RoleProvider({ children }: { children: ReactNode }) {
  const [role, setRoleState] = useState<OperatorRole>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return (VALID_ROLES as string[]).includes(saved ?? '') ? (saved as OperatorRole) : 'admin';
  });

  const setRole = useCallback((next: OperatorRole) => {
    setRoleState(next);
    localStorage.setItem(STORAGE_KEY, next);
  }, []);

  const canAccess = useCallback((page: PageId) => canAccessPage(role, page), [role]);

  const value = useMemo(() => ({ role, setRole, canAccess }), [role, setRole, canAccess]);

  return <RoleContext.Provider value={value}>{children}</RoleContext.Provider>;
}

export function useRole() {
  const ctx = useContext(RoleContext);
  if (!ctx) throw new Error('useRole must be used within RoleProvider');
  return ctx;
}

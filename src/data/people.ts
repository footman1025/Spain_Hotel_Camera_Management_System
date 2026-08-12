import type { Person } from '../types';

export const PEOPLE: Person[] = [
  { id: 'p-01', name: 'Juan Pérez', role: 'Recepcionista', watchlist: 'employees', photoColor: '#2d6a4f', initials: 'JP' },
  { id: 'p-02', name: 'María López', role: 'Jefa de piso', watchlist: 'employees', photoColor: '#1b4332', initials: 'ML' },
  { id: 'p-03', name: 'Carlos Ruiz', role: 'Seguridad', watchlist: 'employees', photoColor: '#40916c', initials: 'CR' },
  { id: 'p-04', name: 'Ana García', role: 'Gobernanta', watchlist: 'employees', photoColor: '#52b788', initials: 'AG' },
  { id: 'p-05', name: 'Elena Martín', role: 'Huésped · Hab. 214', watchlist: 'guests', photoColor: '#1d3557', initials: 'EM' },
  { id: 'p-06', name: 'Robert Smith', role: 'Huésped · Hab. 101', watchlist: 'guests', photoColor: '#457b9d', initials: 'RS' },
  { id: 'p-07', name: 'Sophie Dubois', role: 'Huésped · Hab. 301', watchlist: 'guests', photoColor: '#023e8a', initials: 'SD' },
  { id: 'p-08', name: 'Persona bloqueada', role: 'Lista denegados', watchlist: 'blocked', photoColor: '#9b2226', initials: 'XX' },
];

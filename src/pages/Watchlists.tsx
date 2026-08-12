import { useState, type FormEvent } from 'react';
import { UserPlus, Trash2, Users, UserCheck, UserX, ShieldAlert } from 'lucide-react';
import { useDemo, watchlistLabel } from '../store/DemoContext';
import { useLanguage } from '../i18n/LanguageContext';
import type { WatchlistType } from '../types';

export function Watchlists() {
  const { t, lang } = useLanguage();
  const { people, addPerson, removePerson } = useDemo();
  const [filter, setFilter] = useState<WatchlistType | 'all'>('all');
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [watchlist, setWatchlist] = useState<WatchlistType>('guests');
  const w = t.watchlists;

  const counts = {
    all: people.length,
    employees: people.filter((p) => p.watchlist === 'employees').length,
    guests: people.filter((p) => p.watchlist === 'guests').length,
    blocked: people.filter((p) => p.watchlist === 'blocked').length,
  };

  const filtered = people.filter((p) => filter === 'all' || p.watchlist === filter);

  const personRole = (id: string, fallback: string) => {
    const map = t.roles as Record<string, string>;
    return map[id] ?? fallback;
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    const initials = name
      .split(' ')
      .map((word) => word[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
    const colors: Record<WatchlistType, string> = {
      employees: '#2d6a4f',
      guests: '#1d3557',
      blocked: '#9b2226',
    };
    addPerson({
      name: name.trim(),
      role: role.trim() || w.noRole,
      watchlist,
      photoColor: colors[watchlist],
      initials: initials || '??',
    });
    setName('');
    setRole('');
  };

  const filters: { id: WatchlistType | 'all'; label: string; count: number; icon: typeof Users }[] = [
    { id: 'all', label: w.all, count: counts.all, icon: Users },
    { id: 'employees', label: w.employees, count: counts.employees, icon: UserCheck },
    { id: 'guests', label: w.guests, count: counts.guests, icon: Users },
    { id: 'blocked', label: w.blocked, count: counts.blocked, icon: ShieldAlert },
  ];

  return (
    <div className="watch-page">
      <section className="watch-hero">
        <div>
          <h1>{w.title}</h1>
          <p>{w.subtitle}</p>
        </div>
        <div className="watch-hero-stats">
          <div className="watch-stat tone-teal">
            <UserCheck size={16} />
            <div>
              <strong>{counts.employees}</strong>
              <span>{w.employees}</span>
            </div>
          </div>
          <div className="watch-stat tone-blue">
            <Users size={16} />
            <div>
              <strong>{counts.guests}</strong>
              <span>{w.guests}</span>
            </div>
          </div>
          <div className="watch-stat tone-red">
            <UserX size={16} />
            <div>
              <strong>{counts.blocked}</strong>
              <span>{w.blocked}</span>
            </div>
          </div>
        </div>
      </section>

      <div className="watch-filters">
        {filters.map((f) => {
          const Icon = f.icon;
          return (
            <button
              key={f.id}
              type="button"
              className={`watch-filter ${filter === f.id ? 'active' : ''}`}
              onClick={() => setFilter(f.id)}
            >
              <Icon size={14} />
              <span>{f.label}</span>
              <em>{f.count}</em>
            </button>
          );
        })}
      </div>

      <section className="watch-add">
        <div className="watch-add-head">
          <div className="watch-add-icon">
            <UserPlus size={16} />
          </div>
          <div>
            <h2>{w.addTitle}</h2>
            <p>{w.addHint}</p>
          </div>
        </div>
        <form className="watch-form" onSubmit={submit}>
          <input
            className="input"
            placeholder={w.name}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            className="input"
            placeholder={w.role}
            value={role}
            onChange={(e) => setRole(e.target.value)}
          />
          <select
            className="select"
            value={watchlist}
            onChange={(e) => setWatchlist(e.target.value as WatchlistType)}
          >
            <option value="employees">{w.employees}</option>
            <option value="guests">{w.guests}</option>
            <option value="blocked">{w.blocked}</option>
          </select>
          <button className="btn btn-primary" type="submit">
            <UserPlus size={14} />
            {w.add}
          </button>
        </form>
      </section>

      <div className="watch-results-label">
        {w.total}: <strong>{filtered.length}</strong>
      </div>

      {filtered.length === 0 ? (
        <div className="watch-empty">{w.empty}</div>
      ) : (
        <div className="person-grid">
          {filtered.map((p) => (
            <article key={p.id} className={`person-card tone-${p.watchlist}`}>
              <div className="avatar" style={{ background: p.photoColor }}>
                {p.initials}
              </div>
              <div className="person-info">
                <h3>{p.name}</h3>
                <p>{personRole(p.id, p.role)}</p>
                <span className={`tag ${p.watchlist}`}>{watchlistLabel(p.watchlist, lang)}</span>
              </div>
              <button
                type="button"
                className="person-remove"
                onClick={() => removePerson(p.id)}
                title={w.remove}
                aria-label={w.remove}
              >
                <Trash2 size={14} />
              </button>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

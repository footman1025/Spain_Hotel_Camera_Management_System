import { useMemo, useState } from 'react';
import { AlertItem } from '../components/AlertItem';
import { useDemo } from '../store/DemoContext';
import { useRole } from '../store/RoleContext';
import { useLanguage } from '../i18n/LanguageContext';
import { RECEPTION_ZONES } from '../data/roles';
import type { AlertSeverity } from '../types';

export function Alerts() {
  const { t } = useLanguage();
  const { events, cameras, acknowledgeEvent, acknowledgeAll } = useDemo();
  const { role } = useRole();
  const [severity, setSeverity] = useState<AlertSeverity | 'all'>('all');
  const [onlyUnacked, setOnlyUnacked] = useState(false);
  const a = t.alerts;

  // Reception only sees lobby / check-in alerts, per the GDPR access-control page.
  const zoneById = useMemo(() => new Map(cameras.map((c) => [c.id, c.zone])), [cameras]);
  const scopedEvents = useMemo(() => {
    if (role !== 'reception') return events;
    return events.filter((e) => {
      const zone = zoneById.get(e.cameraId);
      return zone ? RECEPTION_ZONES.includes(zone) : false;
    });
  }, [events, role, zoneById]);

  const filtered = useMemo(() => {
    return scopedEvents.filter((e) => {
      if (severity !== 'all' && e.severity !== severity) return false;
      if (onlyUnacked && e.acknowledged) return false;
      return true;
    });
  }, [scopedEvents, onlyUnacked, severity]);

  // Reception's "acknowledge all" should only affect the lobby/check-in alerts it can
  // see, not every event in the system.
  const ackVisible = () => {
    if (role === 'reception') {
      scopedEvents.filter((e) => !e.acknowledged).forEach((e) => acknowledgeEvent(e.id));
    } else {
      acknowledgeAll();
    }
  };

  return (
    <>
      <div className="page-header">
        <div>
          <h1>{a.title}</h1>
          <p>{a.subtitle}</p>
        </div>
        <button className="btn" onClick={ackVisible}>
          {a.ackAll}
        </button>
      </div>

      <div className="filters">
        {(['all', 'critical', 'warning', 'info'] as const).map((s) => (
          <button
            key={s}
            className={`btn btn-sm ${severity === s ? 'btn-primary' : ''}`}
            onClick={() => setSeverity(s)}
          >
            {s === 'all' ? a.all : s}
          </button>
        ))}
        <button
          className={`btn btn-sm ${onlyUnacked ? 'btn-primary' : ''}`}
          onClick={() => setOnlyUnacked((v) => !v)}
        >
          {a.onlyUnacked}
        </button>
      </div>

      <div className="alert-list" style={{ maxHeight: 'none' }}>
        {filtered.length === 0 && <div className="empty">{a.empty}</div>}
        {filtered.map((e) => (
          <AlertItem key={e.id} event={e} onAck={acknowledgeEvent} />
        ))}
      </div>
    </>
  );
}

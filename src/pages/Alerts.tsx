import { useMemo, useState } from 'react';
import { AlertItem } from '../components/AlertItem';
import { useDemo } from '../store/DemoContext';
import { useLanguage } from '../i18n/LanguageContext';
import type { AlertSeverity } from '../types';

export function Alerts() {
  const { t } = useLanguage();
  const { events, acknowledgeEvent, acknowledgeAll } = useDemo();
  const [severity, setSeverity] = useState<AlertSeverity | 'all'>('all');
  const [onlyUnacked, setOnlyUnacked] = useState(false);
  const a = t.alerts;

  const filtered = useMemo(() => {
    return events.filter((e) => {
      if (severity !== 'all' && e.severity !== severity) return false;
      if (onlyUnacked && e.acknowledged) return false;
      return true;
    });
  }, [events, onlyUnacked, severity]);

  return (
    <>
      <div className="page-header">
        <div>
          <h1>{a.title}</h1>
          <p>{a.subtitle}</p>
        </div>
        <button className="btn" onClick={acknowledgeAll}>
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

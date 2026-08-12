import { useMemo, useState } from 'react';
import { format } from 'date-fns';
import { enUS, es } from 'date-fns/locale';
import { Download } from 'lucide-react';
import { useDemo } from '../store/DemoContext';
import { useLanguage } from '../i18n/LanguageContext';
import type { EventType } from '../types';

export function SearchPage() {
  const { t, lang } = useLanguage();
  const { events, cameras, exportEventsCsv } = useDemo();
  const [q, setQ] = useState('');
  const [cameraId, setCameraId] = useState('all');
  const [type, setType] = useState<EventType | 'all'>('all');
  const s = t.search;
  const locale = lang === 'es' ? es : enUS;

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    return events.filter((e) => {
      if (cameraId !== 'all' && e.cameraId !== cameraId) return false;
      if (type !== 'all' && e.type !== type) return false;
      if (!query) return true;
      const msg = lang === 'en' ? e.messageEn : e.message;
      return (
        msg.toLowerCase().includes(query) ||
        e.cameraName.toLowerCase().includes(query) ||
        (e.personName?.toLowerCase().includes(query) ?? false)
      );
    });
  }, [cameraId, events, lang, q, type]);

  const download = () => {
    const csv = exportEventsCsv();
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `hotel-vms-events-${format(new Date(), 'yyyyMMdd-HHmm')}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <div className="page-header">
        <div>
          <h1>{s.title}</h1>
          <p>{s.subtitle}</p>
        </div>
        <button className="btn btn-primary" onClick={download}>
          <Download size={14} />
          {s.export}
        </button>
      </div>

      <div className="filters">
        <input
          className="input"
          style={{ minWidth: 220, flex: 1 }}
          placeholder={s.placeholder}
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <select className="select" value={cameraId} onChange={(e) => setCameraId(e.target.value)}>
          <option value="all">{s.allCameras}</option>
          {cameras.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        <select
          className="select"
          value={type}
          onChange={(e) => setType(e.target.value as EventType | 'all')}
        >
          <option value="all">{s.allTypes}</option>
          {(Object.keys(s.types) as EventType[]).map((eventType) => (
            <option key={eventType} value={eventType}>
              {s.types[eventType]}
            </option>
          ))}
        </select>
      </div>

      <div className="panel">
        <div className="panel-header">
          <h2>
            {s.results} · {filtered.length} {filtered.length === 1 ? s.event : s.events}
          </h2>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table className="table">
            <thead>
              <tr>
                <th>{s.date}</th>
                <th>{s.type}</th>
                <th>{s.severity}</th>
                <th>{s.camera}</th>
                <th>{s.person}</th>
                <th>{s.message}</th>
                <th>{s.channels}</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((e) => (
                <tr key={e.id}>
                  <td style={{ fontFamily: 'var(--mono)', fontSize: 12, whiteSpace: 'nowrap' }}>
                    {format(new Date(e.timestamp), 'dd/MM/yy HH:mm:ss', { locale })}
                  </td>
                  <td>{s.types[e.type]}</td>
                  <td>
                    <span className={`severity ${e.severity}`}>{e.severity}</span>
                  </td>
                  <td>{e.cameraName}</td>
                  <td>{e.personName ?? '—'}</td>
                  <td>{lang === 'en' ? e.messageEn : e.message}</td>
                  <td>{e.channels.join(', ')}</td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="empty">
                    {s.noResults}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

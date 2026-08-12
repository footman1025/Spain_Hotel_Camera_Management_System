import { CameraFeed } from '../components/CameraFeed';
import { AlertItem } from '../components/AlertItem';
import { useDemo } from '../store/DemoContext';
import { useLanguage } from '../i18n/LanguageContext';

export function Operations() {
  const { t } = useLanguage();
  const { cameras, events, rules, overlays, acknowledgeEvent } = useDemo();
  const online = cameras.filter((c) => c.status !== 'offline').length;
  const recording = cameras.filter((c) => c.status === 'recording').length;
  const critical = events.filter((e) => e.severity === 'critical' && !e.acknowledged).length;
  const activeRules = rules.filter((r) => r.enabled).length;
  const o = t.ops;

  return (
    <>
      <div className="page-header">
        <div>
          <h1>{o.title}</h1>
          <p>{o.subtitle}</p>
        </div>
      </div>

      <div className="stats">
        <div className="stat">
          <div className="stat-label">{o.camsOnline}</div>
          <div className="stat-value ok">{online}</div>
        </div>
        <div className="stat">
          <div className="stat-label">{o.recording}</div>
          <div className="stat-value">{recording}</div>
        </div>
        <div className="stat">
          <div className="stat-label">{o.criticalAlerts}</div>
          <div className={`stat-value ${critical ? 'bad' : 'ok'}`}>{critical}</div>
        </div>
        <div className="stat">
          <div className="stat-label">{o.activeRules}</div>
          <div className="stat-value">{activeRules}</div>
        </div>
      </div>

      <div className="two-col">
        <div className="panel">
          <div className="panel-header">
            <h2>{o.gridTitle}</h2>
          </div>
          <div className="panel-body">
            <div className="grid-cams">
              {cameras.slice(0, 12).map((cam) => (
                <CameraFeed key={cam.id} camera={cam} overlays={overlays} />
              ))}
            </div>
            <p style={{ margin: '12px 0 0', color: 'var(--text-muted)', fontSize: 12 }}>
              +{cameras.length - 12} {o.moreCams}
            </p>
          </div>
        </div>

        <div className="panel">
          <div className="panel-header">
            <h2>{o.recentEvents}</h2>
          </div>
          <div className="panel-body">
            <div className="alert-list">
              {events.slice(0, 8).map((e) => (
                <AlertItem key={e.id} event={e} onAck={acknowledgeEvent} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

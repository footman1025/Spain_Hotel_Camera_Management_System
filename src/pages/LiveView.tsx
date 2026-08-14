import { CameraFeed } from '../components/CameraFeed';
import { AlertItem } from '../components/AlertItem';
import { useDemo } from '../store/DemoContext';
import { useLanguage } from '../i18n/LanguageContext';

export function LiveView() {
  const { t } = useLanguage();
  const {
    cameras,
    overlays,
    events,
    selectedCameraId,
    setSelectedCameraId,
    maskedZones,
    acknowledgeEvent,
  } = useDemo();

  const camera = cameras.find((c) => c.id === selectedCameraId) ?? cameras[0];
  const nearby = cameras.filter((c) => c.floor === camera.floor).slice(0, 6);
  const zone = t.zones[camera.zone];

  return (
    <>
      <div className="page-header">
        <div>
          <h1>{t.live.title}</h1>
          <p>
            {camera.name} · {zone} · {t.live.floor} {camera.floor}
            {camera.hasLine ? ` · ${t.live.line}: ${camera.lineLabel}` : ''}
          </p>
        </div>
      </div>

      <div className="live-layout">
        <div className="live-main">
          <div className="live-stage">
            <CameraFeed
              key={camera.id}
              camera={camera}
              overlays={overlays}
              large
              showPersonSilhouette
              masked={maskedZones.includes(camera.zone)}
            />
          </div>
          <div className="panel">
            <div className="panel-header">
              <h2>
                {t.live.sameFloor} ({camera.floor})
              </h2>
            </div>
            <div className="panel-body">
              <div className="thumb-list" style={{ maxHeight: 'none' }}>
                {nearby.map((cam) => (
                  <CameraFeed
                    key={cam.id}
                    camera={cam}
                    overlays={overlays}
                    selected={cam.id === camera.id}
                    masked={maskedZones.includes(cam.zone)}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="live-side">
          <div className="panel">
            <div className="panel-header">
              <h2>{t.live.selector}</h2>
            </div>
            <div className="panel-body" style={{ maxHeight: 220, overflow: 'auto' }}>
              <select
                className="select"
                style={{ width: '100%', marginBottom: 10 }}
                value={camera.id}
                onChange={(e) => setSelectedCameraId(e.target.value)}
              >
                {cameras.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.floor}) {c.status === 'offline' ? '· OFF' : ''}
                  </option>
                ))}
              </select>
              <p style={{ margin: 0, fontSize: 12, color: 'var(--text-muted)' }}>{t.live.simulated}</p>
            </div>
          </div>

          <div className="panel" style={{ flex: 1 }}>
            <div className="panel-header">
              <h2>{t.live.liveEvents}</h2>
            </div>
            <div className="panel-body">
              <div className="alert-list">
                {events.slice(0, 10).map((e) => (
                  <AlertItem key={e.id} event={e} onAck={acknowledgeEvent} compact />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

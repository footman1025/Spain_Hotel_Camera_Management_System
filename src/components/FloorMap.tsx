import { useNavigate } from 'react-router-dom';
import { useDemo } from '../store/DemoContext';
import { useLanguage } from '../i18n/LanguageContext';
import type { Camera } from '../types';

/** Fixed floor order for a Spanish hotel building (basement → roof). */
const FLOOR_ORDER = ['-1', 'PB', '1F', '2F', '3F', 'AZ'];

function groupByFloor(cameras: Camera[]) {
  const groups = new Map<string, Camera[]>();
  for (const cam of cameras) {
    const list = groups.get(cam.floor) ?? [];
    list.push(cam);
    groups.set(cam.floor, list);
  }
  return FLOOR_ORDER.filter((f) => groups.has(f)).map((floor) => ({
    floor,
    cameras: groups.get(floor)!,
  }));
}

/**
 * "Views/maps" per floor — the M2 deliverable ("cameras integrated and organized by
 * floor/zone"). Clicking a dot jumps straight into Live view for that camera.
 */
export function FloorMap() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { cameras, overlays, maskedZones, setSelectedCameraId } = useDemo();
  const floors = groupByFloor(cameras);
  const activeCameraIds = new Set(overlays.map((o) => o.cameraId));

  const openCamera = (id: string) => {
    setSelectedCameraId(id);
    navigate('/live');
  };

  return (
    <div className="floor-map">
      {floors.map(({ floor, cameras: floorCams }) => (
        <div key={floor} className="floor-row">
          <div className="floor-row-label">
            {t.live.floor} {floor}
          </div>
          <div className="floor-row-cams">
            {floorCams.map((cam) => {
              const hasEvent = activeCameraIds.has(cam.id);
              const masked = maskedZones.includes(cam.zone);
              return (
                <button
                  key={cam.id}
                  type="button"
                  className={`cam-dot ${cam.status} ${hasEvent ? 'event' : ''}`}
                  title={`${cam.name} · ${t.zones[cam.zone]}${masked ? ` · ${t.gdpr.maskBadge}` : ''}`}
                  onClick={() => openCamera(cam.id)}
                >
                  <span className="cam-dot-core" />
                  {masked && <span className="cam-dot-mask" aria-hidden />}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

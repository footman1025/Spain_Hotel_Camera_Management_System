import { memo, useEffect, useState } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { FEED_IMAGES } from '../data/feedImages';
import type { Camera, DetectionOverlay } from '../types';

interface Props {
  camera: Camera;
  overlays?: DetectionOverlay[];
  selected?: boolean;
  showPersonSilhouette?: boolean;
  large?: boolean;
  onClick?: () => void;
}

function CameraFeedComponent({
  camera,
  overlays = [],
  selected,
  showPersonSilhouette = true,
  large,
  onClick,
}: Props) {
  const camOverlays = overlays.filter((o) => o.cameraId === camera.id);
  const [ts, setTs] = useState(() => format(new Date(), 'dd/MM/yyyy HH:mm:ss', { locale: es }));
  const bgImage = FEED_IMAGES[camera.zone] ?? FEED_IMAGES.lobby;
  const offline = camera.status === 'offline';

  useEffect(() => {
    if (!large) return;
    const timer = window.setInterval(() => {
      setTs(format(new Date(), 'dd/MM/yyyy HH:mm:ss', { locale: es }));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [large]);

  return (
    <div
      className={`camera-tile ${selected ? 'selected' : ''} ${large ? 'large' : ''} ${onClick ? 'clickable' : 'view-only'}`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      style={large ? { aspectRatio: '16/9', width: '100%', minHeight: 280 } : undefined}
    >
      <div className={`camera-feed ${camera.zone} ${offline ? 'offline' : ''}`}>
        {!offline && (
          <img
            className="feed-bg-img"
            src={bgImage}
            alt=""
            loading={large ? 'eager' : 'lazy'}
            decoding="async"
            draggable={false}
          />
        )}
        <div className="feed-dim" />
        <div className="feed-noise" />
        {showPersonSilhouette && !offline && <div className="feed-person" />}
        {camera.hasLine && (
          <div className="virtual-line" data-label={camera.lineLabel ?? 'Línea'} />
        )}
        {camOverlays.map((o) =>
          o.kind === 'line_flash' ? (
            <div
              key={o.id}
              className="overlay-line"
              style={{
                left: `${o.x}%`,
                top: `${o.y}%`,
                width: `${o.w}%`,
                background: o.color,
                boxShadow: `0 0 12px ${o.color}`,
              }}
            />
          ) : (
            <div
              key={o.id}
              className="overlay-box"
              style={{
                left: `${o.x}%`,
                top: `${o.y}%`,
                width: `${o.w}%`,
                height: `${o.h}%`,
                borderColor: o.color,
                color: o.color,
                background: `${o.color}22`,
              }}
            >
              <span className="overlay-label" style={{ background: o.color }}>
                {o.label}
              </span>
            </div>
          ),
        )}
      </div>
      <div className="cam-meta">
        <div className="cam-meta-top">
          <span className="cam-name">{camera.name}</span>
          {camera.status === 'recording' && <span className="rec-badge">● REC</span>}
          {offline && <span className="rec-badge">OFFLINE</span>}
        </div>
        <div className="cam-meta-bottom">
          <span>
            <span className={`status-dot ${camera.status}`} /> {camera.floor}
          </span>
          <span className="cam-ts">{ts}</span>
        </div>
      </div>
    </div>
  );
}

export const CameraFeed = memo(CameraFeedComponent);

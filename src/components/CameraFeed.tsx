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

interface LiveTrack {
  id: string;
  kind: 'person' | 'face';
  label: string;
  color: string;
  x: number;
  y: number;
  w: number;
  h: number;
  vx: number;
  vy: number;
}

function LiveClock({ active }: { active: boolean }) {
  const [ts, setTs] = useState(() => format(new Date(), 'dd/MM/yyyy HH:mm:ss', { locale: es }));

  useEffect(() => {
    if (!active) return;
    const timer = window.setInterval(() => {
      setTs(format(new Date(), 'dd/MM/yyyy HH:mm:ss', { locale: es }));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [active]);

  return <span className="cam-ts">{ts}</span>;
}

/** Stable image layer — never remounts when overlays / tracks update */
const FeedBackground = memo(function FeedBackground({
  src,
  large,
  offline,
}: {
  src: string;
  large?: boolean;
  offline: boolean;
}) {
  if (offline) return null;

  return (
    <img
      className={`feed-bg-img ${large ? 'feed-bg-live' : ''}`}
      src={src}
      alt=""
      loading="eager"
      decoding="async"
      draggable={false}
      // Local asset — do not tear down the node on transient errors
    />
  );
});

function CameraFeedComponent({
  camera,
  overlays = [],
  selected,
  showPersonSilhouette = true,
  large,
  onClick,
}: Props) {
  const camOverlays = overlays.filter((o) => o.cameraId === camera.id);
  const bgImage = FEED_IMAGES[camera.zone] ?? FEED_IMAGES.lobby;
  const offline = camera.status === 'offline';
  const [tracks, setTracks] = useState<LiveTrack[]>([]);

  useEffect(() => {
    if (offline || (!large && !selected)) {
      setTracks([]);
      return;
    }

    const seed: LiveTrack[] = [
      {
        id: `${camera.id}-p1`,
        kind: 'person',
        label: 'Person',
        color: '#3b82c4',
        x: 38,
        y: 42,
        w: 14,
        h: 28,
        vx: 0.12,
        vy: 0.04,
      },
      {
        id: `${camera.id}-f1`,
        kind: 'face',
        label: 'Face ID',
        color: '#2a9d8f',
        x: 58,
        y: 24,
        w: 10,
        h: 16,
        vx: -0.08,
        vy: 0.06,
      },
    ];
    setTracks(seed);

    const timer = window.setInterval(() => {
      setTracks((prev) =>
        prev.map((t) => {
          let { x, y, vx, vy } = t;
          x += vx;
          y += vy;
          if (x < 8 || x > 78) vx = -vx;
          if (y < 12 || y > 62) vy = -vy;
          x = Math.min(78, Math.max(8, x));
          y = Math.min(62, Math.max(12, y));
          vx += (Math.random() - 0.5) * 0.02;
          vy += (Math.random() - 0.5) * 0.015;
          vx = Math.max(-0.35, Math.min(0.35, vx));
          vy = Math.max(-0.25, Math.min(0.25, vy));
          return { ...t, x, y, vx, vy };
        }),
      );
    }, 100);

    return () => window.clearInterval(timer);
  }, [camera.id, large, offline, selected]);

  return (
    <div
      className={`camera-tile ${selected ? 'selected' : ''} ${large ? 'large' : ''} ${onClick ? 'clickable' : 'view-only'}`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      style={large ? { aspectRatio: '16/9', width: '100%', minHeight: 280 } : undefined}
    >
      <div className={`camera-feed ${camera.zone} ${offline ? 'offline' : ''} ${large ? 'live-motion' : ''}`}>
        <FeedBackground src={bgImage} large={large} offline={offline} />
        <div className="feed-dim" />
        <div className="feed-noise" />
        {large && !offline && <div className="feed-scan" aria-hidden />}
        {showPersonSilhouette && !offline && <div className="feed-person" />}
        {camera.hasLine && (
          <div className="virtual-line" data-label={camera.lineLabel ?? 'Línea'} />
        )}

        {tracks.map((t) => (
          <div
            key={t.id}
            className={`overlay-box overlay-moving ${t.kind === 'face' ? 'overlay-face' : ''}`}
            style={{
              left: `${t.x}%`,
              top: `${t.y}%`,
              width: `${t.w}%`,
              height: `${t.h}%`,
              borderColor: t.color,
              color: t.color,
              background: `${t.color}18`,
            }}
          >
            <span className="overlay-label" style={{ background: t.color }}>
              {t.label}
            </span>
          </div>
        ))}

        {camOverlays.map((o) =>
          o.kind === 'line_flash' ? (
            <div
              key={o.id}
              className="overlay-line overlay-flash"
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
              className="overlay-box overlay-pulse"
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
          <LiveClock active={Boolean(large)} />
        </div>
      </div>
    </div>
  );
}

export const CameraFeed = memo(CameraFeedComponent);

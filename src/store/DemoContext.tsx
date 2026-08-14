import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { CAMERAS } from '../data/cameras';
import { PEOPLE } from '../data/people';
import { DEFAULT_RULES } from '../data/rules';
import { interpolate, translations } from '../i18n/translations';
import type {
  Camera,
  CameraZone,
  DetectionOverlay,
  EventType,
  Person,
  SecurityEvent,
  SecurityRule,
  WatchlistType,
} from '../types';

type ScenarioKey = 'scenario1' | 'scenario2' | 'scenario3' | 'scenario4' | 'scenario5' | '';

interface DemoContextValue {
  cameras: Camera[];
  people: Person[];
  rules: SecurityRule[];
  events: SecurityEvent[];
  overlays: DetectionOverlay[];
  selectedCameraId: string;
  setSelectedCameraId: (id: string) => void;
  simulatorRunning: boolean;
  setSimulatorRunning: (v: boolean) => void;
  speed: 1 | 5 | 10;
  setSpeed: (s: 1 | 5 | 10) => void;
  scenarioActive: boolean;
  scenarioKey: ScenarioKey;
  runScenario: () => void;
  stopScenario: () => void;
  acknowledgeEvent: (id: string) => void;
  acknowledgeAll: () => void;
  toggleRule: (id: string) => void;
  addPerson: (person: Omit<Person, 'id'>) => void;
  removePerson: (id: string) => void;
  unreadCritical: number;
  exportEventsCsv: () => string;
  retentionDays: 30 | 60 | 90;
  setRetentionDays: (days: 30 | 60 | 90) => void;
  maskedZones: CameraZone[];
  toggleZoneMask: (zone: CameraZone) => void;
}

const DEFAULT_MASKED_ZONES: CameraZone[] = ['pool'];

const DemoContext = createContext<DemoContextValue | null>(null);

function uid(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

function nowIso() {
  return new Date().toISOString();
}

function nightDate() {
  const d = new Date();
  d.setHours(23, 40 + Math.floor(Math.random() * 10), Math.floor(Math.random() * 60), 0);
  return d;
}

function roleFor(person: Person, lang: 'es' | 'en') {
  const map = translations[lang].roles as Record<string, string>;
  return map[person.id] ?? person.role;
}

function toMinutes(hhmm: string) {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
}

/** Time-window check that supports ranges crossing midnight (e.g. 22:00–06:00). */
function isWithinWindow(date: Date, start: string, end: string) {
  const minutes = date.getHours() * 60 + date.getMinutes();
  const startMin = toMinutes(start);
  const endMin = toMinutes(end);
  if (startMin <= endMin) return minutes >= startMin && minutes <= endMin;
  return minutes >= startMin || minutes <= endMin;
}

interface RuleMatchParams {
  eventType: EventType;
  watchlist?: WatchlistType | 'unknown';
  zone: CameraZone;
  /** Whether this event is associated with a virtual line crossing. */
  lineCrossed: boolean;
  at?: Date;
}

/**
 * Finds the first enabled rule (list order = priority) whose condition matches an
 * incoming simulated event. This is what makes the Rules page functional: toggling a
 * rule off here actually changes whether/how the corresponding alert is delivered,
 * mirroring how Milestone XProtect Rules + Alarm Manager would route the same event.
 */
function matchRule(rules: SecurityRule[], params: RuleMatchParams): SecurityRule | null {
  const at = params.at ?? new Date();
  return (
    rules.find((rule) => {
      if (!rule.enabled) return false;
      const c = rule.condition;
      if (c.eventType !== 'any' && c.eventType !== params.eventType) return false;
      if (c.watchlist && c.watchlist !== 'any' && c.watchlist !== (params.watchlist ?? 'unknown')) {
        return false;
      }
      if (c.zones && c.zones.length > 0 && !c.zones.includes(params.zone)) return false;
      if (rule.requireLineCross && !params.lineCrossed) return false;
      if (!isWithinWindow(at, c.timeStart, c.timeEnd)) return false;
      return true;
    }) ?? null
  );
}

function channelsForRule(rule: SecurityRule): SecurityEvent['channels'] {
  const channels: SecurityEvent['channels'] = ['app'];
  if (rule.notifyWhatsApp) channels.push('whatsapp');
  if (rule.notifySms) channels.push('sms');
  return channels;
}

export function DemoProvider({ children }: { children: ReactNode }) {
  const [cameras, setCameras] = useState<Camera[]>(CAMERAS);
  const [people, setPeople] = useState<Person[]>(PEOPLE);
  const [rules, setRules] = useState<SecurityRule[]>(DEFAULT_RULES);
  const [events, setEvents] = useState<SecurityEvent[]>([]);
  const [overlays, setOverlays] = useState<DetectionOverlay[]>([]);
  const [selectedCameraId, setSelectedCameraId] = useState('cam-01');
  const [simulatorRunning, setSimulatorRunning] = useState(true);
  const [speed, setSpeed] = useState<1 | 5 | 10>(1);
  const [scenarioActive, setScenarioActive] = useState(false);
  const [scenarioKey, setScenarioKey] = useState<ScenarioKey>('');
  const scenarioTimers = useRef<number[]>([]);
  const [retentionDays, setRetentionDays] = useState<30 | 60 | 90>(30);
  const [maskedZones, setMaskedZones] = useState<CameraZone[]>(DEFAULT_MASKED_ZONES);

  const toggleZoneMask = useCallback((zone: CameraZone) => {
    setMaskedZones((prev) =>
      prev.includes(zone) ? prev.filter((z) => z !== zone) : [...prev, zone],
    );
  }, []);

  const pushEvent = useCallback(
    (event: Omit<SecurityEvent, 'id' | 'timestamp' | 'acknowledged'> & { timestamp?: string }) => {
      const full: SecurityEvent = {
        ...event,
        id: uid('evt'),
        timestamp: event.timestamp ?? nowIso(),
        acknowledged: false,
      };
      setEvents((prev) => [full, ...prev].slice(0, 200));
      return full;
    },
    [],
  );

  const addOverlay = useCallback((overlay: Omit<DetectionOverlay, 'id' | 'expiresAt'> & { ttl?: number }) => {
    const item: DetectionOverlay = {
      ...overlay,
      id: uid('ov'),
      expiresAt: Date.now() + (overlay.ttl ?? 10000),
    };
    setOverlays((prev) => [...prev.filter((o) => o.expiresAt > Date.now()), item]);
  }, []);

  const emitFaceMatch = useCallback(
    (person: Person, camera: Camera, severity: SecurityEvent['severity'] = 'info') => {
      const color =
        person.watchlist === 'blocked' ? '#e63946' : person.watchlist === 'employees' ? '#2a9d8f' : '#457b9d';
      addOverlay({
        cameraId: camera.id,
        kind: 'face',
        label: `${person.name} (${person.watchlist})`,
        color,
        x: 28 + Math.random() * 20,
        y: 20 + Math.random() * 15,
        w: 18,
        h: 32,
      });
      const rule = matchRule(rules, {
        eventType: 'face_match',
        watchlist: person.watchlist,
        zone: camera.zone,
        lineCrossed: false,
      });
      const channels = rule ? channelsForRule(rule) : (['app'] as SecurityEvent['channels']);
      const eventSeverity = rule ? rule.severity : severity;
      const esMsg = interpolate(translations.es.events.faceMatch, {
        name: person.name,
        role: roleFor(person, 'es'),
        camera: camera.name,
      });
      const enMsg = interpolate(translations.en.events.faceMatch, {
        name: person.name,
        role: roleFor(person, 'en'),
        camera: camera.name,
      });
      pushEvent({
        type: 'face_match',
        severity: eventSeverity,
        cameraId: camera.id,
        cameraName: camera.name,
        personId: person.id,
        personName: person.name,
        message: esMsg,
        messageEn: enMsg,
        notified: channels.length > 1,
        channels,
      });
    },
    [addOverlay, pushEvent, rules],
  );

  const emitUnknownFace = useCallback(
    (camera: Camera, lineCrossed = false) => {
      addOverlay({
        cameraId: camera.id,
        kind: 'face',
        label: translations.es.events.unknown,
        color: '#e9c46a',
        x: 35 + Math.random() * 15,
        y: 18 + Math.random() * 12,
        w: 16,
        h: 30,
      });

      const rule = matchRule(rules, {
        eventType: 'face_unknown',
        watchlist: 'unknown',
        zone: camera.zone,
        lineCrossed,
      });
      const channels = rule ? channelsForRule(rule) : (['app'] as SecurityEvent['channels']);
      const eventSeverity = rule ? rule.severity : 'warning';

      pushEvent({
        type: 'face_unknown',
        severity: eventSeverity,
        cameraId: camera.id,
        cameraName: camera.name,
        message: interpolate(translations.es.events.unknownFace, { camera: camera.name }),
        messageEn: interpolate(translations.en.events.unknownFace, { camera: camera.name }),
        notified: channels.length > 1,
        channels,
      });
    },
    [addOverlay, pushEvent, rules],
  );

  const emitLineCross = useCallback(
    (camera: Camera, withUnknown = false) => {
      if (!camera.hasLine) return;
      const line = camera.lineLabel ?? camera.name;
      addOverlay({
        cameraId: camera.id,
        kind: 'line_flash',
        label: line,
        color: '#e63946',
        x: 10,
        y: 55,
        w: 80,
        h: 2,
        ttl: 2500,
      });

      const rule = matchRule(rules, {
        eventType: 'line_cross',
        zone: camera.zone,
        lineCrossed: true,
      });
      const channels = rule ? channelsForRule(rule) : (['app'] as SecurityEvent['channels']);
      const eventSeverity = rule ? rule.severity : camera.zone === 'room_door' ? 'warning' : 'info';

      pushEvent({
        type: 'line_cross',
        severity: eventSeverity,
        cameraId: camera.id,
        cameraName: camera.name,
        message: interpolate(translations.es.events.lineCross, { line }),
        messageEn: interpolate(translations.en.events.lineCross, { line }),
        notified: channels.length > 1,
        channels,
      });
      if (withUnknown) {
        window.setTimeout(() => emitUnknownFace(camera, true), 400);
      }
    },
    [addOverlay, emitUnknownFace, pushEvent, rules],
  );

  const emitCriticalNightScenario = useCallback(() => {
    const camera = cameras.find((c) => c.id === 'cam-19') ?? cameras[18];
    setSelectedCameraId(camera.id);
    emitLineCross(camera, true);
    window.setTimeout(() => {
      const night = nightDate();
      const rule = matchRule(rules, {
        eventType: 'face_unknown',
        watchlist: 'unknown',
        zone: camera.zone,
        lineCrossed: true,
        at: night,
      });

      // Whether this fires as a critical alert (and how it's routed) now depends on
      // whether the matching rule is actually enabled on the Rules page — toggle
      // "Acceso nocturno habitaciones" off and re-run the scenario to see the difference.
      pushEvent(
        rule
          ? {
              type: 'rule_trigger',
              severity: rule.severity,
              cameraId: camera.id,
              cameraName: camera.name,
              message: translations.es.events.ruleNight,
              messageEn: translations.en.events.ruleNight,
              timestamp: night.toISOString(),
              notified: true,
              channels: channelsForRule(rule),
            }
          : {
              type: 'rule_trigger',
              severity: 'info',
              cameraId: camera.id,
              cameraName: camera.name,
              message: translations.es.events.ruleNightSuppressed,
              messageEn: translations.en.events.ruleNightSuppressed,
              timestamp: night.toISOString(),
              notified: false,
              channels: ['app'],
            },
      );
    }, 900);
  }, [cameras, emitLineCross, pushEvent, rules]);

  const clearScenarioTimers = useCallback(() => {
    scenarioTimers.current.forEach((t) => window.clearTimeout(t));
    scenarioTimers.current = [];
  }, []);

  const stopScenario = useCallback(() => {
    clearScenarioTimers();
    setScenarioActive(false);
    setScenarioKey('');
  }, [clearScenarioTimers]);

  const runScenario = useCallback(() => {
    clearScenarioTimers();
    setScenarioActive(true);
    setSimulatorRunning(false);
    setScenarioKey('scenario1');

    const camLobby = cameras.find((c) => c.id === 'cam-01') ?? cameras[0];
    const camReception = cameras.find((c) => c.id === 'cam-03') ?? cameras[2];
    const emp1 = people.find((p) => p.id === 'p-01') ?? people[0];
    const emp2 = people.find((p) => p.id === 'p-03') ?? people[2];

    // Run first step immediately so UI updates without waiting for setTimeout(0)
    setSelectedCameraId(camLobby.id);
    emitFaceMatch(emp1, camLobby, 'info');

    const steps: { delay: number; key: ScenarioKey; action: () => void }[] = [
      {
        delay: 2500,
        key: 'scenario2',
        action: () => {
          setSelectedCameraId(camReception.id);
          emitFaceMatch(emp2, camReception, 'info');
        },
      },
      {
        delay: 5000,
        key: 'scenario3',
        action: () => emitCriticalNightScenario(),
      },
      {
        delay: 8000,
        key: 'scenario4',
        action: () => undefined,
      },
      {
        delay: 10000,
        key: 'scenario5',
        action: () => {
          setScenarioActive(false);
          setScenarioKey('');
          setSimulatorRunning(true);
        },
      },
    ];

    steps.forEach((step) => {
      const timerId = window.setTimeout(() => {
        setScenarioKey(step.key);
        step.action();
      }, step.delay);
      scenarioTimers.current.push(timerId);
    });
  }, [cameras, clearScenarioTimers, emitCriticalNightScenario, emitFaceMatch, people]);

  useEffect(() => {
    const t = window.setInterval(() => {
      setOverlays((prev) => {
        if (prev.length === 0) return prev;
        const now = Date.now();
        const next = prev
          .filter((o) => o.expiresAt > now)
          .map((o) =>
            o.kind === 'face'
              ? {
                  ...o,
                  x: Math.min(75, Math.max(10, o.x + (Math.random() - 0.5) * 1.6)),
                  y: Math.min(55, Math.max(10, o.y + (Math.random() - 0.5) * 1.2)),
                }
              : o,
          );
        return next.length === 0 && prev.length === 0 ? prev : next;
      });
    }, 200);
    return () => window.clearInterval(t);
  }, []);

  // Keep simulator callbacks/data in refs so the interval is not restarted every render
  const camerasRef = useRef(cameras);
  const peopleRef = useRef(people);
  const selectedCameraIdRef = useRef(selectedCameraId);
  const emitFaceMatchRef = useRef(emitFaceMatch);
  const emitUnknownFaceRef = useRef(emitUnknownFace);
  const emitLineCrossRef = useRef(emitLineCross);
  const pushEventRef = useRef(pushEvent);

  useEffect(() => {
    camerasRef.current = cameras;
    peopleRef.current = people;
    selectedCameraIdRef.current = selectedCameraId;
    emitFaceMatchRef.current = emitFaceMatch;
    emitUnknownFaceRef.current = emitUnknownFace;
    emitLineCrossRef.current = emitLineCross;
    pushEventRef.current = pushEvent;
  }, [cameras, people, selectedCameraId, emitFaceMatch, emitUnknownFace, emitLineCross, pushEvent]);

  useEffect(() => {
    if (!simulatorRunning || scenarioActive) return;

    const interval = window.setInterval(() => {
      const currentCameras = camerasRef.current;
      const currentPeople = peopleRef.current;
      if (!currentPeople.length) return;

      const online = currentCameras.filter((c) => c.status !== 'offline');
      if (!online.length) return;

      // Bias events toward the selected live camera so overlays stay visible there
      const selectedId = selectedCameraIdRef.current;
      const selected = currentCameras.find((c) => c.id === selectedId && c.status !== 'offline');
      const cam =
        selected && Math.random() < 0.65
          ? selected
          : online[Math.floor(Math.random() * online.length)];
      const roll = Math.random();

      if (roll < 0.4) {
        const person = currentPeople[Math.floor(Math.random() * currentPeople.length)];
        if (person) emitFaceMatchRef.current(person, cam);
      } else if (roll < 0.6) {
        emitUnknownFaceRef.current(cam);
      } else if (roll < 0.85 && cam.hasLine) {
        emitLineCrossRef.current(cam, Math.random() > 0.7);
      } else if (roll < 0.92) {
        if (
          currentCameras.some((c) => c.id === 'cam-30' && c.status === 'offline') &&
          Math.random() > 0.5
        ) {
          setCameras((prev) =>
            prev.map((c) => (c.id === 'cam-30' ? { ...c, status: 'online' } : c)),
          );
          pushEventRef.current({
            type: 'camera_online',
            severity: 'info',
            cameraId: 'cam-30',
            cameraName: 'Almacen_01',
            message: translations.es.events.camOnline,
            messageEn: translations.en.events.camOnline,
            notified: false,
            channels: ['app'],
          });
        } else {
          pushEventRef.current({
            type: 'motion',
            severity: 'info',
            cameraId: cam.id,
            cameraName: cam.name,
            message: interpolate(translations.es.events.motion, { camera: cam.name }),
            messageEn: interpolate(translations.en.events.motion, { camera: cam.name }),
            notified: false,
            channels: ['app'],
          });
        }
      }
    }, 3200 / speed);

    return () => window.clearInterval(interval);
  }, [scenarioActive, simulatorRunning, speed]);
  useEffect(() => {
    const cam01 = CAMERAS.find((c) => c.id === 'cam-01')!;
    const emp = PEOPLE[0];
    setEvents([
      {
        id: 'seed-1',
        type: 'face_match',
        severity: 'info',
        cameraId: cam01.id,
        cameraName: cam01.name,
        personId: emp.id,
        personName: emp.name,
        message: interpolate(translations.es.events.faceMatch, {
          name: emp.name,
          role: roleFor(emp, 'es'),
          camera: cam01.name,
        }),
        messageEn: interpolate(translations.en.events.faceMatch, {
          name: emp.name,
          role: roleFor(emp, 'en'),
          camera: cam01.name,
        }),
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        notified: false,
        channels: ['app'],
        acknowledged: true,
      },
      {
        id: 'seed-2',
        type: 'line_cross',
        severity: 'info',
        cameraId: 'cam-08',
        cameraName: 'Parking_01',
        message: interpolate(translations.es.events.lineCross, { line: 'Barrera parking' }),
        messageEn: interpolate(translations.en.events.lineCross, { line: 'Parking barrier' }),
        timestamp: new Date(Date.now() - 7200000).toISOString(),
        notified: false,
        channels: ['app'],
        acknowledged: true,
      },
      {
        id: 'seed-3',
        type: 'camera_offline',
        severity: 'warning',
        cameraId: 'cam-30',
        cameraName: 'Almacen_01',
        message: translations.es.events.camOffline,
        messageEn: translations.en.events.camOffline,
        timestamp: new Date(Date.now() - 86400000).toISOString(),
        notified: true,
        channels: ['app', 'sms'],
        acknowledged: false,
      },
    ]);
  }, []);

  const acknowledgeEvent = useCallback((id: string) => {
    setEvents((prev) => prev.map((e) => (e.id === id ? { ...e, acknowledged: true } : e)));
  }, []);

  const acknowledgeAll = useCallback(() => {
    setEvents((prev) => prev.map((e) => ({ ...e, acknowledged: true })));
  }, []);

  const toggleRule = useCallback((id: string) => {
    setRules((prev) => prev.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r)));
  }, []);

  const addPerson = useCallback((person: Omit<Person, 'id'>) => {
    setPeople((prev) => [...prev, { ...person, id: uid('p') }]);
  }, []);

  const removePerson = useCallback((id: string) => {
    setPeople((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const unreadCritical = useMemo(
    () => events.filter((e) => !e.acknowledged && e.severity === 'critical').length,
    [events],
  );

  const exportEventsCsv = useCallback(() => {
    const header = 'id,tipo,severidad,camara,persona,mensaje_es,mensaje_en,fecha,canales,reconocido\n';
    const rows = events
      .map((e) =>
        [
          e.id,
          e.type,
          e.severity,
          e.cameraName,
          e.personName ?? '',
          `"${e.message.replace(/"/g, '""')}"`,
          `"${e.messageEn.replace(/"/g, '""')}"`,
          e.timestamp,
          e.channels.join('|'),
          e.acknowledged,
        ].join(','),
      )
      .join('\n');
    return header + rows;
  }, [events]);

  const value: DemoContextValue = {
    cameras,
    people,
    rules,
    events,
    overlays,
    selectedCameraId,
    setSelectedCameraId,
    simulatorRunning,
    setSimulatorRunning,
    speed,
    setSpeed,
    scenarioActive,
    scenarioKey,
    runScenario,
    stopScenario,
    acknowledgeEvent,
    acknowledgeAll,
    toggleRule,
    addPerson,
    removePerson,
    unreadCritical,
    exportEventsCsv,
    retentionDays,
    setRetentionDays,
    maskedZones,
    toggleZoneMask,
  };

  return <DemoContext.Provider value={value}>{children}</DemoContext.Provider>;
}

export function useDemo() {
  const ctx = useContext(DemoContext);
  if (!ctx) throw new Error('useDemo must be used within DemoProvider');
  return ctx;
}

export function watchlistLabel(w: WatchlistType, lang: 'es' | 'en' = 'es') {
  const t = translations[lang].watchlists;
  if (w === 'employees') return t.employees;
  if (w === 'guests') return t.guests;
  return t.blocked;
}

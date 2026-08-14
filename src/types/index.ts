export type CameraZone =
  | 'lobby'
  | 'reception'
  | 'corridor'
  | 'elevator'
  | 'parking'
  | 'restaurant'
  | 'pool'
  | 'room_door'
  | 'stairwell'
  | 'common';

export type CameraStatus = 'online' | 'offline' | 'recording';

export interface Camera {
  id: string;
  name: string;
  floor: string;
  zone: CameraZone;
  status: CameraStatus;
  hasLine: boolean;
  lineLabel?: string;
}

export type WatchlistType = 'employees' | 'guests' | 'blocked';

export interface Person {
  id: string;
  name: string;
  role: string;
  watchlist: WatchlistType;
  photoColor: string;
  initials: string;
}

export type EventType =
  | 'face_match'
  | 'face_unknown'
  | 'line_cross'
  | 'rule_trigger'
  | 'camera_offline'
  | 'camera_online'
  | 'motion';

export type AlertSeverity = 'info' | 'warning' | 'critical';

export interface SecurityEvent {
  id: string;
  type: EventType;
  severity: AlertSeverity;
  cameraId: string;
  cameraName: string;
  personId?: string;
  personName?: string;
  message: string;
  messageEn: string;
  timestamp: string;
  notified: boolean;
  channels: ('app' | 'whatsapp' | 'sms')[];
  acknowledged: boolean;
}

export interface DetectionOverlay {
  id: string;
  cameraId: string;
  kind: 'face' | 'line_flash';
  label: string;
  color: string;
  x: number;
  y: number;
  w: number;
  h: number;
  expiresAt: number;
}

export interface RuleCondition {
  eventType: EventType | 'any';
  watchlist?: WatchlistType | 'unknown' | 'any';
  zones?: CameraZone[];
  timeStart: string;
  timeEnd: string;
}

export interface SecurityRule {
  id: string;
  name: string;
  enabled: boolean;
  description: string;
  condition: RuleCondition;
  requireLineCross: boolean;
  severity: AlertSeverity;
  notifyWhatsApp: boolean;
  notifySms: boolean;
}

export type PageId =
  | 'dashboard'
  | 'operations'
  | 'live'
  | 'watchlists'
  | 'rules'
  | 'alerts'
  | 'search'
  | 'gdpr';

/** Matches the three operator roles described in the GDPR/AEPD access-control page. */
export type OperatorRole = 'admin' | 'security' | 'reception';

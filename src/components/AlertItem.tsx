import { format } from 'date-fns';
import { enUS, es } from 'date-fns/locale';
import type { SecurityEvent } from '../types';
import { useLanguage } from '../i18n/LanguageContext';

interface Props {
  event: SecurityEvent;
  onAck?: (id: string) => void;
  compact?: boolean;
}

export function AlertItem({ event, onAck, compact }: Props) {
  const { t, lang } = useLanguage();
  const locale = lang === 'es' ? es : enUS;
  const message = lang === 'en' ? event.messageEn : event.message;

  return (
    <div className={`alert-item ${event.severity} ${!event.acknowledged ? 'unacked' : ''}`}>
      <div className="alert-top">
        <span className={`severity ${event.severity}`}>{event.severity}</span>
        <span style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--mono)' }}>
          {format(new Date(event.timestamp), 'dd MMM HH:mm:ss', { locale })}
        </span>
      </div>
      <div className="alert-msg">{message}</div>
      {!compact && (
        <div className="alert-meta">
          <span>{event.cameraName}</span>
          {event.personName && <span>· {event.personName}</span>}
          <span className="channels">
            {event.channels.map((c) => (
              <span key={c} className="channel-tag">
                {c === 'whatsapp' ? 'WhatsApp' : c === 'sms' ? 'SMS' : 'App'}
              </span>
            ))}
          </span>
          {onAck && !event.acknowledged && (
            <button className="btn btn-sm" onClick={() => onAck(event.id)}>
              {t.alerts.acknowledge}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

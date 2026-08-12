import { useEffect, useRef, useState } from 'react';
import { EyeOff } from 'lucide-react';
import { useDemo } from '../store/DemoContext';
import { useLanguage } from '../i18n/LanguageContext';

interface ToastItem {
  id: string;
  title: string;
  body: string;
  severity: string;
}

const TOAST_MS = 3000;

export function ToastStack() {
  const { events } = useDemo();
  const { t, lang } = useLanguage();
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const timersRef = useRef<Record<string, number>>({});
  const seenRef = useRef<Set<string>>(new Set());

  const dismiss = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
    if (timersRef.current[id]) {
      window.clearTimeout(timersRef.current[id]);
      delete timersRef.current[id];
    }
  };

  useEffect(() => {
    const latest = events[0];
    if (!latest) return;
    if (latest.severity !== 'critical' && !latest.channels.includes('whatsapp')) return;
    if (Date.now() - new Date(latest.timestamp).getTime() > 4000) return;
    if (seenRef.current.has(latest.id)) return;

    seenRef.current.add(latest.id);

    const title =
      latest.channels.includes('whatsapp') || latest.channels.includes('sms')
        ? t.alerts.toastWhatsApp
        : t.alerts.toastCritical;
    const body = lang === 'en' ? latest.messageEn : latest.message;

    setToasts((prev) =>
      [{ id: latest.id, title, body, severity: latest.severity }, ...prev].slice(0, 3),
    );

    timersRef.current[latest.id] = window.setTimeout(() => {
      dismiss(latest.id);
    }, TOAST_MS);
  }, [events, lang, t.alerts.toastCritical, t.alerts.toastWhatsApp]);

  useEffect(() => {
    return () => {
      Object.values(timersRef.current).forEach((timer) => window.clearTimeout(timer));
    };
  }, []);

  if (!toasts.length) return null;

  return (
    <div className="toast-stack">
      {toasts.map((toast) => (
        <div key={toast.id} className={`toast ${toast.severity}`}>
          <div className="toast-top">
            <h4>{toast.title}</h4>
            <button
              type="button"
              className="toast-hide"
              onClick={() => dismiss(toast.id)}
              aria-label="Hide"
              title="Hide"
            >
              <EyeOff size={14} />
            </button>
          </div>
          <p>{toast.body}</p>
          <div className="toast-progress" />
        </div>
      ))}
    </div>
  );
}

import {
  Camera,
  ScanFace,
  GitBranch,
  BellRing,
  FileSearch,
  ShieldCheck,
  ArrowRight,
  Video,
  MapPin,
} from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { useDemo } from '../store/DemoContext';
import type { PageId } from '../types';

const IMAGES = {
  hero: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1600&q=80',
  lobby: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=900&q=80',
  camera: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=900&q=80',
  corridor: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=900&q=80',
  control: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=900&q=80',
  hotel: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=900&q=80',
  parking: 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=900&q=80',
};

interface Props {
  onNavigate: (page: PageId) => void;
}

export function Dashboard({ onNavigate }: Props) {
  const { t } = useLanguage();
  const { cameras, rules, setSelectedCameraId } = useDemo();
  const i = t.intro;
  const online = cameras.filter((c) => c.status !== 'offline').length;
  const activeRules = rules.filter((r) => r.enabled).length;

  const openLive = () => {
    setSelectedCameraId('cam-01');
    onNavigate('live');
  };

  const features = [
    { icon: ScanFace, title: i.feature1Title, body: i.feature1Body, tone: 'teal' },
    { icon: GitBranch, title: i.feature2Title, body: i.feature2Body, tone: 'blue' },
    { icon: BellRing, title: i.feature3Title, body: i.feature3Body, tone: 'amber' },
    { icon: Camera, title: i.feature4Title, body: i.feature4Body, tone: 'blue' },
    { icon: FileSearch, title: i.feature5Title, body: i.feature5Body, tone: 'teal' },
    { icon: ShieldCheck, title: i.feature6Title, body: i.feature6Body, tone: 'amber' },
  ];

  const gallery = [
    { src: IMAGES.lobby, label: i.imgLobby, wide: true },
    { src: IMAGES.camera, label: i.imgCamera, wide: false },
    { src: IMAGES.corridor, label: i.imgCorridor, wide: false },
    { src: IMAGES.control, label: i.imgControl, wide: false },
    { src: IMAGES.hotel, label: i.imgHotel, wide: true },
    { src: IMAGES.parking, label: i.imgParking, wide: false },
  ];

  return (
    <div className="intro-page">
      <section className="intro-hero" aria-label={i.heroAlt}>
        <img
          src={IMAGES.hero}
          alt=""
          className="intro-hero-img"
          loading="eager"
          draggable={false}
        />
        <div className="intro-hero-overlay" />
        <div className="intro-hero-content">
          <div className="intro-badges">
            <span className="intro-badge">
              <MapPin size={12} />
              {i.eyebrow}
            </span>
            <span className="intro-badge soft">Milestone + AI</span>
            <span className="intro-badge soft">Safire ONVIF</span>
          </div>
          <h1>{i.title}</h1>
          <p className="intro-sub">{i.subtitle}</p>
          <div className="intro-actions">
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => onNavigate('operations')}
            >
              {i.ctaOps}
              <ArrowRight size={16} />
            </button>
            <button type="button" className="btn intro-btn-ghost" onClick={openLive}>
              <Video size={16} />
              {i.ctaScenario}
            </button>
          </div>
        </div>
      </section>

      <section className="intro-kpi-row">
        <div className="intro-kpi-card">
          <strong>30</strong>
          <span>Safire E1</span>
        </div>
        <div className="intro-kpi-card">
          <strong>
            {online}/30
          </strong>
          <span>{t.online}</span>
        </div>
        <div className="intro-kpi-card">
          <strong>{activeRules}</strong>
          <span>{t.ops.activeRules}</span>
        </div>
        <div className="intro-kpi-card accent">
          <strong>VMS</strong>
          <span>Milestone + AI</span>
        </div>
      </section>

      <section className="intro-section">
        <div className="intro-section-head">
          <h2>{i.featuresTitle}</h2>
        </div>
        <div className="intro-features">
          {features.map((f) => {
            const Icon = f.icon;
            return (
              <article key={f.title} className={`intro-feature tone-${f.tone}`}>
                <div className="intro-feature-icon">
                  <Icon size={18} />
                </div>
                <h3>{f.title}</h3>
                <p>{f.body}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="intro-section">
        <div className="intro-section-head">
          <h2>{i.galleryTitle}</h2>
        </div>
        <div className="intro-gallery">
          {gallery.map((g) => (
            <figure
              key={g.src}
              className={`intro-gallery-item ${g.wide ? 'wide' : ''}`}
            >
              <img src={g.src} alt={g.label} loading="lazy" draggable={false} />
              <figcaption>{g.label}</figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className="intro-note">
        <ShieldCheck size={18} />
        <div>
          <h3>{i.noteTitle}</h3>
          <p>{i.noteBody}</p>
        </div>
      </section>
    </div>
  );
}

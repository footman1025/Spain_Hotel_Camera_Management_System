import {
  Camera,
  ScanFace,
  GitBranch,
  BellRing,
  FileSearch,
  ShieldCheck,
  ArrowRight,
  Video,
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
    { icon: ScanFace, title: i.feature1Title, body: i.feature1Body },
    { icon: GitBranch, title: i.feature2Title, body: i.feature2Body },
    { icon: BellRing, title: i.feature3Title, body: i.feature3Body },
    { icon: Camera, title: i.feature4Title, body: i.feature4Body },
    { icon: FileSearch, title: i.feature5Title, body: i.feature5Body },
    { icon: ShieldCheck, title: i.feature6Title, body: i.feature6Body },
  ];

  return (
    <div className="intro-page">
      <section className="intro-hero" aria-label={i.heroAlt}>
        <img src={IMAGES.hero} alt="" className="intro-hero-img" loading="eager" draggable={false} />
        <div className="intro-hero-overlay" />
        <div className="intro-hero-content">
          <p className="intro-eyebrow">{i.eyebrow}</p>
          <h1>{i.title}</h1>
          <p className="intro-sub">{i.subtitle}</p>
          <div className="intro-actions">
            <button type="button" className="btn btn-primary" onClick={() => onNavigate('operations')}>
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

      <section className="intro-status" aria-label="Project status">
        <div className="intro-status-item">
          <span className="intro-status-value">30</span>
          <span className="intro-status-label">Safire E1</span>
        </div>
        <div className="intro-status-item">
          <span className="intro-status-value">{online}/30</span>
          <span className="intro-status-label">{t.online}</span>
        </div>
        <div className="intro-status-item">
          <span className="intro-status-value">{activeRules}</span>
          <span className="intro-status-label">{t.ops.activeRules}</span>
        </div>
        <div className="intro-status-item">
          <span className="intro-status-value">Milestone</span>
          <span className="intro-status-label">+ AI analytics</span>
        </div>
      </section>

      <section className="intro-capabilities">
        <aside className="intro-capabilities-aside">
          <h2>{i.featuresTitle}</h2>
          <p>{i.overviewBody}</p>
          <button type="button" className="btn btn-primary" onClick={() => onNavigate('operations')}>
            {i.ctaOps}
            <ArrowRight size={15} />
          </button>
        </aside>
        <ol className="intro-capability-list">
          {features.map((f, index) => {
            const Icon = f.icon;
            return (
              <li key={f.title}>
                <span className="intro-cap-index">{String(index + 1).padStart(2, '0')}</span>
                <div className="intro-cap-icon">
                  <Icon size={16} />
                </div>
                <div className="intro-cap-copy">
                  <h3>{f.title}</h3>
                  <p>{f.body}</p>
                </div>
              </li>
            );
          })}
        </ol>
      </section>

      <section className="intro-visual">
        <div className="intro-visual-head">
          <h2>{i.galleryTitle}</h2>
          <p>{i.badgeHotel ?? i.eyebrow}</p>
        </div>
        <div className="intro-visual-layout">
          <figure className="intro-visual-main">
            <img src={IMAGES.lobby} alt={i.imgLobby} loading="lazy" draggable={false} />
            <figcaption>{i.imgLobby}</figcaption>
          </figure>
          <div className="intro-visual-side">
            <figure>
              <img src={IMAGES.camera} alt={i.imgCamera} loading="lazy" draggable={false} />
              <figcaption>{i.imgCamera}</figcaption>
            </figure>
            <figure>
              <img src={IMAGES.corridor} alt={i.imgCorridor} loading="lazy" draggable={false} />
              <figcaption>{i.imgCorridor}</figcaption>
            </figure>
          </div>
          <div className="intro-visual-row">
            <figure>
              <img src={IMAGES.control} alt={i.imgControl} loading="lazy" draggable={false} />
              <figcaption>{i.imgControl}</figcaption>
            </figure>
            <figure>
              <img src={IMAGES.hotel} alt={i.imgHotel} loading="lazy" draggable={false} />
              <figcaption>{i.imgHotel}</figcaption>
            </figure>
            <figure>
              <img src={IMAGES.parking} alt={i.imgParking} loading="lazy" draggable={false} />
              <figcaption>{i.imgParking}</figcaption>
            </figure>
          </div>
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

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
  lobby: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=1200&q=80',
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

  const primaryFeatures = [
    { num: '01', icon: ScanFace, title: i.feature1Title, body: i.feature1Body },
    { num: '02', icon: GitBranch, title: i.feature2Title, body: i.feature2Body },
    { num: '03', icon: BellRing, title: i.feature3Title, body: i.feature3Body },
  ];

  const secondaryFeatures = [
    { num: '04', icon: Camera, title: i.feature4Title, body: i.feature4Body },
    { num: '05', icon: FileSearch, title: i.feature5Title, body: i.feature5Body },
    { num: '06', icon: ShieldCheck, title: i.feature6Title, body: i.feature6Body },
  ];

  const phases = [i.phase1, i.phase2, i.phase3, i.phase4, i.phase5];

  const galleryMain = { src: IMAGES.lobby, label: i.imgLobby };
  const gallerySide = [
    { src: IMAGES.camera, label: i.imgCamera },
    { src: IMAGES.corridor, label: i.imgCorridor },
    { src: IMAGES.control, label: i.imgControl },
    { src: IMAGES.hotel, label: i.imgHotel },
    { src: IMAGES.parking, label: i.imgParking },
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

      <section className="intro-split">
        <article className="intro-block">
          <h2>{i.overviewTitle}</h2>
          <p>{i.overviewBody}</p>
        </article>
        <article className="intro-block">
          <h2>{i.phasesTitle}</h2>
          <ol className="intro-steps">
            {phases.map((phase, index) => (
              <li key={phase}>
                <span>{String(index + 1).padStart(2, '0')}</span>
                {phase}
              </li>
            ))}
          </ol>
        </article>
      </section>

      <section className="intro-section">
        <div className="intro-section-head row">
          <div>
            <h2>{i.featuresTitle}</h2>
            <p>{i.subtitle}</p>
          </div>
        </div>

        <div className="intro-feature-primary">
          {primaryFeatures.map((f) => {
            const Icon = f.icon;
            return (
              <article key={f.title} className="intro-feature-lg">
                <div className="intro-feature-lg-top">
                  <span className="intro-num">{f.num}</span>
                  <Icon size={18} />
                </div>
                <h3>{f.title}</h3>
                <p>{f.body}</p>
              </article>
            );
          })}
        </div>

        <div className="intro-feature-secondary">
          {secondaryFeatures.map((f) => {
            const Icon = f.icon;
            return (
              <article key={f.title} className="intro-feature-sm">
                <span className="intro-num">{f.num}</span>
                <div>
                  <h3>
                    <Icon size={15} />
                    {f.title}
                  </h3>
                  <p>{f.body}</p>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="intro-section">
        <div className="intro-section-head row">
          <div>
            <h2>{i.galleryTitle}</h2>
            <p>{i.eyebrow}</p>
          </div>
        </div>

        <div className="intro-mosaic">
          <figure className="intro-mosaic-main">
            <img src={galleryMain.src} alt={galleryMain.label} loading="lazy" draggable={false} />
            <figcaption>{galleryMain.label}</figcaption>
          </figure>
          <div className="intro-mosaic-side">
            {gallerySide.map((g) => (
              <figure key={g.src}>
                <img src={g.src} alt={g.label} loading="lazy" draggable={false} />
                <figcaption>{g.label}</figcaption>
              </figure>
            ))}
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

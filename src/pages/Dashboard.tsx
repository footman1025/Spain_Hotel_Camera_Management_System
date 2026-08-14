import {
  Camera,
  ScanFace,
  GitBranch,
  BellRing,
  FileSearch,
  ShieldCheck,
  ArrowRight,
  Video,
  Server,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';
import { useDemo } from '../store/DemoContext';

const IMAGES = {
  hero: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1800&q=80',
  lobby: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=1000&q=80',
  camera: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=1000&q=80',
  corridor: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1000&q=80',
  controlRoom: 'https://www.tecservuk.com/wp-content/uploads/2021/05/8705128684_ddf7589b7a_o-768x512-1-1600x0-c-default.jpg',
};

export function Dashboard() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { cameras, rules, setSelectedCameraId } = useDemo();
  const i = t.intro;
  const online = cameras.filter((c) => c.status !== 'offline').length;
  const activeRules = rules.filter((r) => r.enabled).length;

  const openLive = () => {
    setSelectedCameraId('cam-01');
    navigate('/live');
  };

  const features = [
    { icon: ScanFace, title: i.feature1Title, body: i.feature1Body },
    { icon: GitBranch, title: i.feature2Title, body: i.feature2Body },
    { icon: BellRing, title: i.feature3Title, body: i.feature3Body },
    { icon: Camera, title: i.feature4Title, body: i.feature4Body },
    { icon: FileSearch, title: i.feature5Title, body: i.feature5Body },
    { icon: ShieldCheck, title: i.feature6Title, body: i.feature6Body },
  ];

  const stack = [i.stack1, i.stack2, i.stack3, i.stack4, i.stack5, i.stack6];

  const gallery = [
    { src: IMAGES.lobby, label: i.imgLobby },
    { src: IMAGES.camera, label: i.imgCamera },
    { src: IMAGES.corridor, label: i.imgCorridor },
    { src: IMAGES.controlRoom, label: i.imgControlRoom },
  ];

  const stats = [
    { value: '30', label: 'Safire E1' },
    { value: `${online}/30`, label: t.online },
    { value: String(activeRules), label: t.ops.activeRules },
    { value: 'VMS', label: 'Milestone + AI' },
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
          <div className="intro-hero-copy">
            <p className="intro-kicker">{i.eyebrow}</p>
            <h1>{i.title}</h1>
            <p className="intro-sub">{i.subtitle}</p>
            <div className="intro-actions">
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => navigate('/operations')}
              >
                {i.ctaOps}
                <ArrowRight size={16} />
              </button>
              <button type="button" className="btn" onClick={openLive}>
                <Video size={16} />
                {i.ctaScenario}
              </button>
            </div>
          </div>

          <ul className="intro-stat-row" aria-label="System status">
            {stats.map((s) => (
              <li key={s.label} className="intro-stat">
                <strong>{s.value}</strong>
                <span>{s.label}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="intro-stack" aria-label={i.stackTitle}>
        <div className="intro-stack-label">
          <Server size={15} />
          <span>{i.stackTitle}</span>
        </div>
        <ul className="intro-stack-list">
          {stack.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section className="intro-section">
        <div className="intro-section-head">
          <h2>{i.featuresTitle}</h2>
        </div>
        <div className="intro-features">
          {features.map((f) => {
            const Icon = f.icon;
            return (
              <article key={f.title} className="intro-feature">
                <div className="intro-feature-icon" aria-hidden>
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
            <figure key={g.src} className="intro-gallery-item">
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

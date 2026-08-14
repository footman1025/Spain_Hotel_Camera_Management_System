import {
  ShieldCheck,
  Clock3,
  EyeOff,
  UsersRound,
  ScanFace,
  FileCheck2,
  CheckCircle2,
  BadgeCheck,
} from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

export function GdprPage() {
  const { t } = useLanguage();
  const g = t.gdpr;

  const pillars = [
    {
      icon: Clock3,
      title: g.retentionTitle,
      items: [g.retention1, g.retention2, g.retention3],
    },
    {
      icon: EyeOff,
      title: g.maskTitle,
      items: [g.mask1, g.mask2, g.mask3],
    },
    {
      icon: ScanFace,
      title: g.facialTitle,
      items: [g.facial1, g.facial2, g.facial3, g.facial4],
    },
  ];

  const roles = [
    { name: g.roleAdmin, desc: g.roleAdminDesc },
    { name: g.roleSecurity, desc: g.roleSecurityDesc },
    { name: g.roleReception, desc: g.roleReceptionDesc },
  ];

  const docs = [g.docs1, g.docs2, g.docs3, g.docs4, g.docs5];

  return (
    <div className="gdpr-page">
      <section className="gdpr-hero">
        <div className="gdpr-hero-copy">
          <div className="gdpr-badges">
            <span className="gdpr-badge">{g.badgeSpain}</span>
            <span className="gdpr-badge">{g.badgePrivacy}</span>
          </div>
          <h1>{g.title}</h1>
          <p>{g.subtitle}</p>
          <div className="gdpr-status">
            <ShieldCheck size={15} />
            {g.statusOk}
          </div>
        </div>
        <div className="gdpr-metrics">
          <div className="gdpr-metric">
            <span className="gdpr-metric-value">
              30 <small>{g.metricDays}</small>
            </span>
            <span className="gdpr-metric-label">{g.metricRetention}</span>
          </div>
          <div className="gdpr-metric">
            <span className="gdpr-metric-value">
              90 <small>{g.metricDays}</small>
            </span>
            <span className="gdpr-metric-label">{g.metricCritical}</span>
          </div>
          <div className="gdpr-metric">
            <span className="gdpr-metric-value">3</span>
            <span className="gdpr-metric-label">{g.metricRoles}</span>
          </div>
        </div>
      </section>

      <section className="gdpr-pillars">
        {pillars.map((pillar) => {
          const Icon = pillar.icon;
          return (
            <article key={pillar.title} className="gdpr-pillar">
              <div className="gdpr-pillar-head">
                <div className="gdpr-pillar-icon">
                  <Icon size={16} />
                </div>
                <h2>{pillar.title}</h2>
              </div>
              <ul className="gdpr-check-list">
                {pillar.items.map((item) => (
                  <li key={item}>
                    <CheckCircle2 size={14} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </article>
          );
        })}
      </section>

      <section className="gdpr-access panel">
        <div className="gdpr-section-head">
          <div className="gdpr-pillar-icon">
            <UsersRound size={16} />
          </div>
          <div>
            <h2>{g.accessTitle}</h2>
            <p>{g.accessIntro}</p>
          </div>
        </div>
        <div className="gdpr-roles">
          {roles.map((role) => (
            <div key={role.name} className="gdpr-role">
              <div className="gdpr-role-top">
                <strong>{role.name}</strong>
                <BadgeCheck size={15} color="var(--accent)" />
              </div>
              <p>{role.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="gdpr-docs panel">
        <div className="gdpr-section-head">
          <div className="gdpr-pillar-icon">
            <FileCheck2 size={16} />
          </div>
          <div>
            <h2>{g.docsTitle}</h2>
            <p>{g.docsSubtitle}</p>
          </div>
        </div>
        <div className="gdpr-docs-grid">
          {docs.map((doc, index) => (
            <div key={doc} className="gdpr-doc-item">
              <span className="gdpr-doc-num">{String(index + 1).padStart(2, '0')}</span>
              <span>{doc}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

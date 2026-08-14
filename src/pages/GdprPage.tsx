import { useLanguage } from '../i18n/LanguageContext';
import { useDemo } from '../store/DemoContext';
import type { CameraZone } from '../types';

export function GdprPage() {
  const { t } = useLanguage();
  const { retentionDays, setRetentionDays, maskedZones, toggleZoneMask } = useDemo();
  const g = t.gdpr;
  const zoneList = Object.keys(t.zones) as CameraZone[];

  const pillars = [
    {
      title: g.retentionTitle,
      items: [g.retention1, g.retention2, g.retention3],
    },
    {
      title: g.maskTitle,
      items: [g.mask1, g.mask2, g.mask3],
    },
    {
      title: g.facialTitle,
      items: [g.facial1, g.facial2, g.facial3, g.facial4],
    },
    {
      title: g.accessTitle,
      items: [g.roleAdmin, g.roleSecurity, g.roleReception],
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
      <div className="page-header">
        <div>
          <h1>{g.title}</h1>
          <p>{g.subtitle}</p>
        </div>
      </div>

      <section className="panel">
        <div className="panel-header">
          <h2>{g.simTitle}</h2>
        </div>
        <div className="panel-body">
          <p style={{ margin: '0 0 14px', color: 'var(--muted)', fontSize: 13 }}>{g.simHint}</p>

          <div style={{ marginBottom: 16 }}>
            <strong style={{ fontSize: 13 }}>
              {g.simRetentionLabel}: {retentionDays} {g.metricDays}
            </strong>
            <div className="filters" style={{ marginTop: 8 }}>
              {([30, 60, 90] as const).map((days) => (
                <button
                  key={days}
                  type="button"
                  className={`btn btn-sm ${retentionDays === days ? 'btn-primary' : ''}`}
                  onClick={() => setRetentionDays(days)}
                >
                  {days} {g.metricDays}
                </button>
              ))}
            </div>
          </div>

          <div>
            <strong style={{ fontSize: 13 }}>{g.simMaskLabel}</strong>
            <p style={{ margin: '4px 0 8px', color: 'var(--muted)', fontSize: 12 }}>
              {g.simMaskHint}
            </p>
            <div className="filters">
              {zoneList.map((zone) => {
                const active = maskedZones.includes(zone);
                return (
                  <button
                    key={zone}
                    type="button"
                    className={`btn btn-sm ${active ? 'btn-primary' : ''}`}
                    onClick={() => toggleZoneMask(zone)}
                    title={active ? g.simMaskOn : g.simMaskOff}
                  >
                    {t.zones[zone]}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="gdpr-grid">
        {pillars.map((pillar) => (
          <article key={pillar.title} className="panel gdpr-card">
            <h3>{pillar.title}</h3>
            <ul>
              {pillar.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
        ))}
      </section>

      <section className="panel">
        <div className="panel-header">
          <h2>{g.accessTitle}</h2>
        </div>
        <div className="panel-body">
          <p style={{ margin: '0 0 12px', color: 'var(--muted)', fontSize: 13 }}>
            {g.accessIntro}
          </p>
          <div className="gdpr-roles">
            {roles.map((role) => (
              <div key={role.name} className="gdpr-role">
                <strong>{role.name}</strong>
                <p>{role.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="panel">
        <div className="panel-header">
          <h2>{g.docsTitle}</h2>
        </div>
        <div className="panel-body">
          <p style={{ margin: '0 0 12px', color: 'var(--muted)', fontSize: 13 }}>
            {g.docsSubtitle}
          </p>
          <ol className="gdpr-docs-list">
            {docs.map((doc) => (
              <li key={doc}>{doc}</li>
            ))}
          </ol>
        </div>
      </section>
    </div>
  );
}

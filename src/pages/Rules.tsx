import { useDemo } from '../store/DemoContext';
import { useLanguage } from '../i18n/LanguageContext';

const RULE_KEYS = {
  'rule-01': { name: 'rule01Name', desc: 'rule01Desc' },
  'rule-02': { name: 'rule02Name', desc: 'rule02Desc' },
  'rule-03': { name: 'rule03Name', desc: 'rule03Desc' },
  'rule-04': { name: 'rule04Name', desc: 'rule04Desc' },
  'rule-05': { name: 'rule05Name', desc: 'rule05Desc' },
} as const;

export function Rules() {
  const { t } = useLanguage();
  const { rules, toggleRule } = useDemo();
  const r = t.rules;

  return (
    <>
      <div className="page-header">
        <div>
          <h1>{r.title}</h1>
          <p>{r.subtitle}</p>
        </div>
      </div>

      {rules.map((rule) => {
        const keys = RULE_KEYS[rule.id as keyof typeof RULE_KEYS];
        const name = keys ? r[keys.name] : rule.name;
        const description = keys ? r[keys.desc] : rule.description;
        return (
          <div key={rule.id} className={`rule-card ${rule.enabled ? '' : 'disabled'}`}>
            <div>
              <h3>{name}</h3>
              <p>{description}</p>
              <div className="alert-meta" style={{ marginTop: 10 }}>
                <span className={`severity ${rule.severity}`}>{rule.severity}</span>
                <span>
                  {rule.condition.timeStart} – {rule.condition.timeEnd}
                </span>
                {rule.requireLineCross && <span className="channel-tag">{r.requireLine}</span>}
                {rule.notifyWhatsApp && <span className="channel-tag">WhatsApp</span>}
                {rule.notifySms && <span className="channel-tag">SMS</span>}
              </div>
            </div>
            <button
              className={`toggle ${rule.enabled ? 'on' : ''}`}
              onClick={() => toggleRule(rule.id)}
              aria-label={r.enable}
              title={rule.enabled ? r.disable : r.activate}
            />
          </div>
        );
      })}

      <div className="panel" style={{ marginTop: 8 }}>
        <div className="panel-body">
          <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: 13 }}>{r.note}</p>
        </div>
      </div>
    </>
  );
}

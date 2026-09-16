const DEFAULT_BARS = [90, 65, 45, 75, 30];

export default function AuthIntroPanel({ eyebrow = "Resume Builder", headline, sub, bars = DEFAULT_BARS }) {
  return (
    <div className="auth-intro">
      <div className="auth-intro__brand">{eyebrow}</div>

      <div className="auth-intro__body">
        <h1 className="auth-intro__headline">{headline}</h1>
        <p className="auth-intro__sub">{sub}</p>
      </div>

      <div className="auth-card" aria-hidden="true">
        <div className="auth-card__line" style={{ width: "55%" }} />
        <div className="auth-card__line" style={{ width: "35%", marginBottom: 20 }} />
        {bars.map((pct, i) => (
          <div className="auth-card__row" key={i}>
            <div className="auth-card__label" />
            <div className="auth-card__bar-track">
              <div className="auth-card__bar-fill" style={{ width: `${pct}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

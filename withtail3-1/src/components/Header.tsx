import "./Header.css";

export default function Header() {
  return (
    <header className="wt-header">
      <div className="wt-header-left">
        <button className="wt-icon-btn" type="button" aria-label="menu">
          ☰
        </button>

        <div className="wt-brand">
          <div className="wt-logo" aria-hidden="true" />
          <span className="wt-brand-text">With Tail</span>
        </div>
      </div>

      <button className="wt-logout-btn" type="button">
        로그아웃
      </button>
    </header>
  );
}

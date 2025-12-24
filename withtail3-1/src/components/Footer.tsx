import "./Footer.css";

export default function Footer() {
  return (
    <footer className="wt-footer">
      <div className="wt-footer-inner">
        <div className="wt-footer-title">With Tail</div>
        <div className="wt-footer-text">
          © {new Date().getFullYear()} With Tail. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

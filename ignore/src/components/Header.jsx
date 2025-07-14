import { Link } from "react-router-dom";
import "./HeaderFooter.css";

export default function Header() {
  return (
    <header className="header">
      <div className="header-content">
        <span className="logo">Safety Alert</span>
        <nav className="main-nav">
          <Link to="/">Dashboard</Link>
          <Link to="/contacts">Contacts</Link>
          <Link to="/danger-zones">Danger Zones</Link>
          <Link to="/alerts">Alerts</Link>
          <Link to="/settings">Settings</Link>
        </nav>
        <div className="auth-buttons">
          <Link to="/login" className="btn btn-outline">Login</Link>
          <Link to="/register" className="btn btn-primary">Sign Up</Link>
        </div>
      </div>
    </header>
  );
} 
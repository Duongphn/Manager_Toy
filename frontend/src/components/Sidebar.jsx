import { NavLink, useNavigate } from "react-router-dom";
import {
  House,
  Package,
  Search,
  HandHelping,
  CirclePlus,
  LogOut,
  ToyBrick,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: House },
  { to: "/my-toys", label: "My Toys", icon: Package },
  { to: "/browse", label: "Browse Toys", icon: Search },
  { to: "/borrows", label: "Borrowed", icon: HandHelping },
  { to: "/toys/add", label: "Add Toy", icon: CirclePlus },
];

export default function Sidebar() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <ToyBrick size={28} color="#FF6B6B" />
        <span>ToyShare</span>
      </div>
      <nav className="sidebar-nav">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `sidebar-item ${isActive ? "active" : ""}`
            }
          >
            <Icon size={20} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
      <div className="sidebar-footer">
        <button
          type="button"
          className="sidebar-logout"
          onClick={handleLogout}
          aria-label="Log out"
        >
          <LogOut size={18} />
          <span>Log Out</span>
        </button>
      </div>
    </aside>
  );
}

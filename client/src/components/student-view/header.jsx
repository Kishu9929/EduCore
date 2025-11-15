import { useState } from "react";
import { useLocation, Link, NavLink, useNavigate } from "react-router-dom";
import { BookOpen } from "lucide-react";
import { Button } from "../ui/button";
import { useContext } from "react";
import { AuthContext } from "@/context/auth-context";

export default function StudentViewCommonHeader() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { resetCredentials } = useContext(AuthContext);

  function handleLogout() {
    resetCredentials();
    sessionStorage.clear();
    navigate("/auth");
  }

  const navItems = [
    { label: "Explore Courses", href: "/courses" },
    { label: "My Courses", href: "/student-courses" },
  ];

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 md:px-6 py-4">
        {/* Logo */}
        <Link to="/home" className="flex items-center gap-2 text-2xl font-bold text-gray-900 hover:text-indigo-600 transition">
          <BookOpen className="h-8 w-8 mr-2" />
          EduCore
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item, i) => (
            <NavLink
              key={i}
              to={item.href}
              className={({ isActive }) =>
                `text-sm font-medium px-1 mx-2 hover:text-indigo-500 transition ${
                  isActive ? 'border-b-2 border-indigo-500 text-indigo-600' : 'text-gray-700'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
          <Button
            className="bg-indigo-600 text-white px-4 py-2 rounded-md font-medium hover:bg-indigo-700 transition"
            onClick={handleLogout}
          >
            Sign Out
          </Button>
        </nav>

        {/* Hamburger Icon */}
        <div className="md:hidden">
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="flex flex-col items-start px-4 py-2 bg-white md:hidden">
          {navItems.map((item, i) => (
            <NavLink
              key={i}
              to={item.href}
              className={({ isActive }) =>
                `block text-sm font-medium py-1 hover:text-indigo-500 transition ${
                  isActive ? 'text-indigo-600 border-l-4 border-indigo-500 pl-2' : 'text-gray-700'
                }`
              }
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {item.label}
            </NavLink>
          ))}
          <Button
            className="w-full mt-2 bg-indigo-600 text-white px-4 py-2 rounded-md font-medium hover:bg-indigo-700 transition"
            onClick={() => {
              setIsMobileMenuOpen(false);
              handleLogout();
            }}
          >
            Sign Out
          </Button>
        </div>
      )}
    </header>
  );
}

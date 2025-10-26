import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FilmIcon, BookmarkIcon, ArrowRightEndOnRectangleIcon, Bars3Icon } from "@heroicons/react/24/solid";
import { useAuth } from "@/context/AuthContext";
import MobileMenu from "./MobileMenu";

export default function Header() {
  const { user, isAuthenticated, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
    setMenuOpen(false);
  };

  return (
    <header className="bg-[#0a0a0a] border-b border-gray-800 shadow-[0_2px_10px_rgba(0,0,0,0.6)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link
            to="/"
            className="flex items-center space-x-3 text-gray-100 hover:text-blue-500 transition-colors"
            onClick={() => setMenuOpen(false)}
          >
            <FilmIcon className="w-8 h-8 text-blue-500" />
            <h1 className="text-xl font-semibold tracking-wide">TMDB Movies</h1>
          </Link>

          <nav className="hidden md:flex items-center space-x-4">
            <Link
              to="/"
              className="text-gray-300 hover:text-blue-500 px-3 py-2 rounded-md text-sm font-medium"
            >
              Home
            </Link>

            {isAuthenticated ? (
              <>
                <Link
                  to="/watchlist"
                  className="flex items-center space-x-2 text-gray-300 hover:text-blue-500 px-3 py-2 rounded-md text-sm font-medium"
                >
                  <BookmarkIcon className="w-5 h-5" />
                  <span>Watchlist</span>
                </Link>

                <div className="flex items-center space-x-3 border-l border-gray-700 pl-4 ml-2">
                  <span className="text-gray-400 text-sm hidden lg:block">
                    {user?.email}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 text-gray-300 hover:text-blue-500 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    <ArrowRightEndOnRectangleIcon className="w-5 h-5" />
                    <span>Logout</span>
                  </button>
                </div>
              </>
            ) : (
              <Link
                to="/auth"
                className="text-gray-300 hover:text-blue-500 px-3 py-2 rounded-md text-sm font-medium"
              >
                Sign in
              </Link>
            )}
          </nav>
          <button
            onClick={() => setMenuOpen(true)}
            className="md:hidden p-2 rounded-md hover:bg-gray-800 transition-colors"
          >
            <Bars3Icon className="w-6 h-6 text-gray-300" />
          </button>
        </div>
      </div>

      <MobileMenu
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        onLogout={handleLogout}
        isAuthenticated={isAuthenticated}
      />
    </header>
  );
}

import {
  BookmarkIcon,
  ArrowRightEndOnRectangleIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid";
import { Link } from "react-router-dom";

type Props = {
  open: boolean;
  onClose: () => void;
  onLogout: () => void;
  isAuthenticated: boolean;
};

export default function MobileMenu({ open, onClose, onLogout, isAuthenticated }: Props) {
  return (
    <>
      {open && (
        <>
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40"
            onClick={onClose}
          ></div>

          <div
            className={`fixed top-0 right-0 w-64 h-full bg-[#111] border-l border-gray-800 z-50 p-6 flex flex-col space-y-6 shadow-lg transform transition-transform duration-300 ${
              open ? "translate-x-0" : "translate-x-full"
            }`}
          >
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-100">Menu</h2>
              <button onClick={onClose}>
                <XMarkIcon className="w-6 h-6 text-gray-400 hover:text-white transition-colors" />
              </button>
            </div>

            <nav className="flex flex-col space-y-4">
              <Link
                to="/"
                onClick={onClose}
                className="text-gray-300 hover:text-blue-500 text-sm font-medium"
              >
                Home
              </Link>

              {isAuthenticated ? (
                <>
                  <Link
                    to="/watchlist"
                    onClick={onClose}
                    className="flex items-center space-x-2 text-gray-300 hover:text-blue-500 text-sm font-medium"
                  >
                    <BookmarkIcon className="w-5 h-5" />
                    <span>Watchlist</span>
                  </Link>

                  <button
                    onClick={onLogout}
                    className="flex items-center space-x-2 text-gray-300 hover:text-blue-500 text-sm font-medium"
                  >
                    <ArrowRightEndOnRectangleIcon className="w-5 h-5" />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <Link
                  to="/auth"
                  onClick={onClose}
                  className="text-gray-300 hover:text-blue-500 text-sm font-medium"
                >
                  Login
                </Link>
              )}
            </nav>
          </div>
        </>
      )}
    </>
  );
}

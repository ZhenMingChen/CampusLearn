import { Link, useLocation, useNavigate } from "react-router-dom";
import { getUser, clearSession } from "../api/client.js";

export default function Navbar(){
  const { pathname } = useLocation();
  const nav = useNavigate();
  const user = getUser();

  const isActive = (to) => pathname === to || pathname.startsWith(to + "/") || pathname === to;

  const link = (to, label) => {
    const active = isActive(to);
    return (
      <Link
        to={to}
        aria-current={active ? "page" : undefined}
        className={`px-3 py-1.5 rounded-xl text-sm
          focus:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2
          ${active ? "bg-black text-white" : "text-gray-700 hover:bg-gray-100"}`}
      >
        {label}
      </Link>
    );
  };

  const onLogout = () => { clearSession(); nav("/login"); };

  return (
    <nav aria-label="Primary" className="bg-white/80 backdrop-blur border-b sticky top-0 z-40">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center gap-2">
        <Link
          to={user ? "/topics" : "/login"}
          aria-label="CampusLearn home"
          className="font-bold focus:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 rounded-md"
        >
          CampusLearn
        </Link>

        {user && (
          <div className="ml-2 flex gap-1">
            {link("/topics","Topics")}
            {link("/uploads","Uploads")}
          </div>
        )}

        <div className="ml-auto flex items-center gap-3">
          {user ? (
            <>
              <span className="text-xs text-gray-600">
                Logged in as <span className="font-medium">{user?.name || user?.email}</span>{" "}
                <span className="uppercase text-gray-500">({user?.role})</span>
              </span>
              <button
                type="button"
                onClick={onLogout}
                className="text-sm text-red-600 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 rounded-md"
                aria-label="Log out"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="text-sm text-gray-700 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 rounded-md"
            >
              Sign in
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}





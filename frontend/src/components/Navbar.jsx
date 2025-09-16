import { Link, useLocation, useNavigate } from "react-router-dom";
import { getUser, clearSession } from "../api/client.js";

export default function Navbar(){
  const { pathname } = useLocation();
  const nav = useNavigate();
  const user = getUser();

  const link = (to, label) => (
    <Link
      to={to}
      className={`px-3 py-1.5 rounded-xl text-sm ${
        pathname.startsWith(to) ? "bg-black text-white" : "text-gray-700 hover:bg-gray-100"
      }`}
    >
      {label}
    </Link>
  );

  const onLogout = () => { clearSession(); nav("/login"); };

  return (
    <nav className="bg-white/80 backdrop-blur border-b sticky top-0 z-40">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center gap-2">
        <Link to={user ? "/topics" : "/login"} className="font-bold">CampusLearn</Link>

        {/* Only show protected links when logged in */}
        {user && (
          <div className="ml-2 flex gap-1">
            {link("/topics","Topics")}
            {user.role === 'STUDENT' && link("/upload","Uploads")}
          </div>
        )}

        <div className="ml-auto flex items-center gap-3">
          {user ? (
            <>
              <span className="text-xs text-gray-600">
                Logged in as <span className="font-medium">{user.name || user.email}</span>{" "}
                <span className="uppercase text-gray-500">({user.role})</span>
              </span>
              <button onClick={onLogout} className="text-sm text-red-600 hover:underline" aria-label="Log out">
                Logout
              </button>
            </>
          ) : (
            <Link to="/login" className="text-sm text-gray-700 hover:underline">Sign in</Link>
          )}
        </div>
      </div>
    </nav>
  );
}



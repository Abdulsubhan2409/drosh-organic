import { useEffect, useState, useRef } from "react";
import { NavLink, Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  MessageSquare,
  Users,
  Settings,
  Menu,
  X,
  ExternalLink,
  Search,
  Bell,
  LogOut,
  Clock,
} from "lucide-react";
import { api, getToken, setToken, clearToken, getTokenExpiry } from "@/lib/api";

const links = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/admin/products", label: "Products", icon: Package },
  { to: "/admin/orders", label: "Orders", icon: ShoppingBag },
  { to: "/admin/messages", label: "Messages", icon: MessageSquare },
  { to: "/admin/customers", label: "Customers", icon: Users },
  { to: "/admin/settings", label: "Settings", icon: Settings },
];

export default function AdminLayout() {
  const [open, setOpen] = useState(false);
  const [admin, setAdmin] = useState(null);
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [counts, setCounts] = useState({ unreadMessages: 0, pendingOrders: 0 });
  const [bellOpen, setBellOpen] = useState(false);
  const bellRef = useRef(null);
  const [secondsLeft, setSecondsLeft] = useState(null);

  // Login lock: no token or bad token means back to the login page
  useEffect(() => {
    if (!getToken()) {
      navigate("/admin/login", { replace: true });
      return;
    }
    api("/api/auth/me")
      .then(setAdmin)
      .catch(() => {
        clearToken();
        navigate("/admin/login", { replace: true });
      });
  }, [navigate]);

  // Check for new messages and orders every 15 seconds and on every page change
  useEffect(() => {
    if (!admin) return;
    const load = () =>
      api("/api/admin/stats")
        .then((s) =>
          setCounts({ unreadMessages: s.unreadMessages, pendingOrders: s.pendingOrders })
        )
        .catch(() => {});
    load();
    const t = setInterval(load, 15000);
    return () => clearInterval(t);
  }, [admin, pathname]);

  // Close the bell list when clicking anywhere else
  useEffect(() => {
    const close = (e) => {
      if (bellRef.current && !bellRef.current.contains(e.target)) setBellOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  // Session countdown: logs out automatically when time runs out
  useEffect(() => {
    if (!admin) return;
    const tick = () => {
      const left = Math.floor((getTokenExpiry() - Date.now()) / 1000);
      if (left <= 0) {
        clearToken();
        navigate("/admin/login", { replace: true });
        return;
      }
      setSecondsLeft(left);
    };
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, [admin, navigate]);

  const extendSession = async () => {
    try {
      const { token } = await api("/api/auth/refresh", { method: "POST" });
      setToken(token);
    } catch {
      /* the countdown will log you out if this fails */
    }
  };

  const mmss =
    secondsLeft === null
      ? ""
      : `${String(Math.floor(secondsLeft / 60)).padStart(2, "0")}:${String(
          secondsLeft % 60
        ).padStart(2, "0")}`;

  const logout = () => {
    clearToken();
    navigate("/admin/login", { replace: true });
  };

  const totalAlerts = counts.unreadMessages + counts.pendingOrders;

  if (!admin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-100 text-stone-500">
        Checking access...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-100 text-stone-900 font-sans">
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-stone-950 text-stone-300 flex flex-col transition-transform lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="h-16 px-6 flex items-center justify-between border-b border-stone-800">
          <div>
            <p className="text-lg font-semibold text-white tracking-wide">Drosh</p>
            <p className="text-[10px] uppercase tracking-[0.25em] text-amber-500">
              Admin Panel
            </p>
          </div>
          <button className="lg:hidden" onClick={() => setOpen(false)}>
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {links.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                  isActive
                    ? "bg-amber-500 text-stone-950 font-medium"
                    : "hover:bg-stone-800 hover:text-white"
                }`
              }
            >
              <Icon className="h-4 w-4" />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-stone-800 space-y-3">
          <Link
            to="/"
            className="flex items-center gap-2 text-sm text-stone-400 hover:text-white"
          >
            <ExternalLink className="h-4 w-4" />
            View live website
          </Link>
          <button
            onClick={logout}
            className="flex items-center gap-2 text-sm text-red-400 hover:text-red-300"
          >
            <LogOut className="h-4 w-4" />
            Log out
          </button>
        </div>
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 h-16 bg-white/80 backdrop-blur border-b border-stone-200 px-4 md:px-8 flex items-center justify-between gap-4">
          <button className="lg:hidden" onClick={() => setOpen(true)}>
            <Menu className="h-6 w-6" />
          </button>

          <div className="hidden md:flex items-center gap-2 bg-stone-100 rounded-lg px-3 py-2 w-72">
            <Search className="h-4 w-4 text-stone-400" />
            <input
              placeholder="Search..."
              className="bg-transparent text-sm w-full focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-4 ml-auto">
            {secondsLeft !== null && (
              <div
                className={`hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs border ${
                  secondsLeft < 300
                    ? "bg-red-50 border-red-200 text-red-700"
                    : "bg-stone-50 border-stone-200 text-stone-600"
                }`}
              >
                <Clock className="h-3.5 w-3.5" />
                <span>Session: {mmss}</span>
                <button
                  onClick={extendSession}
                  className="font-medium underline hover:no-underline"
                >
                  Extend
                </button>
              </div>
            )}

            <div className="relative" ref={bellRef}>
              <button onClick={() => setBellOpen((o) => !o)} className="relative">
                <Bell className="h-5 w-5 text-stone-500" />
                {totalAlerts > 0 && (
                  <span className="absolute -top-2 -right-2 min-w-[18px] h-[18px] px-1 rounded-full bg-amber-500 text-white text-[10px] font-semibold flex items-center justify-center">
                    {totalAlerts > 99 ? "99+" : totalAlerts}
                  </span>
                )}
              </button>

              {bellOpen && (
                <div className="absolute right-0 mt-3 w-72 bg-white border border-stone-200 rounded-xl shadow-lg overflow-hidden">
                  <p className="px-4 py-3 text-sm font-semibold border-b border-stone-100">
                    Notifications
                  </p>
                  {totalAlerts === 0 ? (
                    <p className="px-4 py-6 text-sm text-stone-500 text-center">
                      You are all caught up.
                    </p>
                  ) : (
                    <div>
                      {counts.unreadMessages > 0 && (
                        <Link
                          to="/admin/messages"
                          onClick={() => setBellOpen(false)}
                          className="flex items-center gap-3 px-4 py-3 hover:bg-stone-50"
                        >
                          <MessageSquare className="h-4 w-4 text-amber-600" />
                          <span className="text-sm">
                            {counts.unreadMessages} unread message
                            {counts.unreadMessages > 1 ? "s" : ""}
                          </span>
                        </Link>
                      )}
                      {counts.pendingOrders > 0 && (
                        <Link
                          to="/admin/orders"
                          onClick={() => setBellOpen(false)}
                          className="flex items-center gap-3 px-4 py-3 hover:bg-stone-50"
                        >
                          <ShoppingBag className="h-4 w-4 text-amber-600" />
                          <span className="text-sm">
                            {counts.pendingOrders} pending order
                            {counts.pendingOrders > 1 ? "s" : ""}
                          </span>
                        </Link>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium leading-tight">{admin.name}</p>
              <p className="text-xs text-stone-500 leading-tight">{admin.email}</p>
            </div>
            <div className="h-9 w-9 rounded-full bg-stone-900 text-white flex items-center justify-center text-sm font-medium">
              {admin.name?.[0]?.toUpperCase() || "A"}
            </div>
          </div>
        </header>

        <main className="p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
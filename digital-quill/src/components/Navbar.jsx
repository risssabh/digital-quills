import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/authSlice";
import NotificationDropdown from "./NotificationDropdown";
import { searchBlogs, searchUsers, getNotifications } from "../utils/api";

export default function Navbar() {
  const { isAuthenticated, user } = useSelector((s) => s.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [openMobile, setOpenMobile] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);
  const [search, setSearch] = useState("");
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const notifRef = useRef(null);

  // fetch notifications to check unread
  useEffect(() => {
    async function checkUnread() {
      if (!isAuthenticated) {
        setHasUnread(false);
        return;
      }
      try {
        const { data } = await getNotifications();
        setHasUnread(data.some((n) => !n.read));
      } catch (err) {
        console.error("Failed to fetch notifications", err);
      }
    }
    checkUnread();
  }, [isAuthenticated, notifOpen]);

  // close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotifOpen(false);
      }
    }
    if (notifOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [notifOpen]);

  function confirmLogout() {
    dispatch(logout());
    navigate("/login");
    setOpenMobile(false);
    setShowLogoutModal(false);
  }

  async function handleSearch(e) {
    e.preventDefault();
    const q = (search || "").trim();
    if (!q) return;

    try {
      const [blogsRes, usersRes] = await Promise.all([
        searchBlogs(q),
        searchUsers(q),
      ]);
      const blogs = blogsRes.data || [];
      const users = usersRes.data || [];

      if (blogs.length > 0 || users.length > 0) {
        navigate("/explore", { state: { results: { blogs, users }, q } });
      } else {
        alert("No blogs or users found for that query.");
      }
    } catch (err) {
      console.error("Search error", err);
      alert("Search failed. Try again.");
    } finally {
      setSearch("");
    }
  }

  const firstName =
    user?.firstName ||
    (user?.fullName ? user.fullName.split(" ")[0] : user?.username);

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-sm border-b border-[#d6c6a5] px-4 sm:px-6 py-3 flex items-center justify-between">
      {/* Left */}
      <div className="flex items-center gap-4 sm:gap-6">
        <Link to="/" className="text-xl sm:text-2xl brand">
          Digital Quill
        </Link>
        <div className="hidden md:flex gap-4 text-sm">
          <Link to="/" className="hover:text-[#6a4e2c]">Home</Link>
          <Link to="/explore" className="hover:text-[#6a4e2c]">Explore</Link>
          <Link to="/about" className="hover:text-[#6a4e2c]">About</Link>
          <Link to="/contact" className="hover:text-[#6a4e2c]">Contact</Link>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
        {/* Search */}
        <form onSubmit={handleSearch} className="flex items-center gap-2">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search users or blogs"
            className="px-2 py-1 border rounded-md text-sm w-24 xs:w-32 sm:w-40 md:w-56"
          />
          <button type="submit" className="btn btn-secondary text-xs sm:text-sm px-2 sm:px-3">
            Go
          </button>
        </form>

        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => {
              setNotifOpen((v) => !v);
              setHasUnread(false);
            }}
            className="p-2 rounded-md hover:bg-[#f5f0e6] relative"
            aria-label="Notifications"
          >
            🔔
            {hasUnread && <span className="notify-dot absolute top-0 right-0"></span>}
          </button>

          {notifOpen && (
            <NotificationDropdown
              onClose={() => setNotifOpen(false)}
              onReadChange={() => setHasUnread(false)}
            />
          )}
        </div>

        {/* Auth Buttons */}
        <div className="hidden md:flex items-center gap-2 sm:gap-3">
          {isAuthenticated ? (
            <>
              <Link to="/profile" className="text-sm small-muted">
                Hi, {firstName}
              </Link>
              <button
                onClick={() => setShowLogoutModal(true)}
                className="btn btn-secondary text-sm"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-primary text-sm">Login</Link>
              <Link to="/register" className="btn btn-secondary text-sm">Register</Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden px-3 py-1 text-xl"
          onClick={() => setOpenMobile((s) => !s)}
        >
          ☰
        </button>
      </div>

      {/* Mobile Dropdown */}
      {openMobile && (
        <div className="absolute top-full left-0 right-0 bg-white border-t border-[#d6c6a5] shadow-md flex flex-col items-start px-6 py-4 space-y-4 md:hidden">
          <Link to="/" onClick={() => setOpenMobile(false)}>Home</Link>
          <Link to="/explore" onClick={() => setOpenMobile(false)}>Explore</Link>
          <Link to="/about" onClick={() => setOpenMobile(false)}>About</Link>
          <Link to="/contact" onClick={() => setOpenMobile(false)}>Contact</Link>
          {isAuthenticated ? (
            <>
              <Link to="/profile" onClick={() => setOpenMobile(false)}>Hi, {firstName}</Link>
              <button onClick={() => setShowLogoutModal(true)} className="btn btn-secondary text-sm">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-primary text-sm">Login</Link>
              <Link to="/register" className="btn btn-secondary text-sm">Register</Link>
            </>
          )}
        </div>
      )}

      {/* Logout Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="card max-w-md w-full text-center p-6">
            <h3 className="text-xl font-semibold mb-4">Confirm Logout</h3>
            <p className="small-muted mb-6">
              Are you sure you want to log out?
            </p>
            <div className="flex justify-center gap-4">
              <button onClick={confirmLogout} className="btn btn-secondary">
                Yes, Logout
              </button>
              <button
                onClick={() => setShowLogoutModal(false)}
                className="btn btn-secondary"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

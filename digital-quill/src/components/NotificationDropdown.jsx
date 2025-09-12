import { useEffect, useState } from "react";
import { getNotifications, markNotificationRead } from "../utils/api";
import { Link } from "react-router-dom";

export default function NotificationDropdown({ onClose, onReadChange }) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  async function fetchNotifications() {
    try {
      setLoading(true);
      const { data } = await getNotifications();
      setNotifications(data || []);
    } catch (err) {
      console.error("Failed to fetch notifications", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchNotifications(); // 🔹 refresh every open
  }, []);

  const handleMarkRead = async (id) => {
    try {
      await markNotificationRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, read: true } : n))
      );
      if (onReadChange) onReadChange(id);
    } catch (err) {
      console.error("Failed to mark notification read", err);
    }
  };

  return (
    <div className="absolute right-0 mt-2 w-80 bg-white border border-[var(--muted)]/40 rounded-xl shadow-lg z-50">
      <div className="p-3 border-b border-[var(--muted)]/40 flex justify-between items-center">
        <h3 className="font-semibold">Notifications</h3>
        {loading && <span className="text-xs small-muted">Loading...</span>}
      </div>

      <div className="max-h-80 overflow-y-auto">
        {!loading && notifications.length === 0 && (
          <p className="p-3 small-muted">No notifications yet.</p>
        )}

        {notifications.map((n) => (
          <div
            key={n._id}
            className={`p-3 border-b border-[var(--muted)]/30 text-sm ${
              n.read ? "bg-[var(--paper)]/50" : "bg-[var(--paper)]"
            }`}
          >
            <Link to={n.blog ? `/blog/${n.blog}` : "#"} onClick={onClose} className="block">
              <p>{n.message}</p>
              <p className="small-muted text-xs">
                {new Date(n.createdAt).toLocaleString()}
              </p>
            </Link>

            {!n.read && (
              <button
                onClick={() => handleMarkRead(n._id)}
                className="mt-1 text-xs text-[var(--accent)] hover:underline"
              >
                Mark as read
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

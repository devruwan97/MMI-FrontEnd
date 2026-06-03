import { useEffect, useState } from "react";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import { Link } from "react-router";

type Notification = {
  id: number;
  userId: number;
  message: string;
  isRead: boolean;
  createdAt: string;
};

export default function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [notifying, setNotifying] = useState<boolean>(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const userId = localStorage.getItem("userId");

  function toggleDropdown() {
    setIsOpen((prev) => !prev);
  }

  function closeDropdown() {
    setIsOpen(false);
  }

  const handleClick = () => {
    toggleDropdown();
    setNotifying(false);
  };

  const fetchNotifications = async () => {
    if (!userId) return;

    try {
      const res = await fetch(
        `${API_BASE_URL}/api/notifications/${userId}`
      );

      if (!res.ok) throw new Error("Failed to fetch notifications");

      const data: Notification[] = await res.json();

      setNotifications(data);

      const hasUnread = data.some((n) => !n.isRead);
      setNotifying(hasUnread);

    } catch (error) {
      console.error("Error loading notifications:", error);
    }
  };

  const markAsRead = async (id: number) => {
    try {
      const res = await fetch(
        `${API_BASE_URL}/api/notifications/${id}/read`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!res.ok) throw new Error("Failed to mark as read");

      setNotifications((prev) =>
        prev.map((n) =>
          n.id === id ? { ...n, isRead: true } : n
        )
      );
    } catch (error) {
      console.error("Error marking read:", error);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen]);

  return (
    <div className="relative">
      <button
        className="relative flex items-center justify-center text-gray-500 transition-colors bg-white border border-gray-200 rounded-full h-11 w-11 hover:bg-gray-100"
        onClick={handleClick}
      >
        {/* RED DOT */}
        {notifying && (
          <span className="absolute right-0 top-0.5 h-2 w-2 rounded-full bg-orange-400 animate-ping" />
        )}

        {/* ICON */}
        <svg
          className="fill-current"
          width="20"
          height="20"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M10.75 2.29248C10.75 1.87827 10.4143 1.54248 10 1.54248C9.58583 1.54248 9.25004 1.87827 9.25004 2.29248V2.83613C6.08266 3.20733 3.62504 5.9004 3.62504 9.16748V14.4591H3.33337C2.91916 14.4591 2.58337 14.7949 2.58337 15.2091C2.58337 15.6234 2.91916 15.9591 3.33337 15.9591H16.6667C17.0809 15.9591 17.4167 15.6234 17.4167 15.2091C17.4167 14.7949 17.0809 14.4591 16.6667 14.4591H16.375V9.16748C16.375 5.9004 13.9174 3.20733 10.75 2.83613V2.29248Z"
            fill="currentColor"
          />
        </svg>
      </button>

      {/* DROPDOWN */}
      <Dropdown
        isOpen={isOpen}
        onClose={closeDropdown}
        className="absolute -right-[240px] mt-[17px] flex h-[480px] w-[350px] flex-col rounded-2xl border bg-white p-3 shadow-lg"
      >
        {/* HEADER */}
        <div className="flex justify-between pb-3 mb-3 border-b">
          <h5 className="text-lg font-semibold">Notifications</h5>
        </div>

        {/* LIST */}
        <ul className="flex flex-col overflow-y-auto">
          {notifications.length === 0 ? (
            <p className="text-center text-gray-500 py-4">
              No notifications
            </p>
          ) : (
            notifications.map((n) => (
              <li key={n.id}>
                <DropdownItem
                  onItemClick={() => {
                    markAsRead(n.id);
                    closeDropdown();
                  }}
                  className={`flex gap-3 p-3 border-b hover:bg-gray-100 ${
                    !n.isRead ? "bg-gray-50" : ""
                  }`}
                >
                  {/* DOT */}
                  <span
                    className={`h-2 w-2 rounded-full mt-2 ${
                      n.isRead ? "bg-gray-400" : "bg-orange-500"
                    }`}
                  />

                  {/* MESSAGE */}
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-700">
                      {n.message}
                    </span>

                    <span className="text-xs text-gray-400">
                      {n.createdAt
                        ? new Date(n.createdAt).toLocaleString()
                        : ""}
                    </span>
                  </div>
                </DropdownItem>
              </li>
            ))
          )}
        </ul>

        {/* FOOTER */}
        <Link
          to="/"
          className="block px-4 py-2 mt-3 text-sm text-center border rounded-lg"
        >
          View All Notifications
        </Link>
      </Dropdown>
    </div>
  );
}
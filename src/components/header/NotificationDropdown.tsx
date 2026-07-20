import { useEffect, useState } from "react";
import { Link } from "react-router";
import { useSocket } from "../../context/SocketContext";
import toast from "react-hot-toast";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import api from "../../api/axios";

interface NotificationItem {
  id: string;
  message: string;
  type: string;
  time: string;
}

export default function NotificationDropdown() {
  const [notifying, setNotifying] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const { socket } = useSocket();

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await api.get("/notifications?unread=true");
        if (res.data.success) {
          const items = res.data.data.map((n: any) => ({
            id: n._id,
            message: n.body,
            type: n.entityType || n.channel,
            time: new Date(n.createdAt).toLocaleString(),
          }));
          setNotifications(items);
          if (items.length > 0) setNotifying(true);
        }
      } catch (err) {
        console.error("Failed to fetch notifications");
      }
    };
    fetchNotifications();
  }, []);

  useEffect(() => {
    if (!socket) return;

    socket.on("new_notification", (data: any) => {
      setNotifying(true);
      toast.success(data.message || "New Notification Received!", {
        duration: 5000,
        position: "top-right",
      });
      setNotifications((prev) => [
        {
          id: data.id || Math.random().toString(),
          message: data.message,
          type: data.type,
          time: "Just now",
        },
        ...prev,
      ]);
    });

    return () => {
      socket.off("new_notification");
    };
  }, [socket]);

  const markAllAsRead = async () => {
    try {
      await api.post("/notifications/mark-read");
      setNotifications([]);
      setNotifying(false);
      toast.success("All notifications marked as read");
    } catch (err) {
      toast.error("Failed to mark notifications as read");
    }
  };

  return (
    <DropdownMenu.Root onOpenChange={(open) => {
      if (open) setNotifying(false);
    }}>
      <DropdownMenu.Trigger asChild>
        <button
          className="relative flex items-center justify-center text-gray-500 transition-colors bg-white border border-gray-200 rounded-full dropdown-toggle hover:text-gray-700 h-11 w-11 hover:bg-gray-100 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white focus:outline-none"
        >
          <span
            className={`absolute right-0 top-0.5 z-10 h-2 w-2 rounded-full bg-orange-400 ${
              !notifying ? "hidden" : "flex"
            }`}
          >
            <span className="absolute inline-flex w-full h-full bg-orange-400 rounded-full opacity-75 animate-ping"></span>
          </span>
          <svg
            className="fill-current"
            width="20"
            height="20"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M10.75 2.29248C10.75 1.87827 10.4143 1.54248 10 1.54248C9.58583 1.54248 9.25004 1.87827 9.25004 2.29248V2.83613C6.08266 3.20733 3.62504 5.9004 3.62504 9.16748V14.4591H3.33337C2.91916 14.4591 2.58337 14.7949 2.58337 15.2091C2.58337 15.6234 2.91916 15.9591 3.33337 15.9591H4.37504H15.625H16.6667C17.0809 15.9591 17.4167 15.6234 17.4167 15.2091C17.4167 14.7949 17.0809 14.4591 16.6667 14.4591H16.375V9.16748C16.375 5.9004 13.9174 3.20733 10.75 2.83613V2.29248ZM14.875 14.4591V9.16748C14.875 6.47509 12.6924 4.29248 10 4.29248C7.30765 4.29248 5.12504 6.47509 5.12504 9.16748V14.4591H14.875ZM8.00004 17.7085C8.00004 18.1228 8.33583 18.4585 8.75004 18.4585H11.25C11.6643 18.4585 12 18.1228 12 17.7085C12 17.2943 11.6643 16.9585 11.25 16.9585H8.75004C8.33583 16.9585 8.00004 17.2943 8.00004 17.7085Z"
              fill="currentColor"
            />
          </svg>
        </button>
      </DropdownMenu.Trigger>
      
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          sideOffset={8}
          className="z-50 flex h-[480px] w-[350px] flex-col rounded-2xl border border-gray-200 bg-white p-3 shadow-theme-lg outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 dark:border-gray-800 dark:bg-gray-dark sm:w-[361px]"
        >
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-gray-100 dark:border-gray-700">
            <h5 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
              Notification
            </h5>
            {notifications.length > 0 && (
              <button 
                onClick={markAllAsRead}
                className="text-sm font-medium text-brand-500 hover:text-brand-600 dark:text-brand-400 dark:hover:text-brand-300"
              >
                Mark all read
              </button>
            )}
          </div>
          <ul className="flex flex-col h-auto overflow-y-auto custom-scrollbar">
            {notifications.length === 0 ? (
              <li className="p-4 text-center text-gray-500">No new notifications</li>
            ) : (
              notifications.map((notif) => (
                <li key={notif.id}>
                  <DropdownMenu.Item asChild>
                    <div
                      className="flex gap-3 rounded-lg border-b border-gray-100 p-3 px-4.5 py-3 hover:bg-gray-100 dark:border-gray-800 dark:hover:bg-white/5 outline-none cursor-pointer focus:bg-gray-100 dark:focus:bg-white/5"
                    >
                      <span className="relative block w-full h-10 rounded-full z-1 max-w-10">
                        <img
                          width={40}
                          height={40}
                          src="/images/user/user-02.jpg"
                          alt="User"
                          className="w-full overflow-hidden rounded-full"
                        />
                        <span className="absolute bottom-0 right-0 z-10 h-2.5 w-full max-w-2.5 rounded-full border-[1.5px] border-white bg-success-500 dark:border-gray-900"></span>
                      </span>
  
                      <span className="block">
                        <span className="mb-1.5 block  text-theme-sm text-gray-500 dark:text-gray-400 space-x-1">
                          <span className="font-medium text-gray-800 dark:text-white/90">
                            {notif.type.toUpperCase()}
                          </span>
                          <span> {notif.message}</span>
                        </span>
  
                        <span className="flex items-center gap-2 text-gray-500 text-theme-xs dark:text-gray-400">
                          <span>{notif.time}</span>
                        </span>
                      </span>
                    </div>
                  </DropdownMenu.Item>
                </li>
              ))
            )}
          </ul>
          <DropdownMenu.Item asChild>
            <Link
              to="/"
              className="block px-4 py-2 mt-3 text-sm font-medium text-center text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 outline-none focus:ring-2 focus:ring-brand-500"
            >
              View All Notifications
            </Link>
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}

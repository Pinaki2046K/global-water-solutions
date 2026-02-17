"use client";

import { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import {
  getUserNotifications,
  markNotificationAsRead,
  Notification,
} from "@/app/dashboard/notifications/actions";
import { Bell, Check, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface NotificationListProps {
  embedded?: boolean;
}

export function NotificationList({ embedded = false }: NotificationListProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetch() {
      const data = await getUserNotifications();
      setNotifications(data);
      setLoading(false);
    }
    fetch();
  }, []);

  const handleMarkRead = async (id: string) => {
    await markNotificationAsRead(id);
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
    );
  };

  if (loading) {
    return (
      <div className="p-4 text-center text-sm text-gray-500">
        Loading notifications...
      </div>
    );
  }

  if (notifications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <div className="rounded-full bg-gray-50 p-3 mb-3">
          <Bell className="h-6 w-6 text-gray-400" />
        </div>
        <p className="text-sm font-medium text-gray-900">No notifications</p>
        <p className="text-xs text-gray-500 mt-1">You&apos;re all caught up!</p>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "divide-y divide-gray-100",
        embedded ? "max-h-[400px] overflow-y-auto" : "",
      )}
    >
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={cn(
            "relative group",
            !notification.isRead && "bg-indigo-50/30",
          )}
        >
          <Link
            href={`/dashboard/notifications/${notification.id}`}
            className="block p-4 hover:bg-gray-50 transition-colors"
          >
            <div className="flex gap-3">
              <div className="flex-1 space-y-1">
                <h4 className="text-sm font-semibold text-gray-900 uppercase">
                  {notification.title}
                </h4>
                <p className="text-sm text-gray-600 leading-relaxed line-clamp-2">
                  {notification.message.replace(/\[Service ID:.*?\]/g, "")}
                </p>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-gray-400">
                    {formatDistanceToNow(new Date(notification.createdAt), {
                      addSuffix: true,
                    })}
                  </p>
                  <span className="text-xs text-indigo-600 font-medium flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                    View Details
                    <ExternalLink className="h-3 w-3 ml-1" />
                  </span>
                </div>
              </div>
              {!notification.isRead && (
                <div className="flex-shrink-0 mt-1">
                  <div className="h-2 w-2 rounded-full bg-indigo-600" />
                </div>
              )}
            </div>
          </Link>
          {!notification.isRead && (
            <button
              onClick={(e) => {
                e.preventDefault();
                handleMarkRead(notification.id);
              }}
              className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 p-1.5 text-gray-400 hover:text-indigo-600 transition-all bg-white rounded-full shadow-sm border border-gray-100 z-10"
              title="Mark as read"
            >
              <Check className="h-3 w-3" />
            </button>
          )}
        </div>
      ))}
    </div>
  );
}

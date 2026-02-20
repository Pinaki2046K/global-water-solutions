import { getUserNotifications } from "@/app/dashboard/notifications/actions";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { Bell, Check, AlertCircle, Info, CheckCircle } from "lucide-react";

export default async function NotificationsPage() {
  const notifications = await getUserNotifications();

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Notifications
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {unreadCount > 0
              ? `You have ${unreadCount} unread notification${unreadCount > 1 ? "s" : ""}`
              : "All caught up!"}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Bell className="h-5 w-5 text-gray-400" />
          <span className="text-sm font-medium text-gray-700">
            {notifications.length} Total
          </span>
        </div>
      </div>

      {/* Notifications List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 divide-y divide-gray-200">
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Bell className="h-12 w-12 text-gray-300 mb-3" />
            <p className="text-gray-500 font-medium">No notifications yet</p>
            <p className="text-sm text-gray-400 mt-1">
              You&apos;ll be notified when services need maintenance
            </p>
          </div>
        ) : (
          notifications.map((notification) => {
            const typeIcon = {
              WARNING: <AlertCircle className="h-5 w-5 text-orange-500" />,
              INFO: <Info className="h-5 w-5 text-blue-500" />,
              SUCCESS: <CheckCircle className="h-5 w-5 text-green-500" />,
            }[notification.type] || <Bell className="h-5 w-5 text-gray-500" />;

            return (
              <Link
                key={notification.id}
                href={`/dashboard/notifications/${notification.id}`}
                className={`block p-4 hover:bg-gray-50 transition-colors ${
                  !notification.isRead ? "bg-blue-50/30" : ""
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 mt-1">{typeIcon}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p
                          className={`text-sm font-semibold ${
                            !notification.isRead
                              ? "text-gray-900"
                              : "text-gray-700"
                          }`}
                        >
                          {notification.title}
                        </p>
                        <p
                          className={`text-sm mt-1 ${
                            !notification.isRead
                              ? "text-gray-700"
                              : "text-gray-600"
                          }`}
                        >
                          {notification.message.replace(
                            /\[Service ID:.*?\]/g,
                            "",
                          )}
                        </p>
                        <p className="text-xs text-gray-400 mt-2">
                          {formatDistanceToNow(
                            new Date(notification.createdAt),
                            {
                              addSuffix: true,
                            },
                          )}
                        </p>
                      </div>
                      {!notification.isRead && (
                        <div className="ml-2 flex-shrink-0">
                          <span className="inline-block w-2 h-2 bg-blue-500 rounded-full"></span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            );
          })
        )}
      </div>
    </div>
  );
}

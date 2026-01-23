'use client';

/**
 * Page des notifications du forum
 */

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/4nk/hooks/useAuth';
import {
  getNotificationsForUser,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from '@/lib/4nk/forum/forum-storage';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import type { ForumNotification } from '@/lib/4nk/types';

export default function NotificationsPage() {
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const [notifications, setNotifications] = useState<ForumNotification[]>([]);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/forum');
    }
  }, [loading, isAuthenticated, router]);

  useEffect(() => {
    if (user) {
      setNotifications(getNotificationsForUser(user.mainAddress));
    }
  }, [user]);

  const handleMarkAsRead = (notificationId: string) => {
    markNotificationAsRead(notificationId);
    setNotifications(
      notifications.map((n) =>
        n.id === notificationId ? { ...n, isRead: true } : n
      )
    );
  };

  const handleMarkAllAsRead = () => {
    if (!user) return;
    markAllNotificationsAsRead(user.mainAddress);
    setNotifications(notifications.map((n) => ({ ...n, isRead: true })));
  };

  const getNotificationIcon = (type: ForumNotification['type']) => {
    switch (type) {
      case 'mention':
        return '@';
      case 'reply':
        return '💬';
      case 'vote':
        return '👍';
      case 'solution':
        return '✓';
      default:
        return '🔔';
    }
  };

  const getNotificationText = (notification: ForumNotification) => {
    switch (notification.type) {
      case 'mention':
        return `vous a mentionne dans "${notification.topicTitle}"`;
      case 'reply':
        return `a repondu dans "${notification.topicTitle}"`;
      case 'vote':
        return notification.preview;
      case 'solution':
        return notification.preview;
      default:
        return notification.preview;
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
              Notifications
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {unreadCount > 0
                ? `${unreadCount} notification${unreadCount > 1 ? 's' : ''} non lue${unreadCount > 1 ? 's' : ''}`
                : 'Toutes les notifications sont lues'}
            </p>
          </div>

          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              className="px-4 py-2 text-sm text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition"
            >
              Tout marquer comme lu
            </button>
          )}
        </div>

        {/* Notifications List */}
        {notifications.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-12 text-center">
            <div className="text-6xl mb-4">🔔</div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Aucune notification
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Vous serez notifie des mentions, reponses et votes
            </p>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden">
            <div className="divide-y divide-gray-100 dark:divide-gray-700">
              {notifications.map((notification) => (
                <Link
                  key={notification.id}
                  href={
                    notification.postId
                      ? `/forum/topic/${notification.topicId}#post-${notification.postId}`
                      : `/forum/topic/${notification.topicId}`
                  }
                  onClick={() => {
                    if (!notification.isRead) {
                      handleMarkAsRead(notification.id);
                    }
                  }}
                  className={`flex gap-4 p-4 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition ${
                    !notification.isRead
                      ? 'bg-indigo-50/50 dark:bg-indigo-900/10'
                      : ''
                  }`}
                >
                  {/* Icon */}
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${
                      notification.type === 'solution'
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                        : notification.type === 'vote'
                        ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400'
                        : 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400'
                    }`}
                  >
                    {getNotificationIcon(notification.type)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-900 dark:text-white">
                      <span className="font-semibold">{notification.actorLabel}</span>{' '}
                      {getNotificationText(notification)}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      {formatDistanceToNow(new Date(notification.createdAt), {
                        addSuffix: true,
                        locale: fr,
                      })}
                    </p>
                  </div>

                  {/* Unread indicator */}
                  {!notification.isRead && (
                    <div className="w-2 h-2 rounded-full bg-indigo-600 self-center"></div>
                  )}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

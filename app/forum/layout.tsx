'use client';

/**
 * Layout pour la section forum
 */

import { Navbar } from '../components/navbar';
import { ForumActions } from '../components/forum-actions';

export default function ForumLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Navbar */}
      <Navbar actions={<ForumActions />} />

      {/* Main Content */}
      <main className="pt-20">{children}</main>
    </div>
  );
}

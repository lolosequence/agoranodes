'use client';

import Link from 'next/link';
import { Search } from 'lucide-react';

export function ForumActions() {
  return (
    <>
      <Link
        href="/forum/search"
        className="p-2 text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition"
        title="Rechercher"
      >
        <Search size={20} />
      </Link>
      <Link
        href="/forum/create"
        className="px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-full hover:bg-indigo-700 transition"
      >
        Nouveau Topic
      </Link>
    </>
  );
}

'use client';

import Link from 'next/link';

interface CategoryBlock {
  name: string;
  slug: string;
}

const mainCategories: CategoryBlock[] = [
  { name: 'Démocratie directe', slug: 'democratie-directe' },
  { name: 'Énergie', slug: 'energie' },
  { name: 'Écologie', slug: 'ecologie' },
  { name: 'Monnaie', slug: 'monnaie' },
];

export function CategoryBlocks() {
  return (
    <section className="mb-12">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {mainCategories.map((category) => (
          <Link
            key={category.slug}
            href={`/publications?category=${category.slug}`}
            className="block p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition text-center"
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {category.name}
            </h3>
          </Link>
        ))}
      </div>
    </section>
  );
}

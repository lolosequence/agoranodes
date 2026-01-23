'use client';

/**
 * Page de creation d'un nouveau topic
 */

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/4nk/hooks/useAuth';
import { FORUM_CATEGORIES } from '@/lib/4nk/forum/forum-storage';
import { createTopic } from '@/lib/4nk/forum/forum-manager';
import { isUserBanned } from '@/lib/4nk/forum/forum-moderation';
import RichTextEditor from '@/components/forum/RichTextEditor';

function CreateTopicForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isAuthenticated, loading } = useAuth();

  const [categoryId, setCategoryId] = useState(searchParams.get('category') || '');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [contentRaw, setContentRaw] = useState('');
  const [tags, setTags] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Rediriger si non authentifie
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/forum');
    }
  }, [loading, isAuthenticated, router]);

  // Verifier si banni
  useEffect(() => {
    if (user && isUserBanned(user.mainAddress)) {
      setError('Vous etes banni et ne pouvez pas creer de topics.');
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) return;

    // Validation
    if (!categoryId) {
      setError('Veuillez selectionner une categorie');
      return;
    }
    if (!title.trim()) {
      setError('Veuillez entrer un titre');
      return;
    }
    if (title.trim().length < 5) {
      setError('Le titre doit contenir au moins 5 caracteres');
      return;
    }
    if (!contentRaw.trim()) {
      setError('Veuillez entrer un contenu');
      return;
    }
    if (contentRaw.trim().length < 10) {
      setError('Le contenu doit contenir au moins 10 caracteres');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const parsedTags = tags
        .split(',')
        .map((t) => t.trim().toLowerCase())
        .filter((t) => t.length > 0)
        .slice(0, 5); // Max 5 tags

      const topic = await createTopic(
        {
          categoryId,
          title: title.trim(),
          content,
          contentRaw,
          tags: parsedTags,
        },
        user
      );

      router.push(`/forum/topic/${topic.id}`);
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la creation du topic');
      setIsSubmitting(false);
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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm">
          <Link href="/forum" className="text-indigo-600 dark:text-indigo-400 hover:underline">
            Forum
          </Link>
          <span className="mx-2 text-gray-400">/</span>
          <span className="text-gray-600 dark:text-gray-400">Nouveau topic</span>
        </nav>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Creer un nouveau topic
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Partagez vos idees avec la communaute
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Error */}
          {error && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-300">
              {error}
            </div>
          )}

          {/* Category */}
          <div>
            <label
              htmlFor="category"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Categorie *
            </label>
            <select
              id="category"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              required
            >
              <option value="">Selectionnez une categorie</option>
              {FORUM_CATEGORIES.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.icon} {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Title */}
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Titre *
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Un titre clair et descriptif"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              maxLength={200}
              required
            />
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {title.length}/200 caracteres
            </p>
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Contenu *
            </label>
            <RichTextEditor
              content={content}
              onChange={(html, raw) => {
                setContent(html);
                setContentRaw(raw);
              }}
              placeholder="Decrivez votre sujet en detail..."
              minHeight="250px"
            />
          </div>

          {/* Tags */}
          <div>
            <label
              htmlFor="tags"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Tags (optionnel)
            </label>
            <input
              type="text"
              id="tags"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="bitcoin, dev, question (separes par des virgules)"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Maximum 5 tags, separes par des virgules
            </p>
          </div>

          {/* Submit */}
          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition font-semibold"
            >
              {isSubmitting ? 'Publication...' : 'Publier le topic'}
            </button>
            <Link
              href="/forum"
              className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition font-medium"
            >
              Annuler
            </Link>
          </div>
        </form>

        {/* Guidelines */}
        <div className="mt-8 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
            Conseils pour un bon topic
          </h3>
          <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
            <li>- Utilisez un titre clair et descriptif</li>
            <li>- Fournissez suffisamment de contexte</li>
            <li>- Postez dans la bonne categorie</li>
            <li>- Utilisez @mentions pour notifier quelqu'un</li>
            <li>- Restez respectueux et constructif</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default function CreateTopicPage() {
  return (
    <Suspense
      fallback={
        <div className="container mx-auto px-4 py-8 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      }
    >
      <CreateTopicForm />
    </Suspense>
  );
}

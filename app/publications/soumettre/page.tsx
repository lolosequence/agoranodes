'use client';

import { useState, useEffect, useContext } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AuthContext } from '@/lib/4nk/auth-context';
import { createArticle, getCategories, StrapiCategory } from '@/lib/strapi';
import { ThemeToggle } from '../../components/theme-toggle';
import {
  ArrowLeft,
  Send,
  FileText,
  Tag,
  User,
  AlertCircle,
  CheckCircle,
  Loader2,
  Eye,
  Edit3,
  Lock,
} from 'lucide-react';

export default function SubmitArticlePage() {
  const router = useRouter();
  const { isAuthenticated, user, loading: authLoading } = useContext(AuthContext);

  const [title, setTitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [categories, setCategories] = useState<StrapiCategory[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      const cats = await getCategories();
      setCategories(cats);
    };
    fetchCategories();
  }, []);

  // Generate slug from title
  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated) {
      setError('Vous devez être connecté pour soumettre un article.');
      return;
    }

    if (!title.trim()) {
      setError('Le titre est obligatoire.');
      return;
    }

    if (!content.trim()) {
      setError('Le contenu est obligatoire.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const slug = generateSlug(title);
      const authorName = user?.label || 'Anonyme';

      const result = await createArticle({
        title: title.trim(),
        slug,
        content: content.trim(),
        excerpt: excerpt.trim() || undefined,
        category: categoryId || undefined,
        author: authorName,
      });

      if (result) {
        setSuccess(true);
        // Redirect after a short delay
        setTimeout(() => {
          router.push('/publications');
        }, 3000);
      } else {
        setError("Une erreur s'est produite lors de la soumission. Veuillez réessayer.");
      }
    } catch (err) {
      console.error('Error submitting article:', err);
      setError("Une erreur s'est produite. Veuillez réessayer.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show loading state while checking auth
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
          <Loader2 className="w-6 h-6 animate-spin" />
          Chargement...
        </div>
      </div>
    );
  }

  // Show login prompt if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        {/* Header */}
        <header className="container mx-auto px-4 py-8">
          <nav className="flex justify-between items-center">
            <Link href="/">
              <h1 className="text-3xl font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition cursor-pointer">
                Agoranodes
              </h1>
            </Link>
            <div className="flex items-center space-x-6">
              <Link href="/publications" className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition">
                Publications
              </Link>
              <ThemeToggle />
            </div>
          </nav>
        </header>

        <main className="container mx-auto px-4 py-12">
          <div className="max-w-md mx-auto">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-6 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center">
                <Lock className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Connexion requise
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mb-8">
                Vous devez être connecté avec votre compte 4NK pour soumettre un article.
              </p>
              <div className="space-y-4">
                <Link
                  href="/"
                  className="block w-full px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition"
                >
                  Se connecter
                </Link>
                <Link
                  href="/publications"
                  className="block w-full px-6 py-3 text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition"
                >
                  Retour aux publications
                </Link>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Show success message
  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <header className="container mx-auto px-4 py-8">
          <nav className="flex justify-between items-center">
            <Link href="/">
              <h1 className="text-3xl font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition cursor-pointer">
                Agoranodes
              </h1>
            </Link>
            <ThemeToggle />
          </nav>
        </header>

        <main className="container mx-auto px-4 py-12">
          <div className="max-w-md mx-auto">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-6 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Article soumis !
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Votre article a été soumis avec succès et est en attente de validation.
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Redirection vers les publications...
              </p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="container mx-auto px-4 py-8">
        <nav className="flex justify-between items-center">
          <Link href="/">
            <h1 className="text-3xl font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition cursor-pointer">
              Agoranodes
            </h1>
          </Link>
          <div className="flex items-center space-x-6">
            <Link href="/publications" className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition">
              Publications
            </Link>
            <ThemeToggle />
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Back Link */}
          <Link
            href="/publications"
            className="inline-flex items-center gap-2 text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour aux publications
          </Link>

          {/* Page Title */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Soumettre un article
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Partagez vos idées avec la communauté Agoranodes. Votre article sera soumis pour validation avant publication.
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0" />
              <p className="text-red-700 dark:text-red-300">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                <FileText className="w-4 h-4" />
                Titre *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Le titre de votre article"
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                required
              />
            </div>

            {/* Category */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                <Tag className="w-4 h-4" />
                Catégorie
              </label>
              <select
                value={categoryId || ''}
                onChange={(e) => setCategoryId(e.target.value ? Number(e.target.value) : null)}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
              >
                <option value="">Sélectionner une catégorie</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Excerpt */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                <User className="w-4 h-4" />
                Résumé (max 200 caractères)
              </label>
              <textarea
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value.slice(0, 200))}
                placeholder="Un court résumé de votre article"
                rows={2}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition resize-none"
              />
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                {excerpt.length}/200 caractères
              </p>
            </div>

            {/* Content */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between mb-3">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                  <Edit3 className="w-4 h-4" />
                  Contenu (Markdown) *
                </label>
                <button
                  type="button"
                  onClick={() => setShowPreview(!showPreview)}
                  className="flex items-center gap-1 text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300"
                >
                  {showPreview ? <Edit3 className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  {showPreview ? 'Éditer' : 'Aperçu'}
                </button>
              </div>

              {showPreview ? (
                <div className="min-h-[300px] p-4 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg">
                  <div
                    className="prose prose-sm dark:prose-invert max-w-none"
                    dangerouslySetInnerHTML={{
                      __html: content
                        .replace(/^### (.*$)/gim, '<h3>$1</h3>')
                        .replace(/^## (.*$)/gim, '<h2>$1</h2>')
                        .replace(/^# (.*$)/gim, '<h1>$1</h1>')
                        .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
                        .replace(/\*(.*)\*/gim, '<em>$1</em>')
                        .replace(/\n/gim, '<br />'),
                    }}
                  />
                </div>
              ) : (
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Écrivez votre article en Markdown..."
                  rows={15}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition resize-y font-mono text-sm"
                  required
                />
              )}
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Supporte le Markdown : # Titres, **gras**, *italique*, etc.
              </p>
            </div>

            {/* Submit Button */}
            <div className="flex items-center justify-end gap-4">
              <Link
                href="/publications"
                className="px-6 py-3 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition"
              >
                Annuler
              </Link>
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 px-8 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-lg"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Envoi en cours...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Soumettre l'article
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </main>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 mt-20 border-t border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center">
          <p className="text-gray-600 dark:text-gray-400">
            © 2026 Agoranodes - Propulsé par 4NK & Bitcoin
          </p>
          <div className="space-x-6">
            <a href="https://github.com/agoranodes" target="_blank" rel="noopener noreferrer" className="text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition">
              GitHub
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

'use client';

/**
 * Page de detail d'un topic avec posts
 */

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/4nk/hooks/useAuth';
import { getTopicById, getPostsByTopic, getCategoryBySlug, FORUM_CATEGORIES } from '@/lib/4nk/forum/forum-storage';
import {
  createPost,
  voteOnTopic,
  voteOnPost,
  markAsSolution,
} from '@/lib/4nk/forum/forum-manager';
import { isUserBanned, isModerator, pinTopic, unpinTopic, lockTopic, unlockTopic, deleteTopic as moderateDeleteTopic } from '@/lib/4nk/forum/forum-moderation';
import { truncateAddress } from '@/lib/4nk/crypto-utils';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import RichTextEditor from '@/components/forum/RichTextEditor';
import PostVoting from '@/components/forum/PostVoting';
import type { ForumTopic, ForumPost, ForumCategory } from '@/lib/4nk/types';

export default function TopicDetailPage() {
  const params = useParams();
  const router = useRouter();
  const topicId = params.id as string;
  const { user, isAuthenticated } = useAuth();

  const [topic, setTopic] = useState<ForumTopic | null>(null);
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [category, setCategory] = useState<ForumCategory | null>(null);

  // Reply form
  const [replyContent, setReplyContent] = useState('');
  const [replyContentRaw, setReplyContentRaw] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);

  // Moderation
  const [showModMenu, setShowModMenu] = useState(false);
  const [modReason, setModReason] = useState('');

  useEffect(() => {
    loadData();
  }, [topicId]);

  const loadData = () => {
    const topicData = getTopicById(topicId);
    if (!topicData) {
      router.push('/forum');
      return;
    }
    setTopic(topicData);
    setPosts(getPostsByTopic(topicId));

    const cat = FORUM_CATEGORIES.find((c) => c.id === topicData.categoryId);
    setCategory(cat || null);
  };

  const handleTopicVote = async (type: 'up' | 'down') => {
    if (!user || !topic) return;
    try {
      const updated = await voteOnTopic(topic.id, type, user);
      setTopic(updated);
    } catch (err) {
      console.error('Vote error:', err);
    }
  };

  const handlePostVote = async (postId: string, type: 'up' | 'down') => {
    if (!user) return;
    try {
      await voteOnPost(postId, type, user);
      loadData();
    } catch (err) {
      console.error('Vote error:', err);
    }
  };

  const handleSubmitReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !topic || !replyContentRaw.trim()) return;

    if (isUserBanned(user.mainAddress)) {
      alert('Vous etes banni et ne pouvez pas poster.');
      return;
    }

    setIsSubmitting(true);
    try {
      await createPost(
        {
          topicId: topic.id,
          parentPostId: replyingTo || undefined,
          content: replyContent,
          contentRaw: replyContentRaw,
        },
        user
      );

      setReplyContent('');
      setReplyContentRaw('');
      setReplyingTo(null);
      loadData();
    } catch (err: any) {
      alert(err.message || 'Erreur lors de la publication');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMarkSolution = async (postId: string) => {
    if (!user) return;
    try {
      await markAsSolution(postId, user);
      loadData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  // Moderation actions
  const handlePin = async () => {
    if (!user || !topic) return;
    try {
      if (topic.isPinned) {
        await unpinTopic(topic.id, user);
      } else {
        await pinTopic(topic.id, user);
      }
      loadData();
      setShowModMenu(false);
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleLock = async () => {
    if (!user || !topic) return;
    try {
      if (topic.isLocked) {
        await unlockTopic(topic.id, user);
      } else {
        const reason = prompt('Raison du verrouillage:');
        if (reason) {
          await lockTopic(topic.id, user, reason);
        }
      }
      loadData();
      setShowModMenu(false);
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleDelete = async () => {
    if (!user || !topic) return;
    const reason = prompt('Raison de la suppression:');
    if (!reason) return;

    if (!confirm('Etes-vous sur de vouloir supprimer ce topic?')) return;

    try {
      await moderateDeleteTopic(topic.id, user, reason);
      router.push('/forum');
    } catch (err: any) {
      alert(err.message);
    }
  };

  if (!topic) {
    return (
      <div className="container mx-auto px-4 py-8 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const isAuthor = user?.mainAddress === topic.authorAddress;
  const canModerate = user && isModerator(user.mainAddress);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm">
          <Link href="/forum" className="text-indigo-600 dark:text-indigo-400 hover:underline">
            Forum
          </Link>
          <span className="mx-2 text-gray-400">/</span>
          {category && (
            <>
              <Link
                href={`/forum/${category.slug}`}
                className="text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                {category.name}
              </Link>
              <span className="mx-2 text-gray-400">/</span>
            </>
          )}
          <span className="text-gray-600 dark:text-gray-400 truncate">{topic.title}</span>
        </nav>

        {/* Topic */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden mb-6">
          {/* Topic Header */}
          <div className="p-6 border-b border-gray-100 dark:border-gray-700">
            <div className="flex gap-4">
              {/* Voting */}
              <PostVoting
                score={topic.voteScore}
                upvotes={topic.upvotes}
                downvotes={topic.downvotes}
                userAddress={user?.mainAddress}
                onVote={handleTopicVote}
                disabled={!isAuthenticated}
              />

              <div className="flex-1 min-w-0">
                {/* Status badges */}
                <div className="flex gap-2 mb-2">
                  {topic.isPinned && (
                    <span className="px-2 py-0.5 text-xs bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 rounded-full">
                      Epingle
                    </span>
                  )}
                  {topic.isLocked && (
                    <span className="px-2 py-0.5 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full">
                      Verrouille
                    </span>
                  )}
                  {topic.isSolved && (
                    <span className="px-2 py-0.5 text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full">
                      Resolu
                    </span>
                  )}
                </div>

                {/* Title */}
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {topic.title}
                </h1>

                {/* Meta */}
                <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
                  <span className="font-medium text-gray-700 dark:text-gray-300">
                    {topic.authorLabel || truncateAddress(topic.authorAddress)}
                  </span>
                  <span>•</span>
                  <span>
                    {formatDistanceToNow(new Date(topic.createdAt), {
                      addSuffix: true,
                      locale: fr,
                    })}
                  </span>
                  {topic.updatedAt !== topic.createdAt && (
                    <>
                      <span>•</span>
                      <span className="italic">modifie</span>
                    </>
                  )}
                </div>

                {/* Tags */}
                {topic.tags.length > 0 && (
                  <div className="flex gap-1 mt-3">
                    {topic.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 text-xs bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Moderation Menu */}
              {canModerate && (
                <div className="relative">
                  <button
                    onClick={() => setShowModMenu(!showModMenu)}
                    className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                    </svg>
                  </button>

                  {showModMenu && (
                    <div className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-10">
                      <button
                        onClick={handlePin}
                        className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        {topic.isPinned ? 'Desepingler' : 'Epingler'}
                      </button>
                      <button
                        onClick={handleLock}
                        className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        {topic.isLocked ? 'Deverrouiller' : 'Verrouiller'}
                      </button>
                      <hr className="my-1 border-gray-200 dark:border-gray-700" />
                      <button
                        onClick={handleDelete}
                        className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                      >
                        Supprimer
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Topic Content */}
          <div className="p-6">
            <div
              className="prose prose-sm dark:prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: topic.content }}
            />
          </div>
        </div>

        {/* Replies */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {posts.length} reponse{posts.length !== 1 ? 's' : ''}
          </h2>

          <div className="space-y-4">
            {posts.map((post) => (
              <div
                key={post.id}
                id={`post-${post.id}`}
                className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 ${
                  post.isSolution
                    ? 'border-2 border-green-500 dark:border-green-600'
                    : ''
                }`}
              >
                <div className="flex gap-4">
                  {/* Voting */}
                  <PostVoting
                    score={post.voteScore}
                    upvotes={post.upvotes}
                    downvotes={post.downvotes}
                    userAddress={user?.mainAddress}
                    onVote={(type) => handlePostVote(post.id, type)}
                    disabled={!isAuthenticated}
                  />

                  <div className="flex-1 min-w-0">
                    {/* Solution badge */}
                    {post.isSolution && (
                      <div className="mb-2">
                        <span className="px-2 py-0.5 text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full">
                          Solution acceptee
                        </span>
                      </div>
                    )}

                    {/* Content */}
                    <div
                      className="prose prose-sm dark:prose-invert max-w-none"
                      dangerouslySetInnerHTML={{ __html: post.content }}
                    />

                    {/* Meta */}
                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
                        <span className="font-medium text-gray-700 dark:text-gray-300">
                          {post.authorLabel || truncateAddress(post.authorAddress)}
                        </span>
                        <span>•</span>
                        <span>
                          {formatDistanceToNow(new Date(post.createdAt), {
                            addSuffix: true,
                            locale: fr,
                          })}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Reply button */}
                        {isAuthenticated && !topic.isLocked && (
                          <button
                            onClick={() => setReplyingTo(post.id)}
                            className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline"
                          >
                            Repondre
                          </button>
                        )}

                        {/* Mark as solution (topic author only) */}
                        {isAuthor && !post.isSolution && !topic.isSolved && (
                          <button
                            onClick={() => handleMarkSolution(post.id)}
                            className="text-sm text-green-600 dark:text-green-400 hover:underline"
                          >
                            Marquer comme solution
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Reply Form */}
        {isAuthenticated && !topic.isLocked ? (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              {replyingTo ? 'Repondre au commentaire' : 'Ajouter une reponse'}
            </h3>

            {replyingTo && (
              <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Reponse au commentaire
                </span>
                <button
                  onClick={() => setReplyingTo(null)}
                  className="text-sm text-red-600 hover:underline"
                >
                  Annuler
                </button>
              </div>
            )}

            <form onSubmit={handleSubmitReply}>
              <RichTextEditor
                content={replyContent}
                onChange={(html, raw) => {
                  setReplyContent(html);
                  setReplyContentRaw(raw);
                }}
                placeholder="Partagez votre reponse..."
                minHeight="150px"
              />

              <div className="mt-4 flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting || !replyContentRaw.trim()}
                  className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition font-medium"
                >
                  {isSubmitting ? 'Publication...' : 'Publier'}
                </button>
              </div>
            </form>
          </div>
        ) : topic.isLocked ? (
          <div className="bg-gray-100 dark:bg-gray-800 rounded-xl p-6 text-center">
            <p className="text-gray-600 dark:text-gray-400">
              Ce topic est verrouille. Aucune nouvelle reponse n'est acceptee.
            </p>
          </div>
        ) : (
          <div className="bg-gray-100 dark:bg-gray-800 rounded-xl p-6 text-center">
            <p className="text-gray-600 dark:text-gray-400">
              <Link href="/" className="text-indigo-600 hover:underline">
                Connectez-vous
              </Link>{' '}
              pour repondre a ce topic.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Stockage local pour le forum decentralise
 * Utilise localStorage en mode mock, compatible avec IndexedDB futur
 */

import type {
  ForumCategory,
  ForumTopic,
  ForumPost,
  ForumNotification,
  ModerationAction,
  ForumUserReputation,
} from '../types';

// Cles de stockage
const STORAGE_KEYS = {
  TOPICS: '4nk-forum-topics',
  POSTS: '4nk-forum-posts',
  NOTIFICATIONS: '4nk-forum-notifications',
  MODERATION: '4nk-forum-moderation',
  REPUTATION: '4nk-forum-reputation',
} as const;

// Categories predefinis (statiques)
export const FORUM_CATEGORIES: ForumCategory[] = [
  {
    id: 'general',
    name: 'General',
    slug: 'general',
    description: 'Discussions generales sur Agoranodes et la gouvernance decentralisee',
    icon: '💬',
    topicCount: 0,
    postCount: 0,
  },
  {
    id: 'dev',
    name: 'Developpement',
    slug: 'dev',
    description: 'Questions techniques, contributions au code, et discussions de developpement',
    icon: '💻',
    topicCount: 0,
    postCount: 0,
  },
  {
    id: 'opis',
    name: 'OPIs',
    slug: 'opis',
    description: 'Discussions sur les OPIs (Ordinal Programmable Identities)',
    icon: '🔮',
    topicCount: 0,
    postCount: 0,
  },
  {
    id: 'trading',
    name: 'Trading',
    slug: 'trading',
    description: 'Discussions sur le trading, les marches et la finance decentralisee',
    icon: '📈',
    topicCount: 0,
    postCount: 0,
  },
  {
    id: 'off-topic',
    name: 'Off-Topic',
    slug: 'off-topic',
    description: 'Discussions libres, hors-sujet et communaute',
    icon: '🎲',
    topicCount: 0,
    postCount: 0,
  },
];

/**
 * Verifie si on est cote client
 */
function isClient(): boolean {
  return typeof window !== 'undefined';
}

/**
 * Recupere les donnees du localStorage
 */
function getStorageData<T>(key: string): T[] {
  if (!isClient()) return [];

  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error(`Failed to parse ${key}:`, error);
    return [];
  }
}

/**
 * Sauvegarde les donnees dans le localStorage
 */
function setStorageData<T>(key: string, data: T[]): void {
  if (!isClient()) return;

  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Failed to save ${key}:`, error);
  }
}

// ============================================================================
// TOPICS
// ============================================================================

/**
 * Recupere tous les topics
 */
export function getAllTopics(): ForumTopic[] {
  return getStorageData<ForumTopic>(STORAGE_KEYS.TOPICS);
}

/**
 * Recupere les topics d'une categorie
 */
export function getTopicsByCategory(categoryId: string): ForumTopic[] {
  return getAllTopics()
    .filter((t) => t.categoryId === categoryId && !t.isDeleted)
    .sort((a, b) => {
      // Epingles en premier
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      // Puis par derniere activite
      const aDate = a.lastReplyAt || a.createdAt;
      const bDate = b.lastReplyAt || b.createdAt;
      return new Date(bDate).getTime() - new Date(aDate).getTime();
    });
}

/**
 * Recupere un topic par ID
 */
export function getTopicById(topicId: string): ForumTopic | null {
  return getAllTopics().find((t) => t.id === topicId) || null;
}

/**
 * Sauvegarde un topic
 */
export function saveTopic(topic: ForumTopic): void {
  const topics = getAllTopics();
  const index = topics.findIndex((t) => t.id === topic.id);

  if (index >= 0) {
    topics[index] = topic;
  } else {
    topics.push(topic);
  }

  setStorageData(STORAGE_KEYS.TOPICS, topics);
}

/**
 * Supprime un topic (soft delete)
 */
export function deleteTopic(topicId: string): void {
  const topics = getAllTopics();
  const index = topics.findIndex((t) => t.id === topicId);

  if (index >= 0) {
    topics[index].isDeleted = true;
    setStorageData(STORAGE_KEYS.TOPICS, topics);
  }
}

// ============================================================================
// POSTS
// ============================================================================

/**
 * Recupere tous les posts
 */
export function getAllPosts(): ForumPost[] {
  return getStorageData<ForumPost>(STORAGE_KEYS.POSTS);
}

/**
 * Recupere les posts d'un topic
 */
export function getPostsByTopic(topicId: string): ForumPost[] {
  return getAllPosts()
    .filter((p) => p.topicId === topicId && !p.isDeleted)
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
}

/**
 * Recupere un post par ID
 */
export function getPostById(postId: string): ForumPost | null {
  return getAllPosts().find((p) => p.id === postId) || null;
}

/**
 * Sauvegarde un post
 */
export function savePost(post: ForumPost): void {
  const posts = getAllPosts();
  const index = posts.findIndex((p) => p.id === post.id);

  if (index >= 0) {
    posts[index] = post;
  } else {
    posts.push(post);
  }

  setStorageData(STORAGE_KEYS.POSTS, posts);
}

/**
 * Supprime un post (soft delete)
 */
export function deletePost(postId: string): void {
  const posts = getAllPosts();
  const index = posts.findIndex((p) => p.id === postId);

  if (index >= 0) {
    posts[index].isDeleted = true;
    setStorageData(STORAGE_KEYS.POSTS, posts);
  }
}

// ============================================================================
// NOTIFICATIONS
// ============================================================================

/**
 * Recupere toutes les notifications
 */
export function getAllNotifications(): ForumNotification[] {
  return getStorageData<ForumNotification>(STORAGE_KEYS.NOTIFICATIONS);
}

/**
 * Recupere les notifications d'un utilisateur
 */
export function getNotificationsForUser(userAddress: string): ForumNotification[] {
  return getAllNotifications()
    .filter((n) => n.recipientAddress === userAddress)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

/**
 * Compte les notifications non lues
 */
export function getUnreadNotificationCount(userAddress: string): number {
  return getNotificationsForUser(userAddress).filter((n) => !n.isRead).length;
}

/**
 * Sauvegarde une notification
 */
export function saveNotification(notification: ForumNotification): void {
  const notifications = getAllNotifications();
  notifications.push(notification);
  setStorageData(STORAGE_KEYS.NOTIFICATIONS, notifications);
}

/**
 * Marque une notification comme lue
 */
export function markNotificationAsRead(notificationId: string): void {
  const notifications = getAllNotifications();
  const index = notifications.findIndex((n) => n.id === notificationId);

  if (index >= 0) {
    notifications[index].isRead = true;
    setStorageData(STORAGE_KEYS.NOTIFICATIONS, notifications);
  }
}

/**
 * Marque toutes les notifications comme lues
 */
export function markAllNotificationsAsRead(userAddress: string): void {
  const notifications = getAllNotifications();
  notifications.forEach((n) => {
    if (n.recipientAddress === userAddress) {
      n.isRead = true;
    }
  });
  setStorageData(STORAGE_KEYS.NOTIFICATIONS, notifications);
}

// ============================================================================
// MODERATION
// ============================================================================

/**
 * Recupere toutes les actions de moderation
 */
export function getModerationActions(): ModerationAction[] {
  return getStorageData<ModerationAction>(STORAGE_KEYS.MODERATION);
}

/**
 * Sauvegarde une action de moderation
 */
export function saveModerationAction(action: ModerationAction): void {
  const actions = getModerationActions();
  actions.push(action);
  setStorageData(STORAGE_KEYS.MODERATION, actions);
}

// ============================================================================
// REPUTATION
// ============================================================================

/**
 * Recupere la reputation d'un utilisateur
 */
export function getUserReputation(userAddress: string): ForumUserReputation | null {
  const reputations = getStorageData<ForumUserReputation>(STORAGE_KEYS.REPUTATION);
  return reputations.find((r) => r.address === userAddress) || null;
}

/**
 * Sauvegarde la reputation d'un utilisateur
 */
export function saveUserReputation(reputation: ForumUserReputation): void {
  const reputations = getStorageData<ForumUserReputation>(STORAGE_KEYS.REPUTATION);
  const index = reputations.findIndex((r) => r.address === reputation.address);

  if (index >= 0) {
    reputations[index] = reputation;
  } else {
    reputations.push(reputation);
  }

  setStorageData(STORAGE_KEYS.REPUTATION, reputations);
}

// ============================================================================
// CATEGORIES (avec compteurs dynamiques)
// ============================================================================

/**
 * Recupere les categories avec compteurs mis a jour
 */
export function getCategoriesWithCounts(): ForumCategory[] {
  const topics = getAllTopics().filter((t) => !t.isDeleted);
  const posts = getAllPosts().filter((p) => !p.isDeleted);

  return FORUM_CATEGORIES.map((category) => {
    const categoryTopics = topics.filter((t) => t.categoryId === category.id);
    const categoryTopicIds = categoryTopics.map((t) => t.id);
    const categoryPosts = posts.filter((p) => categoryTopicIds.includes(p.topicId));

    return {
      ...category,
      topicCount: categoryTopics.length,
      postCount: categoryPosts.length,
    };
  });
}

/**
 * Recupere une categorie par slug
 */
export function getCategoryBySlug(slug: string): ForumCategory | null {
  return getCategoriesWithCounts().find((c) => c.slug === slug) || null;
}

/**
 * Gestionnaire du forum decentralise
 * Gere la creation, modification et suppression des topics et posts
 *
 * MODE MOCK : Stockage localStorage en attendant la sync on-chain
 */

import { getRelayClient } from '../relay/relay-client';
import {
  saveTopic,
  savePost,
  getTopicById,
  getPostById,
  getAllTopics,
  getPostsByTopic,
  saveNotification,
  getUserReputation,
  saveUserReputation,
} from './forum-storage';
import type {
  ForumTopic,
  ForumPost,
  ForumNotification,
  ForumUserReputation,
  CreateTopicParams,
  CreatePostParams,
  User,
} from '../types';

/**
 * Genere un ID unique
 */
function generateId(prefix: string): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Genere un slug a partir d'un titre
 */
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Supprimer les accents
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .substring(0, 50);
}

/**
 * Genere une signature mock (sera remplacee par une vraie signature Schnorr)
 */
function generateMockSignature(): string {
  return `sig_mock_${Math.random().toString(36).substring(2)}`;
}

/**
 * Extrait les mentions (@user) d'un texte
 */
export function extractMentions(content: string): string[] {
  const mentionRegex = /@([a-zA-Z0-9_]+)/g;
  const matches = content.match(mentionRegex);
  return matches ? matches.map((m) => m.substring(1)) : [];
}

// ============================================================================
// TOPICS
// ============================================================================

/**
 * Cree un nouveau topic
 */
export async function createTopic(
  params: CreateTopicParams,
  author: User
): Promise<ForumTopic> {
  console.log('[MOCK] Creating topic:', params.title);

  const topicId = generateId('topic');
  const slug = generateSlug(params.title);

  const topic: ForumTopic = {
    id: topicId,
    categoryId: params.categoryId,
    title: params.title,
    slug,
    authorAddress: author.mainAddress,
    authorLabel: author.label,
    content: params.content,
    contentRaw: params.contentRaw,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    replyCount: 0,
    voteScore: 0,
    upvotes: [],
    downvotes: [],
    isPinned: false,
    isLocked: false,
    isSolved: false,
    isDeleted: false,
    tags: params.tags || [],
    signature: generateMockSignature(),
  };

  saveTopic(topic);

  // Mettre a jour la reputation
  updateUserReputation(author.mainAddress, author.label, { topicCreated: true });

  // Notifier via relay
  const relay = getRelayClient();
  relay.send({
    flag: 'TopicCreated',
    content: JSON.stringify({
      topic_id: topicId,
      category_id: params.categoryId,
      title: params.title,
      author: author.mainAddress,
    }),
    timestamp: Date.now(),
  });

  console.log('Topic created:', topicId);
  return topic;
}

/**
 * Met a jour un topic
 */
export async function updateTopic(
  topicId: string,
  updates: Partial<Pick<ForumTopic, 'title' | 'content' | 'contentRaw' | 'tags'>>,
  editor: User
): Promise<ForumTopic> {
  const topic = getTopicById(topicId);
  if (!topic) {
    throw new Error('Topic not found');
  }

  if (topic.authorAddress !== editor.mainAddress) {
    throw new Error('Only the author can edit this topic');
  }

  if (topic.isLocked) {
    throw new Error('This topic is locked');
  }

  const updatedTopic: ForumTopic = {
    ...topic,
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  saveTopic(updatedTopic);

  console.log('Topic updated:', topicId);
  return updatedTopic;
}

/**
 * Vote sur un topic
 */
export async function voteOnTopic(
  topicId: string,
  voteType: 'up' | 'down',
  voter: User
): Promise<ForumTopic> {
  const topic = getTopicById(topicId);
  if (!topic) {
    throw new Error('Topic not found');
  }

  // Retirer le vote existant s'il y en a un
  const hadUpvote = topic.upvotes.includes(voter.mainAddress);
  const hadDownvote = topic.downvotes.includes(voter.mainAddress);

  topic.upvotes = topic.upvotes.filter((a) => a !== voter.mainAddress);
  topic.downvotes = topic.downvotes.filter((a) => a !== voter.mainAddress);

  // Ajouter le nouveau vote (toggle si meme vote)
  if (voteType === 'up' && !hadUpvote) {
    topic.upvotes.push(voter.mainAddress);
  } else if (voteType === 'down' && !hadDownvote) {
    topic.downvotes.push(voter.mainAddress);
  }

  topic.voteScore = topic.upvotes.length - topic.downvotes.length;
  saveTopic(topic);

  // Notification si upvote sur le contenu d'un autre
  if (voteType === 'up' && topic.authorAddress !== voter.mainAddress) {
    createNotification({
      recipientAddress: topic.authorAddress,
      type: 'vote',
      topicId: topic.id,
      topicTitle: topic.title,
      actorAddress: voter.mainAddress,
      actorLabel: voter.label,
      preview: `a upvote votre topic "${topic.title}"`,
    });

    // Reputation
    updateUserReputation(topic.authorAddress, topic.authorLabel, { upvoteReceived: true });
  }

  return topic;
}

// ============================================================================
// POSTS
// ============================================================================

/**
 * Cree un nouveau post (reponse)
 */
export async function createPost(
  params: CreatePostParams,
  author: User
): Promise<ForumPost> {
  console.log('[MOCK] Creating post for topic:', params.topicId);

  const topic = getTopicById(params.topicId);
  if (!topic) {
    throw new Error('Topic not found');
  }

  if (topic.isLocked) {
    throw new Error('This topic is locked');
  }

  const postId = generateId('post');
  const mentions = params.mentions || extractMentions(params.contentRaw);

  const post: ForumPost = {
    id: postId,
    topicId: params.topicId,
    parentPostId: params.parentPostId,
    authorAddress: author.mainAddress,
    authorLabel: author.label,
    content: params.content,
    contentRaw: params.contentRaw,
    createdAt: new Date().toISOString(),
    voteScore: 0,
    upvotes: [],
    downvotes: [],
    isDeleted: false,
    isSolution: false,
    mentions,
    signature: generateMockSignature(),
  };

  savePost(post);

  // Mettre a jour le topic
  topic.replyCount += 1;
  topic.lastReplyAt = post.createdAt;
  topic.lastReplyBy = author.mainAddress;
  saveTopic(topic);

  // Reputation
  updateUserReputation(author.mainAddress, author.label, { postCreated: true });

  // Notifications
  // 1. Notifier l'auteur du topic
  if (topic.authorAddress !== author.mainAddress) {
    createNotification({
      recipientAddress: topic.authorAddress,
      type: 'reply',
      topicId: topic.id,
      topicTitle: topic.title,
      postId: post.id,
      actorAddress: author.mainAddress,
      actorLabel: author.label,
      preview: post.contentRaw.substring(0, 100),
    });
  }

  // 2. Notifier si c'est une reponse a un autre post
  if (params.parentPostId) {
    const parentPost = getPostById(params.parentPostId);
    if (parentPost && parentPost.authorAddress !== author.mainAddress) {
      createNotification({
        recipientAddress: parentPost.authorAddress,
        type: 'reply',
        topicId: topic.id,
        topicTitle: topic.title,
        postId: post.id,
        actorAddress: author.mainAddress,
        actorLabel: author.label,
        preview: post.contentRaw.substring(0, 100),
      });
    }
  }

  // 3. Notifier les mentions
  // Note: Dans un vrai systeme, on resoudrait les labels vers les addresses
  // Ici on simplifie en assumant que les mentions sont des labels

  // Relay
  const relay = getRelayClient();
  relay.send({
    flag: 'PostCreated',
    content: JSON.stringify({
      post_id: postId,
      topic_id: params.topicId,
      author: author.mainAddress,
      has_parent: !!params.parentPostId,
    }),
    timestamp: Date.now(),
  });

  console.log('Post created:', postId);
  return post;
}

/**
 * Met a jour un post
 */
export async function updatePost(
  postId: string,
  updates: Partial<Pick<ForumPost, 'content' | 'contentRaw'>>,
  editor: User
): Promise<ForumPost> {
  const post = getPostById(postId);
  if (!post) {
    throw new Error('Post not found');
  }

  if (post.authorAddress !== editor.mainAddress) {
    throw new Error('Only the author can edit this post');
  }

  const topic = getTopicById(post.topicId);
  if (topic?.isLocked) {
    throw new Error('This topic is locked');
  }

  const updatedPost: ForumPost = {
    ...post,
    ...updates,
    updatedAt: new Date().toISOString(),
    mentions: updates.contentRaw ? extractMentions(updates.contentRaw) : post.mentions,
  };

  savePost(updatedPost);

  console.log('Post updated:', postId);
  return updatedPost;
}

/**
 * Vote sur un post
 */
export async function voteOnPost(
  postId: string,
  voteType: 'up' | 'down',
  voter: User
): Promise<ForumPost> {
  const post = getPostById(postId);
  if (!post) {
    throw new Error('Post not found');
  }

  // Retirer le vote existant
  const hadUpvote = post.upvotes.includes(voter.mainAddress);
  const hadDownvote = post.downvotes.includes(voter.mainAddress);

  post.upvotes = post.upvotes.filter((a) => a !== voter.mainAddress);
  post.downvotes = post.downvotes.filter((a) => a !== voter.mainAddress);

  // Ajouter le nouveau vote (toggle si meme vote)
  if (voteType === 'up' && !hadUpvote) {
    post.upvotes.push(voter.mainAddress);
  } else if (voteType === 'down' && !hadDownvote) {
    post.downvotes.push(voter.mainAddress);
  }

  post.voteScore = post.upvotes.length - post.downvotes.length;
  savePost(post);

  // Notification si upvote
  if (voteType === 'up' && post.authorAddress !== voter.mainAddress) {
    const topic = getTopicById(post.topicId);
    createNotification({
      recipientAddress: post.authorAddress,
      type: 'vote',
      topicId: post.topicId,
      topicTitle: topic?.title || 'Topic',
      postId: post.id,
      actorAddress: voter.mainAddress,
      actorLabel: voter.label,
      preview: `a upvote votre reponse`,
    });

    // Reputation
    updateUserReputation(post.authorAddress, post.authorLabel, { upvoteReceived: true });
  }

  return post;
}

/**
 * Marque un post comme solution
 */
export async function markAsSolution(
  postId: string,
  topicAuthor: User
): Promise<{ post: ForumPost; topic: ForumTopic }> {
  const post = getPostById(postId);
  if (!post) {
    throw new Error('Post not found');
  }

  const topic = getTopicById(post.topicId);
  if (!topic) {
    throw new Error('Topic not found');
  }

  if (topic.authorAddress !== topicAuthor.mainAddress) {
    throw new Error('Only the topic author can mark a solution');
  }

  // Retirer la solution precedente s'il y en a une
  const posts = getPostsByTopic(topic.id);
  posts.forEach((p) => {
    if (p.isSolution && p.id !== postId) {
      p.isSolution = false;
      savePost(p);
    }
  });

  // Marquer le nouveau post comme solution
  post.isSolution = true;
  savePost(post);

  // Marquer le topic comme resolu
  topic.isSolved = true;
  saveTopic(topic);

  // Notification
  if (post.authorAddress !== topicAuthor.mainAddress) {
    createNotification({
      recipientAddress: post.authorAddress,
      type: 'solution',
      topicId: topic.id,
      topicTitle: topic.title,
      postId: post.id,
      actorAddress: topicAuthor.mainAddress,
      actorLabel: topicAuthor.label,
      preview: `Votre reponse a ete marquee comme solution!`,
    });

    // Bonus reputation
    updateUserReputation(post.authorAddress, post.authorLabel, { solutionMarked: true });
  }

  return { post, topic };
}

// ============================================================================
// NOTIFICATIONS
// ============================================================================

/**
 * Cree une notification
 */
function createNotification(params: {
  recipientAddress: string;
  type: 'mention' | 'reply' | 'vote' | 'solution';
  topicId: string;
  topicTitle: string;
  postId?: string;
  actorAddress: string;
  actorLabel: string;
  preview: string;
}): void {
  const notification: ForumNotification = {
    id: generateId('notif'),
    recipientAddress: params.recipientAddress,
    type: params.type,
    topicId: params.topicId,
    topicTitle: params.topicTitle,
    postId: params.postId,
    actorAddress: params.actorAddress,
    actorLabel: params.actorLabel,
    preview: params.preview,
    isRead: false,
    createdAt: new Date().toISOString(),
  };

  saveNotification(notification);
}

// ============================================================================
// REPUTATION
// ============================================================================

/**
 * Met a jour la reputation d'un utilisateur
 */
function updateUserReputation(
  address: string,
  label: string,
  action: {
    topicCreated?: boolean;
    postCreated?: boolean;
    upvoteReceived?: boolean;
    downvoteReceived?: boolean;
    solutionMarked?: boolean;
  }
): void {
  let reputation = getUserReputation(address);

  if (!reputation) {
    reputation = {
      address,
      label,
      totalPosts: 0,
      totalTopics: 0,
      totalUpvotes: 0,
      totalDownvotes: 0,
      reputationScore: 0,
      isBanned: false,
    };
  }

  // Mise a jour des compteurs
  if (action.topicCreated) reputation.totalTopics += 1;
  if (action.postCreated) reputation.totalPosts += 1;
  if (action.upvoteReceived) reputation.totalUpvotes += 1;
  if (action.downvoteReceived) reputation.totalDownvotes += 1;

  // Calcul du score de reputation
  // Topics: +5, Posts: +2, Upvotes: +10, Downvotes: -5, Solution: +25
  reputation.reputationScore =
    reputation.totalTopics * 5 +
    reputation.totalPosts * 2 +
    reputation.totalUpvotes * 10 -
    reputation.totalDownvotes * 5 +
    (action.solutionMarked ? 25 : 0);

  saveUserReputation(reputation);
}

// ============================================================================
// RECHERCHE
// ============================================================================

/**
 * Recherche dans les topics et posts
 */
export function searchForum(query: string): {
  topics: ForumTopic[];
  posts: ForumPost[];
} {
  const normalizedQuery = query.toLowerCase().trim();

  if (!normalizedQuery) {
    return { topics: [], posts: [] };
  }

  const topics = getAllTopics().filter(
    (t) =>
      !t.isDeleted &&
      (t.title.toLowerCase().includes(normalizedQuery) ||
        t.contentRaw.toLowerCase().includes(normalizedQuery) ||
        t.tags.some((tag) => tag.toLowerCase().includes(normalizedQuery)))
  );

  const posts = getPostsByTopic('').filter(
    (p) =>
      !p.isDeleted && p.contentRaw.toLowerCase().includes(normalizedQuery)
  );

  // Trier par pertinence (simple: titre > contenu > tags)
  topics.sort((a, b) => {
    const aInTitle = a.title.toLowerCase().includes(normalizedQuery);
    const bInTitle = b.title.toLowerCase().includes(normalizedQuery);
    if (aInTitle && !bInTitle) return -1;
    if (!aInTitle && bInTitle) return 1;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return { topics: topics.slice(0, 20), posts: posts.slice(0, 20) };
}

/**
 * Recherche globale (retourne tous les posts pour la recherche)
 */
export function searchAllPosts(query: string): ForumPost[] {
  const normalizedQuery = query.toLowerCase().trim();
  if (!normalizedQuery) return [];

  const allPosts = getAllTopics()
    .filter((t) => !t.isDeleted)
    .flatMap((topic) =>
      getPostsByTopic(topic.id).filter(
        (p) =>
          !p.isDeleted && p.contentRaw.toLowerCase().includes(normalizedQuery)
      )
    );

  return allPosts.slice(0, 50);
}

// ============================================================================
// STATS
// ============================================================================

/**
 * Recupere les statistiques du forum
 */
export function getForumStats(): {
  totalTopics: number;
  totalPosts: number;
  totalUsers: number;
} {
  const topics = getAllTopics().filter((t) => !t.isDeleted);
  const posts: ForumPost[] = [];
  const users = new Set<string>();

  topics.forEach((topic) => {
    users.add(topic.authorAddress);
    const topicPosts = getPostsByTopic(topic.id);
    posts.push(...topicPosts);
    topicPosts.forEach((p) => users.add(p.authorAddress));
  });

  return {
    totalTopics: topics.length,
    totalPosts: posts.length,
    totalUsers: users.size,
  };
}

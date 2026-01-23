/**
 * Systeme de moderation decentralisee
 * Toutes les actions sont signees et auditables
 */

import { getRelayClient } from '../relay/relay-client';
import {
  getTopicById,
  getPostById,
  saveTopic,
  savePost,
  saveModerationAction,
  getUserReputation,
  saveUserReputation,
} from './forum-storage';
import type { ForumTopic, ForumPost, ModerationAction, User } from '../types';

// Adresses des moderateurs (mock - en production, ce serait on-chain)
const MODERATOR_ADDRESSES = [
  // TODO: Ajouter les vraies adresses des moderateurs
];

/**
 * Verifie si un utilisateur est moderateur
 */
export function isModerator(userAddress: string): boolean {
  // En mode dev, tout le monde peut moderer
  // En production, verifier la liste des moderateurs
  return true; // MODERATOR_ADDRESSES.includes(userAddress);
}

/**
 * Genere un ID unique
 */
function generateId(prefix: string): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Genere une signature mock
 */
function generateMockSignature(): string {
  return `modsig_${Math.random().toString(36).substring(2)}`;
}

/**
 * Enregistre une action de moderation
 */
function logModerationAction(
  type: ModerationAction['type'],
  targetId: string,
  targetType: 'topic' | 'post' | 'user',
  moderator: User,
  reason: string
): ModerationAction {
  const action: ModerationAction = {
    id: generateId('mod'),
    type,
    targetId,
    targetType,
    moderatorAddress: moderator.mainAddress,
    reason,
    createdAt: new Date().toISOString(),
    signature: generateMockSignature(),
  };

  saveModerationAction(action);

  // Notifier via relay
  const relay = getRelayClient();
  relay.send({
    flag: 'ModerationAction',
    content: JSON.stringify({
      action_id: action.id,
      type: action.type,
      target_id: targetId,
      moderator: moderator.mainAddress,
    }),
    timestamp: Date.now(),
  });

  return action;
}

// ============================================================================
// ACTIONS SUR LES TOPICS
// ============================================================================

/**
 * Epingle un topic
 */
export async function pinTopic(
  topicId: string,
  moderator: User,
  reason?: string
): Promise<ForumTopic> {
  if (!isModerator(moderator.mainAddress)) {
    throw new Error('Not authorized');
  }

  const topic = getTopicById(topicId);
  if (!topic) {
    throw new Error('Topic not found');
  }

  topic.isPinned = true;
  saveTopic(topic);

  logModerationAction('pin_topic', topicId, 'topic', moderator, reason || 'Topic epingle');

  console.log('Topic pinned:', topicId);
  return topic;
}

/**
 * Desepingle un topic
 */
export async function unpinTopic(
  topicId: string,
  moderator: User,
  reason?: string
): Promise<ForumTopic> {
  if (!isModerator(moderator.mainAddress)) {
    throw new Error('Not authorized');
  }

  const topic = getTopicById(topicId);
  if (!topic) {
    throw new Error('Topic not found');
  }

  topic.isPinned = false;
  saveTopic(topic);

  logModerationAction('unpin_topic', topicId, 'topic', moderator, reason || 'Topic desepingle');

  console.log('Topic unpinned:', topicId);
  return topic;
}

/**
 * Verrouille un topic
 */
export async function lockTopic(
  topicId: string,
  moderator: User,
  reason: string
): Promise<ForumTopic> {
  if (!isModerator(moderator.mainAddress)) {
    throw new Error('Not authorized');
  }

  const topic = getTopicById(topicId);
  if (!topic) {
    throw new Error('Topic not found');
  }

  topic.isLocked = true;
  saveTopic(topic);

  logModerationAction('lock_topic', topicId, 'topic', moderator, reason);

  console.log('Topic locked:', topicId);
  return topic;
}

/**
 * Deverrouille un topic
 */
export async function unlockTopic(
  topicId: string,
  moderator: User,
  reason?: string
): Promise<ForumTopic> {
  if (!isModerator(moderator.mainAddress)) {
    throw new Error('Not authorized');
  }

  const topic = getTopicById(topicId);
  if (!topic) {
    throw new Error('Topic not found');
  }

  topic.isLocked = false;
  saveTopic(topic);

  logModerationAction('unlock_topic', topicId, 'topic', moderator, reason || 'Topic deverrouille');

  console.log('Topic unlocked:', topicId);
  return topic;
}

/**
 * Supprime un topic (soft delete)
 */
export async function deleteTopic(
  topicId: string,
  moderator: User,
  reason: string
): Promise<ForumTopic> {
  if (!isModerator(moderator.mainAddress)) {
    throw new Error('Not authorized');
  }

  const topic = getTopicById(topicId);
  if (!topic) {
    throw new Error('Topic not found');
  }

  topic.isDeleted = true;
  saveTopic(topic);

  logModerationAction('delete_topic', topicId, 'topic', moderator, reason);

  console.log('Topic deleted:', topicId);
  return topic;
}

// ============================================================================
// ACTIONS SUR LES POSTS
// ============================================================================

/**
 * Supprime un post (soft delete)
 */
export async function deletePost(
  postId: string,
  moderator: User,
  reason: string
): Promise<ForumPost> {
  if (!isModerator(moderator.mainAddress)) {
    throw new Error('Not authorized');
  }

  const post = getPostById(postId);
  if (!post) {
    throw new Error('Post not found');
  }

  post.isDeleted = true;
  savePost(post);

  logModerationAction('delete_post', postId, 'post', moderator, reason);

  console.log('Post deleted:', postId);
  return post;
}

// ============================================================================
// ACTIONS SUR LES UTILISATEURS
// ============================================================================

/**
 * Bannit un utilisateur
 */
export async function banUser(
  userAddress: string,
  moderator: User,
  reason: string,
  durationDays?: number
): Promise<void> {
  if (!isModerator(moderator.mainAddress)) {
    throw new Error('Not authorized');
  }

  let reputation = getUserReputation(userAddress);

  if (!reputation) {
    reputation = {
      address: userAddress,
      label: 'Unknown',
      totalPosts: 0,
      totalTopics: 0,
      totalUpvotes: 0,
      totalDownvotes: 0,
      reputationScore: 0,
      isBanned: false,
    };
  }

  reputation.isBanned = true;

  if (durationDays) {
    const bannedUntil = new Date();
    bannedUntil.setDate(bannedUntil.getDate() + durationDays);
    reputation.bannedUntil = bannedUntil.toISOString();
  }

  saveUserReputation(reputation);

  logModerationAction('ban_user', userAddress, 'user', moderator, reason);

  console.log('User banned:', userAddress);
}

/**
 * Debanit un utilisateur
 */
export async function unbanUser(
  userAddress: string,
  moderator: User,
  reason?: string
): Promise<void> {
  if (!isModerator(moderator.mainAddress)) {
    throw new Error('Not authorized');
  }

  const reputation = getUserReputation(userAddress);

  if (reputation) {
    reputation.isBanned = false;
    reputation.bannedUntil = undefined;
    saveUserReputation(reputation);
  }

  console.log('User unbanned:', userAddress);
}

/**
 * Verifie si un utilisateur est banni
 */
export function isUserBanned(userAddress: string): boolean {
  const reputation = getUserReputation(userAddress);

  if (!reputation || !reputation.isBanned) {
    return false;
  }

  // Verifier si le ban a expire
  if (reputation.bannedUntil) {
    const bannedUntil = new Date(reputation.bannedUntil);
    if (new Date() > bannedUntil) {
      // Le ban a expire, mettre a jour
      reputation.isBanned = false;
      reputation.bannedUntil = undefined;
      saveUserReputation(reputation);
      return false;
    }
  }

  return true;
}

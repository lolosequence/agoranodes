/**
 * Module Forum Decentralise
 * Export de toutes les fonctionnalites du forum
 */

// Storage
export {
  FORUM_CATEGORIES,
  getAllTopics,
  getTopicsByCategory,
  getTopicById,
  saveTopic,
  deleteTopic,
  getAllPosts,
  getPostsByTopic,
  getPostById,
  savePost,
  deletePost,
  getAllNotifications,
  getNotificationsForUser,
  getUnreadNotificationCount,
  saveNotification,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  getModerationActions,
  saveModerationAction,
  getUserReputation,
  saveUserReputation,
  getCategoriesWithCounts,
  getCategoryBySlug,
} from './forum-storage';

// Manager
export {
  createTopic,
  updateTopic,
  voteOnTopic,
  createPost,
  updatePost,
  voteOnPost,
  markAsSolution,
  extractMentions,
  searchForum,
  searchAllPosts,
  getForumStats,
} from './forum-manager';

// Moderation
export {
  isModerator,
  pinTopic,
  unpinTopic,
  lockTopic,
  unlockTopic,
  deleteTopic as moderateDeleteTopic,
  deletePost as moderateDeletePost,
  banUser,
  unbanUser,
  isUserBanned,
} from './forum-moderation';

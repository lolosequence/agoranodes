/**
 * Types TypeScript pour l'intégration 4NK
 * Ces types correspondent aux fonctions du module WASM (mock ou réel)
 */

// Type de base pour les erreurs WASM
export interface WasmError {
  message: string;
}

// Types pour l'authentification
export interface User {
  mainAddress: string;
  recoverAddress: string;
  recoveryPhrase: string;
  label: string;
  createdAt: string;
}

// Types pour les processus
export interface Process {
  id: string;
  title: string;
  description: string;
  status: 'active' | 'pending' | 'completed' | 'archived';
  participantsCount: number;
}

// Types pour les messages réseau
export interface CachedMessage {
  id: number;
  flag: string;
  content: string;
  status?: string;
}

// Types pour les UTXOs
export interface Outpoint {
  txid: string;
  vout: number;
  amount: number;
  status: 'unspent' | 'spent';
}

// Types pour le chiffrement
export interface EncryptionResult {
  cipher: string;
  key: string;
}

// Configuration du réseau
export type Network = 'testnet' | 'mainnet';

export interface Config4NK {
  network: Network;
  relayUrl: string;
  storageUrl: string;
}

// Interface du module WASM
export interface WasmModule {
  setup(): void;
  create_user(password: string, label?: string): string;
  login_user(user_password: string, pre_id: string): string;
  get_main_address(): string;
  get_recover_address(): string;
  get_processes(): string;
  parse_network_msg(raw: string, fee_rate: number): string;
  encrypt_with_key(plaintext: string, key: string): string;
  encrypt_with_new_key(plaintext: string): string;
  try_decrypt_with_key(cipher: string, key: string): string;
  create_faucet_msg(): string;
  get_outpoints_for_user(): string;
  get_available_amount_for_user(recover: boolean): number;
  is_tx_owned_by_user(pre_id: string, tx: string): boolean;
}

// ============================================================================
// TYPES POUR LE SYSTÈME DE VOTES
// ============================================================================

/**
 * Rôle dans un processus de vote
 */
export interface VoteRole {
  name: string;
  members: string[]; // Adresses des membres
  quorum: number; // 0.0 à 1.0 (ex: 0.5 = 50%)
  permissions: string[]; // Champs modifiables
}

/**
 * Option de vote
 */
export interface VoteOption {
  id: string;
  label: string;
  description?: string;
}

/**
 * Vote individuel
 */
export interface IndividualVote {
  voter_address: string;
  voter_label: string;
  option_id: string;
  timestamp: number;
  signature?: string;
}

/**
 * Résultats d'un vote
 */
export interface VoteResults {
  [option_id: string]: {
    count: number;
    percentage: number;
    voters: string[];
  };
}

/**
 * Processus de vote complet
 */
export interface VoteProcess {
  id: string;
  title: string;
  description: string;
  creator: string;

  // Options de vote
  options: VoteOption[];

  // Participants et rôles
  voters: string[]; // Adresses autorisées à voter
  roles: VoteRole[];

  // Votes collectés
  votes: IndividualVote[];

  // Configuration
  quorum_required: number; // 0.0 à 1.0
  is_private: boolean; // Votes chiffrés ou publics
  allow_abstention: boolean;

  // Dates
  created_at: string;
  starts_at?: string;
  ends_at?: string;

  // État
  status: 'draft' | 'active' | 'closed' | 'archived';

  // Résultats
  results?: VoteResults;
  quorum_reached: boolean;
  total_votes: number;
}

/**
 * Paramètres de création d'un vote
 */
export interface CreateVoteParams {
  title: string;
  description: string;
  options: Array<{ label: string; description?: string }>;
  voters: string[];
  quorum_required?: number;
  is_private?: boolean;
  allow_abstention?: boolean;
  ends_at?: string;
}

/**
 * Résultat de validation d'un vote
 */
export interface VoteValidationResult {
  isValid: boolean;
  quorumReached: boolean;
  quorumPercentage: number;
  requiredVotes: number;
  actualVotes: number;
  missingVotes: number;
  errors: string[];
}

// ============================================================================
// TYPES POUR LE FORUM DECENTRALISE
// ============================================================================

/**
 * Categorie de forum (predefini)
 */
export interface ForumCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  topicCount: number;
  postCount: number;
}

/**
 * Topic de forum
 */
export interface ForumTopic {
  id: string;
  categoryId: string;
  title: string;
  slug: string;
  authorAddress: string;
  authorLabel: string;
  content: string;        // HTML rendu
  contentRaw: string;     // Markdown source
  createdAt: string;
  updatedAt: string;
  replyCount: number;
  voteScore: number;
  upvotes: string[];
  downvotes: string[];
  isPinned: boolean;
  isLocked: boolean;
  isSolved: boolean;
  isDeleted: boolean;
  tags: string[];
  signature: string;
  lastReplyAt?: string;
  lastReplyBy?: string;
}

/**
 * Post/Reponse de forum
 */
export interface ForumPost {
  id: string;
  topicId: string;
  parentPostId?: string;  // Reponses imbriquees
  authorAddress: string;
  authorLabel: string;
  content: string;
  contentRaw: string;
  createdAt: string;
  updatedAt?: string;
  voteScore: number;
  upvotes: string[];
  downvotes: string[];
  isDeleted: boolean;
  isSolution: boolean;
  mentions: string[];
  signature: string;
  replyCount?: number;
}

/**
 * Notification de forum
 */
export interface ForumNotification {
  id: string;
  recipientAddress: string;
  type: 'mention' | 'reply' | 'vote' | 'solution';
  topicId: string;
  topicTitle: string;
  postId?: string;
  actorAddress: string;
  actorLabel: string;
  preview: string;
  isRead: boolean;
  createdAt: string;
}

/**
 * Action de moderation
 */
export interface ModerationAction {
  id: string;
  type: 'delete_topic' | 'delete_post' | 'lock_topic' | 'unlock_topic' | 'pin_topic' | 'unpin_topic' | 'ban_user';
  targetId: string;
  targetType: 'topic' | 'post' | 'user';
  moderatorAddress: string;
  reason: string;
  createdAt: string;
  signature: string;
}

/**
 * Reputation utilisateur forum
 */
export interface ForumUserReputation {
  address: string;
  label: string;
  totalPosts: number;
  totalTopics: number;
  totalUpvotes: number;
  totalDownvotes: number;
  reputationScore: number;
  isBanned: boolean;
  bannedUntil?: string;
}

/**
 * Parametres de creation d'un topic
 */
export interface CreateTopicParams {
  categoryId: string;
  title: string;
  content: string;
  contentRaw: string;
  tags?: string[];
}

/**
 * Parametres de creation d'un post
 */
export interface CreatePostParams {
  topicId: string;
  parentPostId?: string;
  content: string;
  contentRaw: string;
  mentions?: string[];
}

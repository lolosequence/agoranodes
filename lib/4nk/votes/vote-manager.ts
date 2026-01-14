/**
 * Gestionnaire de votes 4NK
 * Gère la création, la participation et la validation des votes on-chain
 *
 * ⚠️ MODE MOCK : Simulation en attendant l'implémentation complète du WASM
 */

import { getRelayClient } from '../relay/relay-client';
import type {
  VoteProcess,
  CreateVoteParams,
  VoteOption,
  IndividualVote,
  VoteResults,
  User,
} from '../types';

/**
 * Stockage local des votes (mock)
 * En production, cela serait sur la blockchain Bitcoin
 */
const VOTES_STORAGE_KEY = '4nk-votes';

/**
 * Crée un nouveau processus de vote
 */
export async function createVote(
  params: CreateVoteParams,
  creator: User
): Promise<VoteProcess> {
  console.log('🔧 [MOCK] Creating vote:', params.title);

  // Générer un ID unique
  const voteId = `vote_${Date.now()}_${Math.random().toString(36).substring(7)}`;

  // Créer les options avec IDs
  const options: VoteOption[] = params.options.map((opt, index) => ({
    id: `option_${index}`,
    label: opt.label,
    description: opt.description,
  }));

  // Ajouter l'option abstention si activée
  if (params.allow_abstention) {
    options.push({
      id: 'abstention',
      label: 'Abstention',
      description: 'Je m\'abstiens de voter',
    });
  }

  const vote: VoteProcess = {
    id: voteId,
    title: params.title,
    description: params.description,
    creator: creator.mainAddress,
    options,
    voters: params.voters,
    roles: [
      {
        name: 'voter',
        members: params.voters,
        quorum: params.quorum_required || 0.5,
        permissions: ['vote'],
      },
      {
        name: 'admin',
        members: [creator.mainAddress],
        quorum: 1.0,
        permissions: ['title', 'description', 'status'],
      },
    ],
    votes: [],
    quorum_required: params.quorum_required || 0.5,
    is_private: params.is_private || false,
    allow_abstention: params.allow_abstention || false,
    created_at: new Date().toISOString(),
    ends_at: params.ends_at,
    status: 'active',
    quorum_reached: false,
    total_votes: 0,
  };

  // Sauvegarder
  saveVote(vote);

  // Notifier via relay
  const relay = getRelayClient();
  relay.send({
    flag: 'VoteCreated',
    content: JSON.stringify({
      vote_id: voteId,
      title: params.title,
      creator: creator.mainAddress,
      voters: params.voters,
    }),
    timestamp: Date.now(),
  });

  console.log('✅ Vote created:', voteId);
  return vote;
}

/**
 * Soumet un vote
 */
export async function submitVote(
  voteId: string,
  optionId: string,
  voter: User
): Promise<VoteProcess> {
  console.log('🔧 [MOCK] Submitting vote:', { voteId, optionId, voter: voter.mainAddress });

  const vote = loadVote(voteId);
  if (!vote) {
    throw new Error('Vote not found');
  }

  // Vérifications
  if (vote.status !== 'active') {
    throw new Error('Vote is not active');
  }

  if (!vote.voters.includes(voter.mainAddress)) {
    throw new Error('You are not authorized to vote');
  }

  // Vérifier si déjà voté
  const existingVote = vote.votes.find((v) => v.voter_address === voter.mainAddress);
  if (existingVote) {
    throw new Error('You have already voted');
  }

  // Vérifier que l'option existe
  if (!vote.options.find((o) => o.id === optionId)) {
    throw new Error('Invalid option');
  }

  // Créer le vote individuel
  const individualVote: IndividualVote = {
    voter_address: voter.mainAddress,
    voter_label: voter.label,
    option_id: optionId,
    timestamp: Date.now(),
    // En production: signature Schnorr
    signature: `mock_signature_${Math.random().toString(36)}`,
  };

  // Ajouter le vote
  vote.votes.push(individualVote);
  vote.total_votes = vote.votes.length;

  // Calculer les résultats
  vote.results = calculateResults(vote);

  // Vérifier le quorum
  vote.quorum_reached = vote.total_votes >= vote.voters.length * vote.quorum_required;

  // Fermer automatiquement si quorum atteint et pas de date de fin
  if (vote.quorum_reached && !vote.ends_at) {
    vote.status = 'closed';
  }

  // Sauvegarder
  saveVote(vote);

  // Notifier via relay
  const relay = getRelayClient();
  relay.send({
    flag: 'VoteSubmitted',
    content: JSON.stringify({
      vote_id: voteId,
      voter: voter.mainAddress,
      option_id: optionId,
      total_votes: vote.total_votes,
      quorum_reached: vote.quorum_reached,
    }),
    timestamp: Date.now(),
  });

  console.log('✅ Vote submitted');
  return vote;
}

/**
 * Calcule les résultats d'un vote
 */
export function calculateResults(vote: VoteProcess): VoteResults {
  const results: VoteResults = {};

  // Initialiser tous les compteurs
  vote.options.forEach((option) => {
    results[option.id] = {
      count: 0,
      percentage: 0,
      voters: [],
    };
  });

  // Compter les votes
  vote.votes.forEach((individualVote) => {
    const optionId = individualVote.option_id;
    if (results[optionId]) {
      results[optionId].count++;
      results[optionId].voters.push(individualVote.voter_address);
    }
  });

  // Calculer les pourcentages
  const totalVotes = vote.votes.length;
  Object.keys(results).forEach((optionId) => {
    results[optionId].percentage =
      totalVotes > 0 ? (results[optionId].count / totalVotes) * 100 : 0;
  });

  return results;
}

/**
 * Récupère un vote par ID
 */
export function loadVote(voteId: string): VoteProcess | null {
  const votes = getAllVotes();
  return votes.find((v) => v.id === voteId) || null;
}

/**
 * Récupère tous les votes
 */
export function getAllVotes(): VoteProcess[] {
  if (typeof window === 'undefined') {
    return [];
  }

  const stored = localStorage.getItem(VOTES_STORAGE_KEY);
  if (!stored) {
    return [];
  }

  try {
    return JSON.parse(stored);
  } catch (e) {
    console.error('Failed to parse votes:', e);
    return [];
  }
}

/**
 * Récupère les votes où l'utilisateur peut voter
 */
export function getVotesForUser(userAddress: string): VoteProcess[] {
  return getAllVotes().filter((vote) => vote.voters.includes(userAddress));
}

/**
 * Récupère les votes créés par l'utilisateur
 */
export function getVotesCreatedByUser(userAddress: string): VoteProcess[] {
  return getAllVotes().filter((vote) => vote.creator === userAddress);
}

/**
 * Vérifie si un utilisateur a déjà voté
 */
export function hasUserVoted(voteId: string, userAddress: string): boolean {
  const vote = loadVote(voteId);
  if (!vote) return false;
  return vote.votes.some((v) => v.voter_address === userAddress);
}

/**
 * Ferme un vote manuellement
 */
export async function closeVote(voteId: string, user: User): Promise<VoteProcess> {
  console.log('🔧 [MOCK] Closing vote:', voteId);

  const vote = loadVote(voteId);
  if (!vote) {
    throw new Error('Vote not found');
  }

  // Vérifier que l'utilisateur est le créateur
  if (vote.creator !== user.mainAddress) {
    throw new Error('Only the creator can close the vote');
  }

  vote.status = 'closed';
  saveVote(vote);

  // Notifier
  const relay = getRelayClient();
  relay.send({
    flag: 'VoteClosed',
    content: JSON.stringify({
      vote_id: voteId,
      closed_by: user.mainAddress,
      total_votes: vote.total_votes,
      quorum_reached: vote.quorum_reached,
    }),
    timestamp: Date.now(),
  });

  console.log('✅ Vote closed');
  return vote;
}

/**
 * Archive un vote
 */
export async function archiveVote(voteId: string, user: User): Promise<void> {
  const vote = loadVote(voteId);
  if (!vote) {
    throw new Error('Vote not found');
  }

  if (vote.creator !== user.mainAddress) {
    throw new Error('Only the creator can archive the vote');
  }

  vote.status = 'archived';
  saveVote(vote);
}

/**
 * Supprime un vote (admin seulement)
 */
export async function deleteVote(voteId: string, user: User): Promise<void> {
  const vote = loadVote(voteId);
  if (!vote) {
    throw new Error('Vote not found');
  }

  if (vote.creator !== user.mainAddress) {
    throw new Error('Only the creator can delete the vote');
  }

  const votes = getAllVotes().filter((v) => v.id !== voteId);
  if (typeof window !== 'undefined') {
    localStorage.setItem(VOTES_STORAGE_KEY, JSON.stringify(votes));
  }
}

/**
 * Sauvegarde un vote
 */
function saveVote(vote: VoteProcess): void {
  const votes = getAllVotes();
  const index = votes.findIndex((v) => v.id === vote.id);

  if (index >= 0) {
    votes[index] = vote;
  } else {
    votes.push(vote);
  }

  if (typeof window !== 'undefined') {
    localStorage.setItem(VOTES_STORAGE_KEY, JSON.stringify(votes));
  }
}

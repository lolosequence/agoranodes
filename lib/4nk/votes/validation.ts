/**
 * Système de validation pour les votes 4NK
 * Vérifie les quorums, les signatures et la validité des votes
 */

import type { VoteProcess, VoteValidationResult, VoteRole } from '../types';

/**
 * Valide un processus de vote complet
 */
export function validateVote(vote: VoteProcess): VoteValidationResult {
  const errors: string[] = [];

  // Calculer le nombre de votes requis pour le quorum
  const requiredVotes = Math.ceil(vote.voters.length * vote.quorum_required);
  const actualVotes = vote.total_votes;
  const missingVotes = Math.max(0, requiredVotes - actualVotes);
  const quorumPercentage = vote.voters.length > 0 ? (actualVotes / vote.voters.length) * 100 : 0;
  const quorumReached = actualVotes >= requiredVotes;

  // Vérifications basiques
  if (vote.voters.length === 0) {
    errors.push('No voters defined for this vote');
  }

  if (vote.options.length < 2) {
    errors.push('At least 2 options are required');
  }

  // Vérifier que tous les votes sont valides
  vote.votes.forEach((individualVote, index) => {
    // Vérifier que le votant est autorisé
    if (!vote.voters.includes(individualVote.voter_address)) {
      errors.push(`Vote ${index + 1}: Voter ${individualVote.voter_address} is not authorized`);
    }

    // Vérifier que l'option existe
    if (!vote.options.find((opt) => opt.id === individualVote.option_id)) {
      errors.push(`Vote ${index + 1}: Invalid option ${individualVote.option_id}`);
    }

    // Vérifier la signature (en mode mock, on accepte toutes les signatures)
    if (!individualVote.signature) {
      errors.push(`Vote ${index + 1}: Missing signature`);
    }
  });

  // Vérifier les doublons
  const voterAddresses = vote.votes.map((v) => v.voter_address);
  const uniqueAddresses = new Set(voterAddresses);
  if (voterAddresses.length !== uniqueAddresses.size) {
    errors.push('Duplicate votes detected');
  }

  // Vérifier les dates si définies
  if (vote.ends_at) {
    const endDate = new Date(vote.ends_at);
    const now = new Date();
    if (now > endDate && vote.status === 'active') {
      errors.push('Vote has expired but is still active');
    }
  }

  return {
    isValid: errors.length === 0,
    quorumReached,
    quorumPercentage,
    requiredVotes,
    actualVotes,
    missingVotes,
    errors,
  };
}

/**
 * Valide un rôle spécifique dans le vote
 */
export function validateRole(role: VoteRole, vote: VoteProcess): boolean {
  // Vérifier que le quorum est valide (entre 0 et 1)
  if (role.quorum < 0 || role.quorum > 1) {
    return false;
  }

  // Vérifier que tous les membres existent dans la liste des votants
  const allMembersValid = role.members.every((member) => vote.voters.includes(member));
  if (!allMembersValid) {
    return false;
  }

  return true;
}

/**
 * Calcule le taux de participation
 */
export function calculateParticipationRate(vote: VoteProcess): number {
  if (vote.voters.length === 0) return 0;
  return (vote.total_votes / vote.voters.length) * 100;
}

/**
 * Vérifie si un vote peut être fermé
 */
export function canCloseVote(vote: VoteProcess): { canClose: boolean; reason?: string } {
  if (vote.status !== 'active') {
    return {
      canClose: false,
      reason: 'Vote is not active',
    };
  }

  // Un vote peut être fermé si le quorum est atteint
  if (vote.quorum_reached) {
    return {
      canClose: true,
    };
  }

  // Ou si la date de fin est dépassée
  if (vote.ends_at) {
    const endDate = new Date(vote.ends_at);
    const now = new Date();
    if (now > endDate) {
      return {
        canClose: true,
      };
    }
  }

  // Ou si tous les votants ont voté
  if (vote.total_votes === vote.voters.length) {
    return {
      canClose: true,
    };
  }

  return {
    canClose: false,
    reason: 'Quorum not reached and vote has not expired',
  };
}

/**
 * Détermine le gagnant d'un vote
 */
export function getWinningOption(vote: VoteProcess): {
  option_id: string;
  option_label: string;
  count: number;
  percentage: number;
} | null {
  if (!vote.results) {
    return null;
  }

  let maxCount = 0;
  let winningOptionId: string | null = null;

  // Trouver l'option avec le plus de votes (en excluant l'abstention)
  Object.entries(vote.results).forEach(([optionId, result]) => {
    if (optionId !== 'abstention' && result.count > maxCount) {
      maxCount = result.count;
      winningOptionId = optionId;
    }
  });

  if (!winningOptionId) {
    return null;
  }

  const option = vote.options.find((opt) => opt.id === winningOptionId);
  if (!option) {
    return null;
  }

  return {
    option_id: winningOptionId,
    option_label: option.label,
    count: vote.results[winningOptionId].count,
    percentage: vote.results[winningOptionId].percentage,
  };
}

/**
 * Vérifie si un vote est en égalité
 */
export function isTie(vote: VoteProcess): boolean {
  if (!vote.results) {
    return false;
  }

  const counts = Object.entries(vote.results)
    .filter(([id]) => id !== 'abstention')
    .map(([, result]) => result.count);

  if (counts.length < 2) {
    return false;
  }

  const maxCount = Math.max(...counts);
  const optionsWithMaxCount = counts.filter((count) => count === maxCount);

  return optionsWithMaxCount.length > 1;
}

/**
 * Génère un rapport de vote
 */
export function generateVoteReport(vote: VoteProcess): {
  summary: string;
  participation: number;
  quorum_status: string;
  winner: string | null;
  is_tie: boolean;
  validation: VoteValidationResult;
} {
  const validation = validateVote(vote);
  const participation = calculateParticipationRate(vote);
  const winner = getWinningOption(vote);
  const tie = isTie(vote);

  let summary = `Vote "${vote.title}" `;
  if (vote.status === 'active') {
    summary += 'is currently active';
  } else if (vote.status === 'closed') {
    summary += 'has been closed';
  } else {
    summary += `is ${vote.status}`;
  }

  let quorum_status = '';
  if (validation.quorumReached) {
    quorum_status = `Quorum reached (${validation.quorumPercentage.toFixed(1)}%)`;
  } else {
    quorum_status = `Quorum not reached (${validation.quorumPercentage.toFixed(1)}% / ${(vote.quorum_required * 100).toFixed(0)}% required, ${validation.missingVotes} votes missing)`;
  }

  return {
    summary,
    participation,
    quorum_status,
    winner: winner ? winner.option_label : null,
    is_tie: tie,
    validation,
  };
}

'use client';

/**
 * Composant de vote pour les posts et topics
 */

import { useState } from 'react';

interface PostVotingProps {
  score: number;
  upvotes: string[];
  downvotes: string[];
  userAddress?: string;
  onVote: (type: 'up' | 'down') => Promise<void>;
  disabled?: boolean;
  vertical?: boolean;
}

export default function PostVoting({
  score,
  upvotes,
  downvotes,
  userAddress,
  onVote,
  disabled = false,
  vertical = true,
}: PostVotingProps) {
  const [isVoting, setIsVoting] = useState(false);

  const hasUpvoted = userAddress ? upvotes.includes(userAddress) : false;
  const hasDownvoted = userAddress ? downvotes.includes(userAddress) : false;

  const handleVote = async (type: 'up' | 'down') => {
    if (disabled || isVoting) return;

    setIsVoting(true);
    try {
      await onVote(type);
    } finally {
      setIsVoting(false);
    }
  };

  const containerClass = vertical
    ? 'flex flex-col items-center gap-1'
    : 'flex items-center gap-2';

  return (
    <div className={containerClass}>
      {/* Upvote */}
      <button
        onClick={() => handleVote('up')}
        disabled={disabled || isVoting}
        className={`p-1 rounded transition ${
          hasUpvoted
            ? 'text-green-600 dark:text-green-400'
            : 'text-gray-400 dark:text-gray-500 hover:text-green-600 dark:hover:text-green-400'
        } ${disabled ? 'cursor-not-allowed opacity-50' : ''}`}
        title="Upvote"
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {/* Score */}
      <span
        className={`font-semibold text-sm ${
          score > 0
            ? 'text-green-600 dark:text-green-400'
            : score < 0
            ? 'text-red-600 dark:text-red-400'
            : 'text-gray-500 dark:text-gray-400'
        }`}
      >
        {score}
      </span>

      {/* Downvote */}
      <button
        onClick={() => handleVote('down')}
        disabled={disabled || isVoting}
        className={`p-1 rounded transition ${
          hasDownvoted
            ? 'text-red-600 dark:text-red-400'
            : 'text-gray-400 dark:text-gray-500 hover:text-red-600 dark:hover:text-red-400'
        } ${disabled ? 'cursor-not-allowed opacity-50' : ''}`}
        title="Downvote"
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>
    </div>
  );
}

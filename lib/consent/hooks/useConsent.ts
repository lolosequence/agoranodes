'use client';

/**
 * Hook personnalise pour acceder au context de consentement cookies
 * Fournit un acces simple a l'etat et aux methodes de consentement
 */

import { useContext } from 'react';
import { ConsentContext } from '../consent-context';

/**
 * Hook useConsent
 *
 * Usage:
 * ```tsx
 * const { hasConsented, preferences, acceptAll, refuseAll } = useConsent();
 * ```
 *
 * @throws Error si utilise en dehors d'un ConsentProvider
 */
export function useConsent() {
  const context = useContext(ConsentContext);

  if (!context) {
    throw new Error('useConsent must be used within a ConsentProvider');
  }

  return context;
}

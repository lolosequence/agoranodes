'use client';

/**
 * Hook personnalisé pour accéder au context d'authentification 4NK
 * Fournit un accès simple à l'état et aux méthodes d'authentification
 */

import { useContext } from 'react';
import { AuthContext } from '../auth-context';

/**
 * Hook useAuth
 *
 * Usage:
 * ```tsx
 * const { isAuthenticated, user, createNewIdentity, logout } = useAuth();
 * ```
 *
 * @throws Error si utilisé en dehors d'un AuthProvider
 */
export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}

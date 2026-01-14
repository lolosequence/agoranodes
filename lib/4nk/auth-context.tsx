'use client';

/**
 * Context d'authentification 4NK pour l'application Agoranodes
 * Fournit l'état d'authentification global et les méthodes associées
 */

import React, { createContext, useState, useEffect, ReactNode } from 'react';
import type { User } from './types';
import {
  createIdentity,
  loginUser,
  restoreSession,
  logout as logoutDevice,
} from './device-manager';
import { init4nkWasm } from './wasm-loader';

/**
 * État d'authentification
 */
interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  wasmInitialized: boolean;
  error: string | null;
}

/**
 * Méthodes d'authentification disponibles via le Context
 */
interface AuthContextType extends AuthState {
  createNewIdentity: (password: string, label?: string) => Promise<void>;
  login: (password: string, preId: string) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

/**
 * Valeur par défaut du Context
 */
const defaultAuthContext: AuthContextType = {
  isAuthenticated: false,
  user: null,
  loading: true,
  wasmInitialized: false,
  error: null,
  createNewIdentity: async () => {},
  login: async () => {},
  logout: async () => {},
  clearError: () => {},
};

/**
 * Context React pour l'authentification
 */
export const AuthContext = createContext<AuthContextType>(defaultAuthContext);

/**
 * Props du provider
 */
interface AuthProviderProps {
  children: ReactNode;
}

/**
 * Provider d'authentification
 * Doit envelopper l'application au niveau du layout
 */
export function AuthProvider({ children }: AuthProviderProps) {
  const [state, setState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    loading: true,
    wasmInitialized: false,
    error: null,
  });

  /**
   * Initialisation : WASM + restauration de session
   */
  useEffect(() => {
    const initialize = async () => {
      try {
        // Initialiser le WASM
        await init4nkWasm();
        setState((prev) => ({ ...prev, wasmInitialized: true }));

        // Tenter de restaurer la session
        const user = await restoreSession();

        if (user) {
          setState((prev) => ({
            ...prev,
            isAuthenticated: true,
            user,
            loading: false,
          }));
        } else {
          setState((prev) => ({ ...prev, loading: false }));
        }
      } catch (err) {
        console.error('Failed to initialize auth:', err);
        setState((prev) => ({
          ...prev,
          loading: false,
          error: `Initialization failed: ${err}`,
        }));
      }
    };

    initialize();
  }, []);

  /**
   * Crée une nouvelle identité
   */
  const createNewIdentity = async (
    password: string,
    label: string = 'Utilisateur Agoranodes'
  ) => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const user = await createIdentity(password, label);

      setState({
        isAuthenticated: true,
        user,
        loading: false,
        wasmInitialized: true,
        error: null,
      });
    } catch (err) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: `Failed to create identity: ${err}`,
      }));
      throw err;
    }
  };

  /**
   * Connexion avec identifiant existant
   */
  const login = async (password: string, preId: string) => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const user = await loginUser(password, preId);

      setState({
        isAuthenticated: true,
        user,
        loading: false,
        wasmInitialized: true,
        error: null,
      });
    } catch (err) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: `Failed to login: ${err}`,
      }));
      throw err;
    }
  };

  /**
   * Déconnexion
   */
  const logout = async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      await logoutDevice();

      setState({
        isAuthenticated: false,
        user: null,
        loading: false,
        wasmInitialized: true,
        error: null,
      });
    } catch (err) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: `Failed to logout: ${err}`,
      }));
      throw err;
    }
  };

  /**
   * Efface l'erreur courante
   */
  const clearError = () => {
    setState((prev) => ({ ...prev, error: null }));
  };

  const contextValue: AuthContextType = {
    ...state,
    createNewIdentity,
    login,
    logout,
    clearError,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}

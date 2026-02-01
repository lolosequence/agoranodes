'use client';

/**
 * Context de consentement cookies RGPD pour Agoranodes
 * Gere les preferences de cookies avec persistence localStorage
 * et expiration automatique (13 mois - recommandation CNIL)
 */

import React, { createContext, useState, useEffect, useCallback, ReactNode } from 'react';

const STORAGE_KEY = 'agoranodes-cookie-consent';
const CONSENT_VERSION = '1.0';
const EXPIRATION_MONTHS = 13;

/**
 * Categories de cookies
 */
export interface ConsentPreferences {
  functional: boolean;  // Toujours true, requis
  analytics: boolean;
  marketing: boolean;
}

/**
 * Donnees stockees dans localStorage
 */
interface StoredConsent {
  version: string;
  preferences: ConsentPreferences;
  timestamp: number;
}

/**
 * Etat du consentement
 */
interface ConsentState {
  hasConsented: boolean;
  preferences: ConsentPreferences;
  loading: boolean;
}

/**
 * Methodes et etat exposes via le Context
 */
export interface ConsentContextType extends ConsentState {
  acceptAll: () => void;
  refuseAll: () => void;
  savePreferences: (preferences: ConsentPreferences) => void;
  resetConsent: () => void;
}

const defaultPreferences: ConsentPreferences = {
  functional: true,
  analytics: false,
  marketing: false,
};

const defaultConsentContext: ConsentContextType = {
  hasConsented: false,
  preferences: defaultPreferences,
  loading: true,
  acceptAll: () => {},
  refuseAll: () => {},
  savePreferences: () => {},
  resetConsent: () => {},
};

export const ConsentContext = createContext<ConsentContextType>(defaultConsentContext);

interface ConsentProviderProps {
  children: ReactNode;
}

/**
 * Verifie si le consentement stocke est encore valide
 */
function isConsentValid(stored: StoredConsent): boolean {
  if (stored.version !== CONSENT_VERSION) return false;

  const expirationDate = new Date(stored.timestamp);
  expirationDate.setMonth(expirationDate.getMonth() + EXPIRATION_MONTHS);

  return new Date() < expirationDate;
}

/**
 * Provider de consentement cookies
 * Doit envelopper l'application au niveau du layout
 */
export function ConsentProvider({ children }: ConsentProviderProps) {
  const [state, setState] = useState<ConsentState>({
    hasConsented: false,
    preferences: defaultPreferences,
    loading: true,
  });

  // Restauration du consentement depuis localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);

      if (raw) {
        const stored: StoredConsent = JSON.parse(raw);

        if (isConsentValid(stored)) {
          setState({
            hasConsented: true,
            preferences: { ...stored.preferences, functional: true },
            loading: false,
          });
          return;
        }

        // Consentement expire ou version differente : on nettoie
        localStorage.removeItem(STORAGE_KEY);
      }
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }

    setState((prev) => ({ ...prev, loading: false }));
  }, []);

  const persistConsent = useCallback((preferences: ConsentPreferences) => {
    const data: StoredConsent = {
      version: CONSENT_VERSION,
      preferences: { ...preferences, functional: true },
      timestamp: Date.now(),
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));

    setState({
      hasConsented: true,
      preferences: data.preferences,
      loading: false,
    });
  }, []);

  const acceptAll = useCallback(() => {
    persistConsent({ functional: true, analytics: true, marketing: true });
  }, [persistConsent]);

  const refuseAll = useCallback(() => {
    persistConsent({ functional: true, analytics: false, marketing: false });
  }, [persistConsent]);

  const savePreferences = useCallback(
    (preferences: ConsentPreferences) => {
      persistConsent(preferences);
    },
    [persistConsent]
  );

  const resetConsent = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setState({
      hasConsented: false,
      preferences: defaultPreferences,
      loading: false,
    });
  }, []);

  const contextValue: ConsentContextType = {
    ...state,
    acceptAll,
    refuseAll,
    savePreferences,
    resetConsent,
  };

  return (
    <ConsentContext.Provider value={contextValue}>{children}</ConsentContext.Provider>
  );
}

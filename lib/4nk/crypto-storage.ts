/**
 * Stockage sécurisé pour les données d'authentification 4NK
 * Utilise IndexedDB pour la persistance côté navigateur
 *
 * ⚠️ IMPORTANT : En production, les clés privées devraient être chiffrées
 * avec un mot de passe utilisateur avant stockage
 */

import type { User } from './types';

const DB_NAME = '4nk-auth-db';
const DB_VERSION = 1;
const STORE_NAME = 'auth-data';
const USER_KEY = 'current-user';

/**
 * Ouvre ou crée la base de données IndexedDB
 */
function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => {
      reject(new Error('Failed to open IndexedDB'));
    };

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;

      // Créer le store s'il n'existe pas
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
  });
}

/**
 * Sauvegarde les données utilisateur dans IndexedDB
 */
export async function saveUserData(userData: User): Promise<void> {
  const db = await openDatabase();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.put(userData, USER_KEY);

    request.onsuccess = () => {
      console.log('✅ User data saved to IndexedDB');
      resolve();
    };

    request.onerror = () => {
      reject(new Error('Failed to save user data'));
    };

    transaction.oncomplete = () => {
      db.close();
    };
  });
}

/**
 * Récupère les données utilisateur depuis IndexedDB
 */
export async function loadUserData(): Promise<User | null> {
  const db = await openDatabase();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.get(USER_KEY);

    request.onsuccess = () => {
      const userData = request.result as User | undefined;
      if (userData) {
        console.log('✅ User data loaded from IndexedDB');
        resolve(userData);
      } else {
        console.log('ℹ️ No user data found in IndexedDB');
        resolve(null);
      }
    };

    request.onerror = () => {
      reject(new Error('Failed to load user data'));
    };

    transaction.oncomplete = () => {
      db.close();
    };
  });
}

/**
 * Supprime les données utilisateur (déconnexion)
 */
export async function clearUserData(): Promise<void> {
  const db = await openDatabase();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.delete(USER_KEY);

    request.onsuccess = () => {
      console.log('✅ User data cleared from IndexedDB');
      resolve();
    };

    request.onerror = () => {
      reject(new Error('Failed to clear user data'));
    };

    transaction.oncomplete = () => {
      db.close();
    };
  });
}

/**
 * Vérifie si des données utilisateur existent
 */
export async function hasStoredUser(): Promise<boolean> {
  const userData = await loadUserData();
  return userData !== null;
}

/**
 * Chiffre des données avec un mot de passe (simple, pour le mock)
 * ⚠️ En production, utiliser une vraie cryptographie (AES-GCM, etc.)
 */
export function encryptData(data: string, password: string): string {
  // Simulation simple - NE PAS UTILISER EN PRODUCTION
  const encoded = btoa(data + '::' + password.substring(0, 8));
  return encoded;
}

/**
 * Déchiffre des données avec un mot de passe
 */
export function decryptData(encryptedData: string, password: string): string {
  try {
    const decoded = atob(encryptedData);
    const [data] = decoded.split('::');
    return data;
  } catch (e) {
    throw new Error('Failed to decrypt data');
  }
}

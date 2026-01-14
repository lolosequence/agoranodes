/**
 * Gestionnaire de Device 4NK
 * Interface entre l'application React et le module WASM
 * Gère la création d'identités, la connexion, et l'état du device
 */

import { init4nkWasm } from './wasm-loader';
import { saveUserData, loadUserData, clearUserData } from './crypto-storage';
import type { User, WasmModule } from './types';

/**
 * Crée une nouvelle identité 4NK
 * @param password - Mot de passe pour chiffrer les clés (optionnel en mode mock)
 * @param label - Label/nom pour l'utilisateur
 * @returns Données utilisateur générées
 */
export async function createIdentity(
  password: string,
  label: string = 'Utilisateur Agoranodes'
): Promise<User> {
  try {
    // Initialiser le module WASM
    const wasmModule: WasmModule = await init4nkWasm();

    // Appeler la fonction WASM pour créer l'utilisateur
    const userDataStr = wasmModule.create_user(password, label);
    const userData: User = JSON.parse(userDataStr);

    // Sauvegarder dans IndexedDB
    await saveUserData(userData);

    console.log('✅ Identity created:', {
      mainAddress: userData.mainAddress,
      label: userData.label,
    });

    return userData;
  } catch (error) {
    console.error('❌ Failed to create identity:', error);
    throw new Error(`Failed to create identity: ${error}`);
  }
}

/**
 * Se connecte avec un utilisateur existant
 * @param password - Mot de passe de l'utilisateur
 * @param preId - Identifiant pré-généré (mainAddress ou recoveryPhrase)
 * @returns Données utilisateur si connexion réussie
 */
export async function loginUser(
  password: string,
  preId: string
): Promise<User> {
  try {
    const wasmModule: WasmModule = await init4nkWasm();

    const userDataStr = wasmModule.login_user(password, preId);
    const userData: User = JSON.parse(userDataStr);

    // Sauvegarder dans IndexedDB
    await saveUserData(userData);

    console.log('✅ User logged in:', {
      mainAddress: userData.mainAddress,
      label: userData.label,
    });

    return userData;
  } catch (error) {
    console.error('❌ Failed to login:', error);
    throw new Error(`Failed to login: ${error}`);
  }
}

/**
 * Restaure la session depuis IndexedDB
 * @returns Données utilisateur si une session existe, null sinon
 */
export async function restoreSession(): Promise<User | null> {
  try {
    const userData = await loadUserData();

    if (userData) {
      console.log('✅ Session restored:', {
        mainAddress: userData.mainAddress,
        label: userData.label,
      });
    }

    return userData;
  } catch (error) {
    console.error('❌ Failed to restore session:', error);
    return null;
  }
}

/**
 * Déconnecte l'utilisateur
 */
export async function logout(): Promise<void> {
  try {
    await clearUserData();
    console.log('✅ User logged out');
  } catch (error) {
    console.error('❌ Failed to logout:', error);
    throw new Error(`Failed to logout: ${error}`);
  }
}

/**
 * Récupère l'adresse principale de l'utilisateur courant
 */
export async function getMainAddress(): Promise<string> {
  try {
    const wasmModule: WasmModule = await init4nkWasm();
    return wasmModule.get_main_address();
  } catch (error) {
    console.error('❌ Failed to get main address:', error);
    throw new Error(`Failed to get main address: ${error}`);
  }
}

/**
 * Récupère l'adresse de récupération
 */
export async function getRecoverAddress(): Promise<string> {
  try {
    const wasmModule: WasmModule = await init4nkWasm();
    return wasmModule.get_recover_address();
  } catch (error) {
    console.error('❌ Failed to get recover address:', error);
    throw new Error(`Failed to get recover address: ${error}`);
  }
}

/**
 * Récupère les processus de l'utilisateur
 */
export async function getProcesses(): Promise<any[]> {
  try {
    const wasmModule: WasmModule = await init4nkWasm();
    const processesStr = wasmModule.get_processes();
    return JSON.parse(processesStr);
  } catch (error) {
    console.error('❌ Failed to get processes:', error);
    throw new Error(`Failed to get processes: ${error}`);
  }
}

/**
 * Vérifie si le module WASM est prêt
 */
export async function isWasmReady(): Promise<boolean> {
  try {
    await init4nkWasm();
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Mock du module WASM 4NK
 * Simule les fonctions principales de sdk_client pour permettre le développement
 * sans attendre la compilation WASM
 *
 * ⚠️ À REMPLACER par le vrai WASM une fois compilé
 */

import { generateSilentPaymentAddress, generateRecoveryPhrase } from './crypto-utils';

// Stockage en mémoire (sera remplacé par IndexedDB)
let mockUserData: any = null;

/**
 * Initialise le module WASM (mock)
 */
export function setup(): void {
  console.log('🔧 [MOCK] 4NK WASM setup initialized');
}

/**
 * Crée un nouvel utilisateur avec adresse Silent Payment
 * @param password - Mot de passe pour chiffrer les clés
 * @param label - Label optionnel pour l'utilisateur
 * @returns Données utilisateur générées
 */
export function create_user(password: string, label?: string): any {
  console.log('🔧 [MOCK] Creating user with label:', label);

  // Générer des adresses Silent Payment simulées
  const mainAddress = generateSilentPaymentAddress();
  const recoverAddress = generateSilentPaymentAddress();
  const recoveryPhrase = generateRecoveryPhrase();

  mockUserData = {
    mainAddress,
    recoverAddress,
    recoveryPhrase,
    label: label || 'Default User',
    createdAt: new Date().toISOString(),
    // Simulation de clés (ne jamais faire ça en prod !)
    _mockKeys: {
      scanKey: 'mock_scan_key_' + Math.random().toString(36).substring(7),
      spendKey: 'mock_spend_key_' + Math.random().toString(36).substring(7),
    }
  };

  return JSON.stringify(mockUserData);
}

/**
 * Connexion utilisateur
 * @param user_password - Mot de passe
 * @param pre_id - Identifiant pré-généré (adresse ou phrase)
 * @returns Données utilisateur si connexion réussie
 */
export function login_user(user_password: string, pre_id: string): any {
  console.log('🔧 [MOCK] Login user with pre_id:', pre_id.substring(0, 20) + '...');

  if (!mockUserData) {
    throw new Error('No user data found. Please create a user first.');
  }

  // En mode mock, on accepte n'importe quel mot de passe
  return JSON.stringify(mockUserData);
}

/**
 * Récupère l'adresse principale de l'utilisateur
 */
export function get_main_address(): string {
  if (!mockUserData) {
    throw new Error('No user logged in');
  }
  return mockUserData.mainAddress;
}

/**
 * Récupère l'adresse de récupération
 */
export function get_recover_address(): string {
  if (!mockUserData) {
    throw new Error('No user logged in');
  }
  return mockUserData.recoverAddress;
}

/**
 * Récupère les processus de l'utilisateur
 */
export function get_processes(): any {
  console.log('🔧 [MOCK] Getting processes');

  // Retourner des processus simulés
  return JSON.stringify([
    {
      id: 'process_001',
      title: 'Vote sur la réforme',
      description: 'Décision collective sur la nouvelle réforme',
      status: 'active',
      participantsCount: 5,
    },
    {
      id: 'process_002',
      title: 'Pairing multi-device',
      description: 'Processus de pairing de vos appareils',
      status: 'pending',
      participantsCount: 2,
    }
  ]);
}

/**
 * Parse un message réseau
 */
export function parse_network_msg(raw: string, fee_rate: number): any {
  console.log('🔧 [MOCK] Parsing network message');

  try {
    const msg = JSON.parse(raw);
    return JSON.stringify({
      id: Date.now(),
      flag: msg.flag || 'unknown',
      content: msg.content || '',
      status: 'received',
    });
  } catch (e) {
    throw new Error('Invalid network message');
  }
}

/**
 * Chiffre des données avec une clé
 */
export function encrypt_with_key(plaintext: string, key: string): string {
  console.log('🔧 [MOCK] Encrypting with key');

  // Simulation simple (NOT SECURE - juste pour le mock)
  const encoded = btoa(plaintext + '::' + key.substring(0, 8));
  return encoded;
}

/**
 * Chiffre avec une nouvelle clé générée
 */
export function encrypt_with_new_key(plaintext: string): any {
  console.log('🔧 [MOCK] Encrypting with new key');

  const key = 'mock_key_' + Math.random().toString(36).substring(7);
  const cipher = encrypt_with_key(plaintext, key);

  return JSON.stringify({ cipher, key });
}

/**
 * Déchiffre avec une clé
 */
export function try_decrypt_with_key(cipher: string, key: string): string {
  console.log('🔧 [MOCK] Decrypting with key');

  try {
    const decoded = atob(cipher);
    const [plaintext] = decoded.split('::');
    return plaintext;
  } catch (e) {
    throw new Error('Decryption failed');
  }
}

/**
 * Crée un message faucet (pour testnet)
 */
export function create_faucet_msg(): any {
  console.log('🔧 [MOCK] Creating faucet message');

  return JSON.stringify({
    id: Date.now(),
    flag: 'Faucet',
    address: get_recover_address(),
    amount: 10000, // satoshis
  });
}

/**
 * Récupère les outpoints de l'utilisateur
 */
export function get_outpoints_for_user(): any {
  console.log('🔧 [MOCK] Getting outpoints');

  return JSON.stringify([
    {
      txid: 'mock_tx_' + Math.random().toString(36).substring(7),
      vout: 0,
      amount: 5000,
      status: 'unspent',
    },
    {
      txid: 'mock_tx_' + Math.random().toString(36).substring(7),
      vout: 1,
      amount: 3000,
      status: 'unspent',
    }
  ]);
}

/**
 * Récupère le montant disponible
 */
export function get_available_amount_for_user(recover: boolean = false): number {
  console.log('🔧 [MOCK] Getting available amount, recover:', recover);

  // Mock : 8000 satoshis disponibles
  return 8000;
}

/**
 * Vérifie si une transaction appartient à l'utilisateur
 */
export function is_tx_owned_by_user(pre_id: string, tx: string): boolean {
  console.log('🔧 [MOCK] Checking tx ownership');

  // En mode mock, on retourne vrai aléatoirement
  return Math.random() > 0.5;
}

// Export du module mock comme s'il était WASM
export const mockWasmModule = {
  setup,
  create_user,
  login_user,
  get_main_address,
  get_recover_address,
  get_processes,
  parse_network_msg,
  encrypt_with_key,
  encrypt_with_new_key,
  try_decrypt_with_key,
  create_faucet_msg,
  get_outpoints_for_user,
  get_available_amount_for_user,
  is_tx_owned_by_user,
};

export default mockWasmModule;

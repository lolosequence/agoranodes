/**
 * Utilitaires crypto pour le mock WASM
 * Génère des adresses et phrases de récupération simulées
 *
 * ⚠️ SIMULATION UNIQUEMENT - Pas de vraie cryptographie
 */

/**
 * Génère une adresse Silent Payment simulée (format testnet)
 * Format réel : tsp1qq... (testnet silent payment)
 */
export function generateSilentPaymentAddress(): string {
  const randomPart = Array.from({ length: 90 }, () =>
    'abcdefghijklmnopqrstuvwxyz0123456789'.charAt(Math.floor(Math.random() * 36))
  ).join('');

  return `tsp1qq${randomPart}`;
}

/**
 * Génère une phrase de récupération de 12 mots (BIP39-like)
 */
export function generateRecoveryPhrase(): string {
  const wordList = [
    'abandon', 'ability', 'able', 'about', 'above', 'absent', 'absorb', 'abstract',
    'absurd', 'abuse', 'access', 'accident', 'account', 'accuse', 'achieve', 'acid',
    'acoustic', 'acquire', 'across', 'act', 'action', 'actor', 'actress', 'actual',
    'adapt', 'add', 'addict', 'address', 'adjust', 'admit', 'adult', 'advance',
    'advice', 'aerobic', 'affair', 'afford', 'afraid', 'again', 'age', 'agent',
    'agree', 'ahead', 'aim', 'air', 'airport', 'aisle', 'alarm', 'album',
    'alcohol', 'alert', 'alien', 'all', 'alley', 'allow', 'almost', 'alone',
    'alpha', 'already', 'also', 'alter', 'always', 'amateur', 'amazing', 'among'
  ];

  const words: string[] = [];
  for (let i = 0; i < 12; i++) {
    const randomIndex = Math.floor(Math.random() * wordList.length);
    words.push(wordList[randomIndex]);
  }

  return words.join(' ');
}

/**
 * Génère une paire de clés Schnorr simulée
 */
export function generateSchnorrKeypair(): { privateKey: string; publicKey: string } {
  const privateKey = Array.from({ length: 64 }, () =>
    Math.floor(Math.random() * 16).toString(16)
  ).join('');

  const publicKey = Array.from({ length: 64 }, () =>
    Math.floor(Math.random() * 16).toString(16)
  ).join('');

  return { privateKey, publicKey };
}

/**
 * Génère un hash SHA256 simulé
 */
export function mockSha256(input: string): string {
  // Simulation simple (NOT SECURE)
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    const char = input.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }

  return Math.abs(hash).toString(16).padStart(64, '0');
}

/**
 * Tronque une adresse pour l'affichage
 */
export function truncateAddress(address: string, start: number = 8, end: number = 6): string {
  if (address.length <= start + end) {
    return address;
  }
  return `${address.substring(0, start)}...${address.substring(address.length - end)}`;
}

/**
 * Valide le format d'une adresse Silent Payment (basique)
 */
export function isValidSilentPaymentAddress(address: string): boolean {
  // Format testnet : tsp1qq...
  // Format mainnet : sp1qq...
  return /^(tsp1qq|sp1qq)[a-z0-9]{90,}$/.test(address);
}

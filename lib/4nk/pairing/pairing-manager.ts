/**
 * Gestionnaire de pairing multi-device pour 4NK
 * Permet de lier plusieurs appareils à une même identité
 *
 * ⚠️ MODE MOCK : Simulation du pairing en attendant l'implémentation complète du WASM
 */

import { getRelayClient } from '../relay/relay-client';
import type { User } from '../types';

/**
 * Données d'un processus de pairing
 */
export interface PairingProcess {
  pairing_id: string;
  creator_address: string;
  paired_addresses: string[];
  status: 'pending' | 'active' | 'completed';
  created_at: string;
  relay_url: string;
}

/**
 * Données encodées dans le QR code de pairing
 */
export interface PairingQRData {
  pairing_id: string;
  relay_url: string;
  creator_address: string;
  network: 'testnet' | 'mainnet';
  version: string;
}

/**
 * Demande de pairing depuis un device secondaire
 */
export interface PairingRequest {
  pairing_id: string;
  requester_address: string;
  requester_label: string;
  timestamp: number;
}

/**
 * Crée un nouveau processus de pairing
 * @param user - Utilisateur qui initie le pairing (device principal)
 * @returns Processus de pairing créé
 */
export async function createPairingProcess(user: User): Promise<PairingProcess> {
  console.log('🔧 [MOCK] Creating pairing process for:', user.mainAddress);

  // Générer un ID de pairing unique (simulé)
  const pairing_id = `pairing_${Date.now()}_${Math.random().toString(36).substring(7)}`;

  const process: PairingProcess = {
    pairing_id,
    creator_address: user.mainAddress,
    paired_addresses: [user.mainAddress], // Le créateur est déjà pairé
    status: 'active',
    created_at: new Date().toISOString(),
    relay_url: typeof window !== 'undefined'
      ? (window as any).ENV?.NEXT_PUBLIC_4NK_RELAY_URL || 'wss://relay.agoranodes.org'
      : 'wss://relay.agoranodes.org',
  };

  // En production, on créerait un Process WASM et on le commiterait sur Bitcoin
  // const wasmModule = await init4nkWasm();
  // const wasmProcess = wasmModule.Process.new();
  // wasmProcess.add_role("pairing", [], []);
  // ...

  // Sauvegarder le processus localement (en production: sur blockchain)
  savePairingProcess(process);

  console.log('✅ Pairing process created:', pairing_id);
  return process;
}

/**
 * Génère les données pour le QR code de pairing
 */
export function generatePairingQRData(process: PairingProcess): PairingQRData {
  return {
    pairing_id: process.pairing_id,
    relay_url: process.relay_url,
    creator_address: process.creator_address,
    network: 'testnet',
    version: '1.0',
  };
}

/**
 * Envoie une demande de pairing (depuis device secondaire)
 * @param qrData - Données scannées depuis le QR code
 * @param requester - Utilisateur qui demande le pairing
 */
export async function sendPairingRequest(
  qrData: PairingQRData,
  requester: User
): Promise<void> {
  console.log('🔧 [MOCK] Sending pairing request:', qrData.pairing_id);

  const request: PairingRequest = {
    pairing_id: qrData.pairing_id,
    requester_address: requester.mainAddress,
    requester_label: requester.label,
    timestamp: Date.now(),
  };

  // Envoyer via relay
  const relay = getRelayClient();
  relay.send({
    flag: 'PairingRequest',
    content: JSON.stringify(request),
    timestamp: Date.now(),
  });

  console.log('✅ Pairing request sent');
}

/**
 * Approuve une demande de pairing (device principal)
 * @param request - Demande de pairing à approuver
 * @param approver - Utilisateur qui approuve (doit être le créateur)
 */
export async function approvePairingRequest(
  request: PairingRequest,
  approver: User
): Promise<void> {
  console.log('🔧 [MOCK] Approving pairing request:', request.pairing_id);

  // Récupérer le processus de pairing
  const process = loadPairingProcess(request.pairing_id);

  if (!process) {
    throw new Error('Pairing process not found');
  }

  if (process.creator_address !== approver.mainAddress) {
    throw new Error('Only the creator can approve pairing requests');
  }

  // Ajouter la nouvelle adresse
  if (!process.paired_addresses.includes(request.requester_address)) {
    process.paired_addresses.push(request.requester_address);
  }

  // Sauvegarder le processus mis à jour
  savePairingProcess(process);

  // Notifier via relay
  const relay = getRelayClient();
  relay.send({
    flag: 'PairingApproved',
    content: JSON.stringify({
      pairing_id: request.pairing_id,
      approved_address: request.requester_address,
      paired_addresses: process.paired_addresses,
    }),
    timestamp: Date.now(),
  });

  console.log('✅ Pairing request approved');
}

/**
 * Rejette une demande de pairing
 */
export async function rejectPairingRequest(
  request: PairingRequest,
  rejector: User
): Promise<void> {
  console.log('🔧 [MOCK] Rejecting pairing request:', request.pairing_id);

  const relay = getRelayClient();
  relay.send({
    flag: 'PairingRejected',
    content: JSON.stringify({
      pairing_id: request.pairing_id,
      rejected_address: request.requester_address,
      reason: 'rejected_by_user',
    }),
    timestamp: Date.now(),
  });

  console.log('✅ Pairing request rejected');
}

/**
 * Récupère tous les devices pairés
 */
export async function getPairedDevices(user: User): Promise<string[]> {
  console.log('🔧 [MOCK] Getting paired devices for:', user.mainAddress);

  // Chercher le processus de pairing de cet utilisateur
  const processes = getAllPairingProcesses();
  const userProcess = processes.find(p =>
    p.paired_addresses.includes(user.mainAddress)
  );

  if (!userProcess) {
    return [user.mainAddress]; // Seulement le device actuel
  }

  return userProcess.paired_addresses;
}

/**
 * Supprime un device du pairing
 */
export async function unpairDevice(
  deviceAddress: string,
  user: User
): Promise<void> {
  console.log('🔧 [MOCK] Unpairing device:', deviceAddress);

  const processes = getAllPairingProcesses();
  const userProcess = processes.find(p =>
    p.paired_addresses.includes(user.mainAddress)
  );

  if (!userProcess) {
    throw new Error('No pairing process found');
  }

  // Retirer l'adresse
  userProcess.paired_addresses = userProcess.paired_addresses.filter(
    addr => addr !== deviceAddress
  );

  savePairingProcess(userProcess);

  // Notifier via relay
  const relay = getRelayClient();
  relay.send({
    flag: 'DeviceUnpaired',
    content: JSON.stringify({
      pairing_id: userProcess.pairing_id,
      unpaired_address: deviceAddress,
    }),
    timestamp: Date.now(),
  });

  console.log('✅ Device unpaired');
}

/**
 * Stockage local des processus de pairing (mock)
 * En production, cela serait sur la blockchain Bitcoin
 */
const PAIRING_STORAGE_KEY = '4nk-pairing-processes';

function savePairingProcess(process: PairingProcess): void {
  const processes = getAllPairingProcesses();
  const index = processes.findIndex(p => p.pairing_id === process.pairing_id);

  if (index >= 0) {
    processes[index] = process;
  } else {
    processes.push(process);
  }

  if (typeof window !== 'undefined') {
    localStorage.setItem(PAIRING_STORAGE_KEY, JSON.stringify(processes));
  }
}

function loadPairingProcess(pairing_id: string): PairingProcess | null {
  const processes = getAllPairingProcesses();
  return processes.find(p => p.pairing_id === pairing_id) || null;
}

function getAllPairingProcesses(): PairingProcess[] {
  if (typeof window === 'undefined') {
    return [];
  }

  const stored = localStorage.getItem(PAIRING_STORAGE_KEY);
  if (!stored) {
    return [];
  }

  try {
    return JSON.parse(stored);
  } catch (e) {
    return [];
  }
}

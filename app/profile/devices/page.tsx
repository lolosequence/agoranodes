'use client';

/**
 * Page de gestion des appareils pairés
 * Permet d'ajouter/supprimer des devices et de gérer le multi-device pairing
 */

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/4nk/hooks/useAuth';
import { truncateAddress } from '@/lib/4nk/crypto-utils';
import {
  createPairingProcess,
  generatePairingQRData,
  getPairedDevices,
  unpairDevice,
  sendPairingRequest,
  approvePairingRequest,
  rejectPairingRequest,
  type PairingQRData,
  type PairingRequest,
} from '@/lib/4nk/pairing/pairing-manager';
import { QRCodeDisplay, QRCodeScanner } from '@/lib/4nk/pairing/qr-generator';
import { getRelayClient } from '@/lib/4nk/relay/relay-client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

type ViewMode = 'list' | 'add' | 'scan';

export default function DevicesPage() {
  const { isAuthenticated, user, loading } = useAuth();
  const router = useRouter();

  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [pairedDevices, setPairedDevices] = useState<string[]>([]);
  const [qrData, setQRData] = useState<PairingQRData | null>(null);
  const [pendingRequests, setPendingRequests] = useState<PairingRequest[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  // Rediriger si non authentifié
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/');
    }
  }, [loading, isAuthenticated, router]);

  // Charger les devices pairés
  useEffect(() => {
    if (user) {
      loadPairedDevices();
      setupRelayListeners();
    }
  }, [user]);

  /**
   * Charge la liste des devices pairés
   */
  const loadPairedDevices = async () => {
    if (!user) return;

    try {
      const devices = await getPairedDevices(user);
      setPairedDevices(devices);
    } catch (error) {
      console.error('Failed to load paired devices:', error);
    }
  };

  /**
   * Configure les listeners pour les messages relay
   */
  const setupRelayListeners = () => {
    const relay = getRelayClient();
    relay.connect();

    // Écouter les demandes de pairing
    relay.on('PairingRequest', (message) => {
      try {
        const request: PairingRequest = JSON.parse(message.content);
        setPendingRequests((prev) => [...prev, request]);
      } catch (error) {
        console.error('Failed to parse pairing request:', error);
      }
    });

    // Écouter les approbations
    relay.on('PairingApproved', (message) => {
      try {
        const data = JSON.parse(message.content);
        setPairedDevices(data.paired_addresses);
        alert('Pairing approuvé ! Votre appareil est maintenant connecté.');
      } catch (error) {
        console.error('Failed to parse pairing approval:', error);
      }
    });

    // Écouter les rejets
    relay.on('PairingRejected', (message) => {
      alert('Pairing rejeté par l\'utilisateur principal');
    });
  };

  /**
   * Démarre le processus d'ajout d'un appareil (génère QR code)
   */
  const handleStartPairing = async () => {
    if (!user) return;

    setIsProcessing(true);
    try {
      const process = await createPairingProcess(user);
      const data = generatePairingQRData(process);
      setQRData(data);
      setViewMode('add');
    } catch (error) {
      console.error('Failed to start pairing:', error);
      alert('Erreur lors de la création du processus de pairing');
    } finally {
      setIsProcessing(false);
    }
  };

  /**
   * Gère le scan d'un QR code (device secondaire)
   */
  const handleQRCodeScanned = async (data: PairingQRData) => {
    if (!user) return;

    setIsProcessing(true);
    try {
      await sendPairingRequest(data, user);
      alert('Demande de pairing envoyée ! Attendez l\'approbation sur l\'autre appareil.');
      setViewMode('list');
    } catch (error) {
      console.error('Failed to send pairing request:', error);
      alert('Erreur lors de l\'envoi de la demande');
    } finally {
      setIsProcessing(false);
    }
  };

  /**
   * Approuve une demande de pairing
   */
  const handleApproveRequest = async (request: PairingRequest) => {
    if (!user) return;

    setIsProcessing(true);
    try {
      await approvePairingRequest(request, user);
      setPendingRequests((prev) => prev.filter((r) => r.pairing_id !== request.pairing_id));
      await loadPairedDevices();
      alert('Appareil ajouté avec succès !');
    } catch (error) {
      console.error('Failed to approve pairing:', error);
      alert('Erreur lors de l\'approbation');
    } finally {
      setIsProcessing(false);
    }
  };

  /**
   * Rejette une demande de pairing
   */
  const handleRejectRequest = async (request: PairingRequest) => {
    if (!user) return;

    try {
      await rejectPairingRequest(request, user);
      setPendingRequests((prev) => prev.filter((r) => r.pairing_id !== request.pairing_id));
    } catch (error) {
      console.error('Failed to reject pairing:', error);
    }
  };

  /**
   * Supprime un device du pairing
   */
  const handleUnpairDevice = async (deviceAddress: string) => {
    if (!user) return;

    if (!confirm('Êtes-vous sûr de vouloir supprimer cet appareil ?')) {
      return;
    }

    setIsProcessing(true);
    try {
      await unpairDevice(deviceAddress, user);
      await loadPairedDevices();
      alert('Appareil supprimé avec succès');
    } catch (error) {
      console.error('Failed to unpair device:', error);
      alert('Erreur lors de la suppression');
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="container mx-auto px-4 py-8">
        <nav className="flex justify-between items-center">
          <Link
            href="/"
            className="text-3xl font-bold text-indigo-600 dark:text-indigo-400"
          >
            Agoranodes
          </Link>
          <Link
            href="/profile"
            className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition"
          >
            ← Retour au profil
          </Link>
        </nav>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8 flex items-center gap-3">
            <span>📱</span>
            <span>Mes Appareils</span>
          </h1>

          {/* Pending Requests */}
          {pendingRequests.length > 0 && viewMode === 'list' && (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-300 dark:border-yellow-700 rounded-2xl p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <span>🔔</span>
                <span>Demandes en attente ({pendingRequests.length})</span>
              </h2>
              <div className="space-y-3">
                {pendingRequests.map((request) => (
                  <div
                    key={request.pairing_id}
                    className="bg-white dark:bg-gray-800 p-4 rounded-lg flex justify-between items-center"
                  >
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {request.requester_label}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 font-mono">
                        {truncateAddress(request.requester_address)}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleApproveRequest(request)}
                        disabled={isProcessing}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 transition"
                      >
                        ✓ Approuver
                      </button>
                      <button
                        onClick={() => handleRejectRequest(request)}
                        disabled={isProcessing}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-400 transition"
                      >
                        ✕ Rejeter
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* View Mode: List */}
          {viewMode === 'list' && (
            <>
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 mb-6">
                <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white">
                  Appareils Pairés ({pairedDevices.length})
                </h2>

                <div className="space-y-3 mb-6">
                  {pairedDevices.map((deviceAddress, index) => (
                    <div
                      key={deviceAddress}
                      className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">
                            {deviceAddress === user.mainAddress ? '💻' : '📱'}
                          </span>
                          <div>
                            <p className="font-semibold text-gray-900 dark:text-white">
                              {deviceAddress === user.mainAddress
                                ? 'Cet appareil'
                                : `Appareil ${index + 1}`}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400 font-mono">
                              {truncateAddress(deviceAddress)}
                            </p>
                          </div>
                        </div>
                      </div>
                      {deviceAddress !== user.mainAddress && (
                        <button
                          onClick={() => handleUnpairDevice(deviceAddress)}
                          disabled={isProcessing}
                          className="px-4 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition"
                        >
                          Supprimer
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={handleStartPairing}
                    disabled={isProcessing}
                    className="flex-1 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 transition font-semibold"
                  >
                    ➕ Ajouter un appareil
                  </button>
                  <button
                    onClick={() => setViewMode('scan')}
                    className="flex-1 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-semibold"
                  >
                    📷 Scanner un QR Code
                  </button>
                </div>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  💡 Comment ça marche ?
                </h3>
                <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-2">
                  <li>
                    <strong>Ajouter un appareil :</strong> Générez un QR code sur cet appareil et scannez-le avec votre autre appareil
                  </li>
                  <li>
                    <strong>Scanner un QR Code :</strong> Si vous avez déjà généré un QR code sur un autre appareil, scannez-le ici
                  </li>
                  <li>
                    <strong>Sécurité :</strong> Chaque appareil doit être approuvé manuellement
                  </li>
                </ul>
              </div>
            </>
          )}

          {/* View Mode: Add (Generate QR Code) */}
          {viewMode === 'add' && qrData && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white">
                Scanner ce QR Code sur votre autre appareil
              </h2>

              <div className="flex justify-center mb-6">
                <QRCodeDisplay data={qrData} size={300} />
              </div>

              <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4 mb-6">
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  ⚠️ <strong>Important :</strong> Gardez cette page ouverte jusqu'à ce que
                  l'autre appareil ait scanné le QR code et que vous ayez approuvé la demande.
                </p>
              </div>

              <button
                onClick={() => {
                  setViewMode('list');
                  setQRData(null);
                }}
                className="w-full px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
              >
                Annuler
              </button>
            </div>
          )}

          {/* View Mode: Scan */}
          {viewMode === 'scan' && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white">
                Scanner le QR Code
              </h2>

              <div className="mb-6">
                <QRCodeScanner
                  onScan={handleQRCodeScanned}
                  onError={(error) => alert(error)}
                />
              </div>

              <button
                onClick={() => setViewMode('list')}
                className="w-full px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
              >
                Annuler
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

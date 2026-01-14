'use client';

/**
 * Composant de génération et affichage de QR codes pour le pairing 4NK
 */

import { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';
import type { PairingQRData } from './pairing-manager';

interface QRCodeDisplayProps {
  data: PairingQRData;
  size?: number;
}

/**
 * Composant d'affichage de QR code pour le pairing
 */
export function QRCodeDisplay({ data, size = 300 }: QRCodeDisplayProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    // Encoder les données en JSON
    const qrData = JSON.stringify(data);

    // Générer le QR code
    QRCode.toCanvas(
      canvasRef.current,
      qrData,
      {
        width: size,
        margin: 2,
        color: {
          dark: '#4F46E5', // Indigo
          light: '#FFFFFF',
        },
      },
      (err) => {
        if (err) {
          console.error('Failed to generate QR code:', err);
          setError('Impossible de générer le QR code');
        }
      }
    );
  }, [data, size]);

  if (error) {
    return (
      <div className="flex items-center justify-center w-full h-full bg-red-50 dark:bg-red-900/20 rounded-lg p-4">
        <p className="text-red-600 dark:text-red-400">{error}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <canvas
        ref={canvasRef}
        className="rounded-lg shadow-lg border-4 border-white dark:border-gray-700"
      />
      <div className="text-center">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Scannez ce QR code avec votre autre appareil
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-500 mt-1 font-mono break-all max-w-xs">
          ID: {data.pairing_id.substring(0, 20)}...
        </p>
      </div>
    </div>
  );
}

/**
 * Composant pour scanner des QR codes (utilise la caméra)
 */
interface QRCodeScannerProps {
  onScan: (data: PairingQRData) => void;
  onError?: (error: string) => void;
}

export function QRCodeScanner({ onScan, onError }: QRCodeScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  /**
   * Démarre le scan de QR code
   */
  const startScanning = async () => {
    try {
      // Demander l'accès à la caméra
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }, // Caméra arrière sur mobile
      });

      setStream(mediaStream);

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        await videoRef.current.play();
        setIsScanning(true);
        setError(null);

        // Démarrer la détection
        scanFrame();
      }
    } catch (err) {
      const errorMsg = 'Impossible d\'accéder à la caméra';
      setError(errorMsg);
      if (onError) onError(errorMsg);
      console.error('Camera access error:', err);
    }
  };

  /**
   * Arrête le scan
   */
  const stopScanning = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setIsScanning(false);
  };

  /**
   * Scanne un frame vidéo pour détecter un QR code
   */
  const scanFrame = async () => {
    if (!videoRef.current || !isScanning) return;

    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    try {
      // Importer jsQR dynamiquement (évite les erreurs SSR)
      const jsQR = (await import('jsqr')).default;
      const code = jsQR(imageData.data, imageData.width, imageData.height);

      if (code && code.data) {
        try {
          const qrData: PairingQRData = JSON.parse(code.data);

          // Valider que c'est bien un QR code de pairing 4NK
          if (qrData.pairing_id && qrData.relay_url && qrData.creator_address) {
            console.log('✅ QR Code detected:', qrData.pairing_id);
            stopScanning();
            onScan(qrData);
            return;
          }
        } catch (e) {
          // Pas un QR code 4NK valide, continuer à scanner
        }
      }
    } catch (e) {
      console.error('QR scan error:', e);
    }

    // Continuer à scanner
    if (isScanning) {
      requestAnimationFrame(scanFrame);
    }
  };

  // Nettoyer au démontage
  useEffect(() => {
    return () => {
      stopScanning();
    };
  }, []);

  return (
    <div className="flex flex-col items-center gap-4">
      {!isScanning ? (
        <button
          onClick={startScanning}
          className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
        >
          📷 Scanner un QR Code
        </button>
      ) : (
        <div className="relative">
          <video
            ref={videoRef}
            className="w-full max-w-md rounded-lg"
            playsInline
          />
          <button
            onClick={stopScanning}
            className="absolute top-4 right-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
          >
            Arrêter
          </button>
          <div className="absolute inset-0 border-4 border-indigo-500 rounded-lg pointer-events-none" />
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
          <p className="text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      {isScanning && (
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Positionnez le QR code dans le cadre
        </p>
      )}
    </div>
  );
}

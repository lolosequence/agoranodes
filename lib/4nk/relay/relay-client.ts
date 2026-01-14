/**
 * Client WebSocket pour le relay 4NK
 * Gère la connexion temps réel avec le serveur relay pour la synchronisation multi-device
 *
 * ⚠️ MODE MOCK : En attendant le déploiement du relay en production,
 * ce client simule les communications
 */

export interface RelayMessage {
  flag: string;
  content: string;
  timestamp?: number;
}

export interface CommitMessage {
  process_id: string;
  pcd_commitment: string;
  validation_tokens: string[];
}

export interface HandshakeMessage {
  relay_version: string;
  network: string;
}

type MessageHandler = (message: RelayMessage) => void;

/**
 * Client WebSocket pour communiquer avec le relay 4NK
 */
export class RelayClient {
  private ws: WebSocket | null = null;
  private url: string;
  private reconnectAttempts = 0;
  private maxReconnectDelay = 30000; // 30 secondes max
  private reconnectTimeout: NodeJS.Timeout | null = null;
  private messageHandlers: Map<string, MessageHandler[]> = new Map();
  private isConnected = false;
  private shouldReconnect = true;
  private mockMode = true; // ⚠️ Mode mock activé par défaut

  constructor(url?: string) {
    // URL par défaut (sera remplacée par la vraie URL en production)
    const defaultUrl = typeof window !== 'undefined'
      ? (window as any).ENV?.NEXT_PUBLIC_4NK_RELAY_URL || 'wss://relay.agoranodes.org'
      : 'wss://relay.agoranodes.org';
    this.url = url || defaultUrl;

    // Si pas d'URL valide, passer en mode mock
    if (!this.url.startsWith('ws://') && !this.url.startsWith('wss://')) {
      console.warn('⚠️ No valid relay URL, using MOCK mode');
      this.mockMode = true;
    }
  }

  /**
   * Se connecte au relay WebSocket
   */
  connect(): void {
    if (this.mockMode) {
      console.log('🔧 [MOCK] Relay client in MOCK mode - no real connection');
      this.isConnected = true;
      this.emitHandshake();
      return;
    }

    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      console.log('✅ Already connected to relay');
      return;
    }

    try {
      console.log(`🔌 Connecting to relay: ${this.url}`);
      this.ws = new WebSocket(this.url);

      this.ws.onopen = () => {
        console.log('✅ Connected to relay');
        this.isConnected = true;
        this.reconnectAttempts = 0;
        this.emitHandshake();
      };

      this.ws.onmessage = (event) => {
        try {
          const message: RelayMessage = JSON.parse(event.data);
          this.handleMessage(message);
        } catch (error) {
          console.error('❌ Failed to parse relay message:', error);
        }
      };

      this.ws.onerror = (error) => {
        console.error('❌ Relay WebSocket error:', error);
      };

      this.ws.onclose = () => {
        console.log('🔌 Disconnected from relay');
        this.isConnected = false;

        if (this.shouldReconnect) {
          this.scheduleReconnect();
        }
      };
    } catch (error) {
      console.error('❌ Failed to connect to relay:', error);
      this.scheduleReconnect();
    }
  }

  /**
   * Déconnexion propre
   */
  disconnect(): void {
    this.shouldReconnect = false;

    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }

    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }

    this.isConnected = false;
    console.log('✅ Relay client disconnected');
  }

  /**
   * Planifie une reconnexion avec backoff exponentiel
   */
  private scheduleReconnect(): void {
    if (!this.shouldReconnect) return;

    const delay = Math.min(
      1000 * Math.pow(2, this.reconnectAttempts),
      this.maxReconnectDelay
    );

    console.log(`🔄 Reconnecting in ${delay}ms (attempt ${this.reconnectAttempts + 1})`);

    this.reconnectTimeout = setTimeout(() => {
      this.reconnectAttempts++;
      this.connect();
    }, delay);
  }

  /**
   * Envoie un message au relay
   */
  send(message: RelayMessage): void {
    if (this.mockMode) {
      console.log('🔧 [MOCK] Sending message:', message);
      // En mode mock, simuler une réponse immédiate
      setTimeout(() => {
        this.handleMessage({
          flag: 'Ack',
          content: JSON.stringify({ status: 'received', original_flag: message.flag }),
          timestamp: Date.now(),
        });
      }, 100);
      return;
    }

    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      console.error('❌ Cannot send message: not connected');
      return;
    }

    try {
      this.ws.send(JSON.stringify(message));
      console.log('📤 Message sent:', message.flag);
    } catch (error) {
      console.error('❌ Failed to send message:', error);
    }
  }

  /**
   * Envoie un message de commit (pour les processus)
   */
  sendCommitMessage(commit: CommitMessage): void {
    this.send({
      flag: 'Commit',
      content: JSON.stringify(commit),
      timestamp: Date.now(),
    });
  }

  /**
   * Enregistre un handler pour un type de message
   */
  on(flag: string, handler: MessageHandler): void {
    if (!this.messageHandlers.has(flag)) {
      this.messageHandlers.set(flag, []);
    }
    this.messageHandlers.get(flag)!.push(handler);
  }

  /**
   * Supprime un handler
   */
  off(flag: string, handler: MessageHandler): void {
    const handlers = this.messageHandlers.get(flag);
    if (handlers) {
      const index = handlers.indexOf(handler);
      if (index > -1) {
        handlers.splice(index, 1);
      }
    }
  }

  /**
   * Gère les messages reçus
   */
  private handleMessage(message: RelayMessage): void {
    console.log('📥 Message received:', message.flag);

    const handlers = this.messageHandlers.get(message.flag);
    if (handlers) {
      handlers.forEach(handler => {
        try {
          handler(message);
        } catch (error) {
          console.error('❌ Error in message handler:', error);
        }
      });
    }

    // Handler générique pour tous les messages
    const allHandlers = this.messageHandlers.get('*');
    if (allHandlers) {
      allHandlers.forEach(handler => {
        try {
          handler(message);
        } catch (error) {
          console.error('❌ Error in wildcard handler:', error);
        }
      });
    }
  }

  /**
   * Émet un message de handshake après connexion
   */
  private emitHandshake(): void {
    const handshake: HandshakeMessage = {
      relay_version: '0.1.0',
      network: 'testnet',
    };

    this.send({
      flag: 'Handshake',
      content: JSON.stringify(handshake),
      timestamp: Date.now(),
    });
  }

  /**
   * Vérifie si le client est connecté
   */
  isConnectedToRelay(): boolean {
    return this.isConnected;
  }

  /**
   * Active/désactive le mode mock
   */
  setMockMode(enabled: boolean): void {
    this.mockMode = enabled;
    console.log(`🔧 Mock mode ${enabled ? 'enabled' : 'disabled'}`);
  }
}

/**
 * Instance singleton du client relay
 */
let relayClientInstance: RelayClient | null = null;

/**
 * Récupère l'instance singleton du client relay
 */
export function getRelayClient(): RelayClient {
  if (!relayClientInstance) {
    relayClientInstance = new RelayClient();
  }
  return relayClientInstance;
}

/**
 * Réinitialise le client relay (utile pour les tests)
 */
export function resetRelayClient(): void {
  if (relayClientInstance) {
    relayClientInstance.disconnect();
    relayClientInstance = null;
  }
}

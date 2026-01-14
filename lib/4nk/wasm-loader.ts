/**
 * Chargeur WASM pour sdk_client 4NK
 * Gère l'initialisation et le chargement du module WASM
 *
 * Mode actuel : MOCK (en attendant la compilation WASM)
 */

import mockWasmModule from './mock-wasm';

// Module WASM (sera importé dynamiquement)
let wasmModule: any = null;
let isInitialized = false;

// Flag pour basculer entre mock et vrai WASM
const USE_MOCK = true; // ⚠️ Passer à false quand le WASM sera compilé

/**
 * Initialise le module WASM 4NK
 * Cette fonction doit être appelée avant toute autre opération 4NK
 */
export async function init4nkWasm(): Promise<any> {
  if (wasmModule && isInitialized) {
    return wasmModule;
  }

  try {
    if (USE_MOCK) {
      // Mode MOCK : Utilise le module simulé
      console.log('⚠️ Using MOCK WASM module (for development)');
      wasmModule = mockWasmModule;

      // Appel de la fonction setup() simulée
      if (typeof wasmModule.setup === 'function') {
        wasmModule.setup();
      }

      isInitialized = true;
      console.log('✅ 4NK MOCK WASM initialized successfully');
      return wasmModule;
    } else {
      // Mode PRODUCTION : Charge le vrai WASM
      // @ts-expect-error - Le module WASM sera disponible après compilation
      wasmModule = await import('@/public/4nk-wasm/sdk_client');

      // Initialisation du module WASM
      await wasmModule.default();

      // Appel de la fonction setup() pour initialiser le logger
      if (typeof wasmModule.setup === 'function') {
        wasmModule.setup();
      }

      isInitialized = true;
      console.log('✅ 4NK WASM module initialized successfully');
      return wasmModule;
    }
  } catch (error) {
    console.error('❌ Failed to initialize 4NK WASM module:', error);
    throw new Error(`Failed to load 4NK WASM: ${error}`);
  }
}

/**
 * Vérifie si le module WASM est initialisé
 */
export function isWasmInitialized(): boolean {
  return isInitialized;
}

/**
 * Récupère le module WASM (doit être initialisé au préalable)
 */
export function getWasmModule(): any {
  if (!wasmModule || !isInitialized) {
    throw new Error('WASM module not initialized. Call init4nkWasm() first.');
  }
  return wasmModule;
}

/**
 * Réinitialise le module (utile pour les tests)
 */
export function resetWasmModule(): void {
  wasmModule = null;
  isInitialized = false;
}

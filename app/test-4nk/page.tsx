'use client';

import { useState, useEffect } from 'react';
import { init4nkWasm } from '@/lib/4nk/wasm-loader';
import { truncateAddress } from '@/lib/4nk/crypto-utils';
import type { User } from '@/lib/4nk/types';

/**
 * Page de test du module WASM 4NK (mode MOCK)
 * Cette page permet de vérifier que le mock fonctionne correctement
 */
export default function Test4NKPage() {
  const [wasmInitialized, setWasmInitialized] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [password, setPassword] = useState('test1234');
  const [label, setLabel] = useState('Test User');

  // Initialiser le WASM au chargement
  useEffect(() => {
    const initWasm = async () => {
      try {
        await init4nkWasm();
        setWasmInitialized(true);
      } catch (err) {
        setError(`Failed to initialize WASM: ${err}`);
      }
    };

    initWasm();
  }, []);

  // Créer un nouvel utilisateur
  const handleCreateUser = async () => {
    setLoading(true);
    setError(null);

    try {
      const wasmModule = await init4nkWasm();
      const userDataStr = wasmModule.create_user(password, label);
      const userData: User = JSON.parse(userDataStr);

      setUser(userData);
      console.log('✅ User created:', userData);
    } catch (err) {
      setError(`Error creating user: ${err}`);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Se connecter avec l'utilisateur existant
  const handleLogin = async () => {
    if (!user) {
      setError('No user to login with. Please create a user first.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const wasmModule = await init4nkWasm();
      const userDataStr = wasmModule.login_user(password, user.mainAddress);
      const userData: User = JSON.parse(userDataStr);

      console.log('✅ User logged in:', userData);
      alert('Login successful!');
    } catch (err) {
      setError(`Error logging in: ${err}`);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Récupérer les processus
  const handleGetProcesses = async () => {
    setLoading(true);
    setError(null);

    try {
      const wasmModule = await init4nkWasm();
      const processesStr = wasmModule.get_processes();
      const processes = JSON.parse(processesStr);

      console.log('✅ Processes:', processes);
      alert(`Found ${processes.length} processes`);
    } catch (err) {
      setError(`Error getting processes: ${err}`);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Test 4NK WASM Mock
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Page de test pour vérifier que le module WASM (mock) fonctionne
          </p>
          <div className="mt-4">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              wasmInitialized
                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
            }`}>
              {wasmInitialized ? '✅ WASM Initialized' : '⏳ Initializing...'}
            </span>
          </div>
        </header>

        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg dark:bg-red-900 dark:border-red-700 dark:text-red-200">
            <strong>Error:</strong> {error}
          </div>
        )}

        {/* User Creation Form */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
            1. Create User
          </h2>

          <div className="space-y-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Label
              </label>
              <input
                type="text"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
          </div>

          <button
            onClick={handleCreateUser}
            disabled={!wasmInitialized || loading}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
          >
            {loading ? 'Creating...' : 'Create User'}
          </button>
        </div>

        {/* User Info Display */}
        {user && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-6">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
              User Information
            </h2>

            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">Label</label>
                <p className="text-gray-900 dark:text-white font-mono">{user.label}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">Main Address</label>
                <p className="text-gray-900 dark:text-white font-mono text-sm break-all">
                  {user.mainAddress}
                  <span className="ml-2 text-gray-500">({truncateAddress(user.mainAddress)})</span>
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">Recovery Address</label>
                <p className="text-gray-900 dark:text-white font-mono text-sm break-all">
                  {user.recoverAddress}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">Recovery Phrase</label>
                <p className="text-gray-900 dark:text-white font-mono text-sm">
                  {user.recoveryPhrase}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">Created At</label>
                <p className="text-gray-900 dark:text-white">{new Date(user.createdAt).toLocaleString()}</p>
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        {user && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-6">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
              2. Test Actions
            </h2>

            <div className="space-x-4">
              <button
                onClick={handleLogin}
                disabled={loading}
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 transition"
              >
                Test Login
              </button>

              <button
                onClick={handleGetProcesses}
                disabled={loading}
                className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-400 transition"
              >
                Get Processes
              </button>
            </div>
          </div>
        )}

        {/* Back Link */}
        <div className="text-center">
          <a
            href="/"
            className="text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            ← Retour à l'accueil
          </a>
        </div>
      </div>
    </div>
  );
}

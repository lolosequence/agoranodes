'use client';

import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Shield, ChevronDown } from 'lucide-react';
import { useConsent } from '@/lib/consent/hooks/useConsent';
import type { ConsentPreferences } from '@/lib/consent/consent-context';

interface CategoryConfig {
  key: keyof ConsentPreferences;
  label: string;
  description: string;
  required: boolean;
}

const categories: CategoryConfig[] = [
  {
    key: 'functional',
    label: 'Cookies fonctionnels',
    description:
      'Ces cookies sont essentiels au fonctionnement du site. Ils permettent la navigation, la gestion de votre session et la securite de vos donnees.',
    required: true,
  },
  {
    key: 'analytics',
    label: 'Cookies analytiques',
    description:
      'Ces cookies nous permettent de mesurer l\'audience du site et d\'analyser le comportement des visiteurs pour ameliorer l\'experience. Non utilises actuellement.',
    required: false,
  },
  {
    key: 'marketing',
    label: 'Cookies marketing',
    description:
      'Ces cookies sont utilises pour afficher des contenus et publicites pertinents en fonction de vos centres d\'interet. Non utilises actuellement.',
    required: false,
  },
];

function Toggle({
  checked,
  disabled,
  onChange,
}: {
  checked: boolean;
  disabled?: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => !disabled && onChange(!checked)}
      className={`
        relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent
        transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2
        focus-visible:ring-indigo-500 focus-visible:ring-offset-2
        ${checked ? 'bg-indigo-600' : 'bg-gray-300 dark:bg-gray-600'}
        ${disabled ? 'opacity-60 cursor-not-allowed' : ''}
      `}
    >
      <span
        className={`
          pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-sm
          ring-0 transition-transform duration-200 ease-in-out
          ${checked ? 'translate-x-5' : 'translate-x-0'}
        `}
      />
    </button>
  );
}

function CategorySection({
  config,
  checked,
  expanded,
  onToggle,
  onExpand,
}: {
  config: CategoryConfig;
  checked: boolean;
  expanded: boolean;
  onToggle: (value: boolean) => void;
  onExpand: () => void;
}) {
  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
      <button
        type="button"
        onClick={onExpand}
        className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
      >
        <div className="flex items-center gap-3 min-w-0">
          <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
            {config.label}
          </span>
          {config.required && (
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-300">
              Requis
            </span>
          )}
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <div onClick={(e) => e.stopPropagation()}>
            <Toggle checked={checked} disabled={config.required} onChange={onToggle} />
          </div>
          <ChevronDown
            size={16}
            className={`text-gray-400 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}
          />
        </div>
      </button>
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-3 text-sm text-gray-600 dark:text-gray-400">
              {config.description}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function CookieConsent() {
  const { hasConsented, loading, acceptAll, refuseAll, savePreferences } = useConsent();

  const [localPrefs, setLocalPrefs] = useState<ConsentPreferences>({
    functional: true,
    analytics: false,
    marketing: false,
  });
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  const showModal = !loading && !hasConsented;

  // Scroll lock
  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [showModal]);

  const handleToggle = (key: keyof ConsentPreferences, value: boolean) => {
    if (key === 'functional') return;
    setLocalPrefs((prev) => ({ ...prev, [key]: value }));
  };

  const handleExpand = (key: string) => {
    setExpandedCategory((prev) => (prev === key ? null : key));
  };

  const handleSave = () => {
    savePreferences(localPrefs);
  };

  return (
    <AnimatePresence>
      {showModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 px-4"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6 sm:p-8">
              {/* Header */}
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/50">
                  <Shield size={20} className="text-indigo-600 dark:text-indigo-400" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                  Gestion des cookies
                </h2>
              </div>

              {/* Intro */}
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                Nous utilisons des cookies pour assurer le bon fonctionnement de notre site.
                Vous pouvez choisir les categories de cookies que vous souhaitez autoriser.
                Votre choix sera conserve pendant 13 mois.
              </p>

              {/* Categories */}
              <div className="space-y-3 mb-6">
                {categories.map((cat) => (
                  <CategorySection
                    key={cat.key}
                    config={cat}
                    checked={localPrefs[cat.key]}
                    expanded={expandedCategory === cat.key}
                    onToggle={(value) => handleToggle(cat.key, value)}
                    onExpand={() => handleExpand(cat.key)}
                  />
                ))}
              </div>

              {/* Privacy link */}
              <p className="text-xs text-gray-500 dark:text-gray-500 mb-6">
                En savoir plus dans notre{' '}
                <a
                  href="/politique-de-confidentialite"
                  className="text-indigo-600 dark:text-indigo-400 underline hover:text-indigo-700 dark:hover:text-indigo-300"
                >
                  politique de confidentialite
                </a>
                .
              </p>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={refuseAll}
                  className="flex-1 px-4 py-2.5 text-sm font-medium rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Tout refuser
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  className="flex-1 px-4 py-2.5 text-sm font-medium rounded-lg border border-indigo-300 dark:border-indigo-600 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-colors"
                >
                  Enregistrer mes choix
                </button>
                <button
                  type="button"
                  onClick={acceptAll}
                  className="flex-1 px-4 py-2.5 text-sm font-medium rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
                >
                  Tout accepter
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

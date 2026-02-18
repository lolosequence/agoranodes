import Link from 'next/link';
import { Github, Twitter } from 'lucide-react';

const navLinks = [
  { href: '/', label: 'Accueil' },
  { href: '/how-it-works', label: 'Explications' },
  { href: '/publications', label: 'Publications' },
  { href: '/forum', label: 'Forum' },
  { href: '/framework', label: 'Framework' },
];

const socialLinks = [
  { href: 'https://github.com/agoranodes-org', label: 'GitHub', icon: Github },
  { href: 'https://twitter.com/agoranodes', label: 'Twitter', icon: Twitter },
];

export function Footer() {
  return (
    <footer className="border-t border-gray-200 dark:border-white/10 bg-white dark:bg-[#0B1121]">
      <div className="w-[90%] lg:w-[85%] mx-auto py-12">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
          {/* Navigation */}
          <nav className="flex flex-wrap gap-x-6 gap-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-gray-600 dark:text-neutral-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Social */}
          <div className="flex items-center gap-4">
            {socialLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={link.label}
                className="text-gray-500 dark:text-neutral-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
              >
                <link.icon size={20} />
              </a>
            ))}
          </div>
        </div>

        {/* Copyright */}
        <p className="mt-8 text-xs text-gray-500 dark:text-neutral-500">
          &copy; 2026 Agoranodes - Propuls&eacute; par 4NK &amp; Bitcoin
        </p>
      </div>
    </footer>
  );
}

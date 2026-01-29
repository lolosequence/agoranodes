'use client';

import React, { useState, useRef, useEffect, ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home } from 'lucide-react';
import { motion } from 'framer-motion';
import { AuthButton } from './auth-button';
import { ThemeToggle } from './theme-toggle';

const menuItems = [
  { href: '/', icon: <Home size={18} />, label: null },
  { href: '/how-it-works', icon: null, label: 'Explications' },
  { href: '/publications', icon: null, label: 'Publications' },
  { href: '/forum', icon: null, label: 'Forum' },
  { href: '/framework', icon: null, label: 'Framework' },
];

interface NavbarProps {
  variant?: 'transparent' | 'solid';
  actions?: ReactNode;
}

export function Navbar({ variant = 'solid', actions }: NavbarProps) {
  const logoClass = variant === 'transparent'
    ? 'text-white'
    : 'text-gray-900 dark:text-white';

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 h-20 transition-all bg-transparent">
      <Link href="/" className="flex items-center cursor-pointer">
        <span className={`text-xl font-bold tracking-tight ${logoClass}`}>
          Agoranodes
        </span>
      </Link>

      <NavMenu variant={variant} />

      <div className="flex items-center gap-3">
        {actions}
        <ThemeToggle />
        <AuthButton />
      </div>
    </nav>
  );
}

function NavMenu({ variant }: { variant: 'transparent' | 'solid' }) {
  const pathname = usePathname();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [pillStyle, setPillStyle] = useState({ left: 0, width: 0 });
  const itemRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  // Determine active index based on current path
  const activeIndex = menuItems.findIndex((item) => {
    if (item.href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(item.href);
  });

  useEffect(() => {
    const targetIndex = hoveredIndex !== null ? hoveredIndex : activeIndex;
    const targetEl = itemRefs.current[targetIndex];
    const containerEl = containerRef.current;

    if (targetEl && containerEl) {
      const containerRect = containerEl.getBoundingClientRect();
      const targetRect = targetEl.getBoundingClientRect();
      setPillStyle({
        left: targetRect.left - containerRect.left,
        width: targetRect.width,
      });
    }
  }, [hoveredIndex, activeIndex]);

  return (
    <div
      ref={containerRef}
      className="hidden md:flex items-center gap-0.5 bg-[#000000]/70 px-1.5 py-1.5 rounded-full relative"
      onMouseLeave={() => setHoveredIndex(null)}
    >
      {/* Sliding pill background */}
      <motion.div
        className="absolute bg-white rounded-full h-[calc(100%-12px)] top-1.5"
        animate={{
          left: pillStyle.left,
          width: pillStyle.width,
        }}
        transition={{
          type: 'spring',
          stiffness: 400,
          damping: 30,
        }}
      />

      {menuItems.map((item, index) => (
        <Link
          key={item.href}
          href={item.href}
          ref={(el) => {
            itemRefs.current[index] = el;
          }}
          onMouseEnter={() => setHoveredIndex(index)}
          className={`
            relative z-10 flex items-center justify-center px-4 py-1.5 rounded-full text-sm font-medium transition-colors
            ${
              (hoveredIndex !== null ? hoveredIndex === index : activeIndex === index)
                ? 'text-neutral-900'
                : 'text-white'
            }
            ${item.icon && !item.label ? 'px-2.5' : ''}
          `}
        >
          {item.icon}
          {item.label && <span>{item.label}</span>}
        </Link>
      ))}
    </div>
  );
}

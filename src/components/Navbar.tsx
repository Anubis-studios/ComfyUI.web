import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface NavbarProps {
  activeSection: string;
}

const navItems = [
  { id: 'hero', label: 'Home' },
  { id: 'stack', label: 'Stack' },
  { id: 'monorepo', label: 'Structure' },
  { id: 'phase-1', label: 'Phase 1' },
  { id: 'phase-2', label: 'Phase 2' },
  { id: 'phase-3', label: 'Phase 3' },
  { id: 'phase-4', label: 'Phase 4' },
  { id: 'automation', label: 'Automation' },
  { id: 'mission-control', label: 'Monitor' },
  { id: 'parity', label: 'Verification' },
];

export function Navbar({ activeSection }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'glass-card shadow-lg shadow-cyan-glow/5' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <a href="#hero" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-glow to-purple-glow flex items-center justify-center font-bold text-sm">
              CU
            </div>
            <span className="font-bold text-lg bg-gradient-to-r from-cyan-glow to-purple-glow bg-clip-text text-transparent">
              ComfyUnity
            </span>
          </a>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className={`px-3 py-1.5 rounded-md text-sm transition-all duration-200 ${
                  activeSection === item.id
                    ? 'bg-cyan-glow/10 text-cyan-glow border border-cyan-glow/30'
                    : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
                }`}
              >
                {item.label}
              </a>
            ))}
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 rounded-md text-gray-400 hover:text-white"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:hidden glass-card border-t border-cyan-glow/10"
        >
          <div className="px-4 py-3 space-y-1">
            {navItems.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={() => setMobileOpen(false)}
                className={`block px-3 py-2 rounded-md text-sm transition-all ${
                  activeSection === item.id
                    ? 'bg-cyan-glow/10 text-cyan-glow'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {item.label}
              </a>
            ))}
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
}

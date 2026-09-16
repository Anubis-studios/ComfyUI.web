import { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { StackTable } from './components/StackTable';
import { MonorepoStructure } from './components/MonorepoStructure';
import { PhaseSection } from './components/PhaseSection';
import { AutomationTriggers } from './components/AutomationTriggers';
import { ParityLock } from './components/ParityLock';
import { Footer } from './components/Footer';
import { phases, Phase } from './data/phases';

export default function App() {
  const [activeSection, setActiveSection] = useState('hero');

  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll('section[id]');
      let current = 'hero';
      sections.forEach((section) => {
        const el = section as HTMLElement;
        if (window.scrollY >= el.offsetTop - 200) {
          current = el.id;
        }
      });
      setActiveSection(current);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-cyber-900 text-gray-200 overflow-x-hidden">
      <Navbar activeSection={activeSection} />
      
      <main>
        <Hero />
        <StackTable />
        <MonorepoStructure />
        
        {phases.map((phase: Phase, index: number) => (
          <PhaseSection key={phase.id} phase={phase} index={index} />
        ))}
        
        <AutomationTriggers />
        <ParityLock />
      </main>
      
      <Footer />
    </div>
  );
}

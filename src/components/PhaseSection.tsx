import { motion } from 'framer-motion';
import { useState } from 'react';
import { Phase } from '../data/phases';

interface PhaseSectionProps {
  phase: Phase;
  index: number;
}

const colorMap: Record<string, { bg: string; text: string; border: string; glow: string }> = {
  cyan: { bg: 'bg-cyan-glow/10', text: 'text-cyan-glow', border: 'border-cyan-glow/20', glow: 'shadow-cyan-glow/10' },
  purple: { bg: 'bg-purple-glow/10', text: 'text-purple-glow', border: 'border-purple-glow/20', glow: 'shadow-purple-glow/10' },
  green: { bg: 'bg-green-glow/10', text: 'text-green-glow', border: 'border-green-glow/20', glow: 'shadow-green-glow/10' },
  orange: { bg: 'bg-orange-glow/10', text: 'text-orange-glow', border: 'border-orange-glow/20', glow: 'shadow-orange-glow/10' },
};

function SyntaxHighlight({ code, language }: { code: string; language: string }) {
  const highlightLine = (line: string): string => {
    let result = line;
    
    // Comments
    result = result.replace(/(\/\/.*$|#.*$)/gm, '<span class="token-comment">$1</span>');
    
    // Strings
    result = result.replace(/(["'`])((?:(?!\1).)*)\1/g, '<span class="token-string">$1$2$1</span>');
    
    // Keywords
    const keywords = ['import', 'export', 'from', 'const', 'let', 'var', 'function', 'class', 'return', 'async', 'await', 'static', 'if', 'else', 'for', 'forEach', 'def', 'RUN', 'FROM', 'WORKDIR', 'EXPOSE', 'CMD', 'COPY', 'ENV', 'apiVersion', 'kind', 'metadata', 'spec', 'name', 'run', 'steps', 'uses', 'on', 'push', 'jobs', 'branches'];
    keywords.forEach(kw => {
      const regex = new RegExp(`\\b(${kw})\\b`, 'g');
      result = result.replace(regex, '<span class="token-keyword">$1</span>');
    });
    
    // Types
    const types = ['string', 'number', 'boolean', 'any', 'void', 'Record', 'Array', 'Promise', 'WebSocket', 'FastAPI', 'Deployment', 'HorizontalPodAutoscaler'];
    types.forEach(t => {
      const regex = new RegExp(`\\b(${t})\\b`, 'g');
      result = result.replace(regex, '<span class="token-type">$1</span>');
    });
    
    return result;
  };

  const lines = code.split('\n');

  return (
    <div className="code-block overflow-x-auto">
      <div className="flex items-center justify-between px-4 py-2 border-b border-cyan-glow/10 bg-cyber-800/50">
        <span className="text-xs text-gray-500 font-mono">{language}</span>
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-500/60" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
          <div className="w-3 h-3 rounded-full bg-green-500/60" />
        </div>
      </div>
      <pre className="p-4 text-sm leading-relaxed">
        <code>
          {lines.map((line, i) => (
            <div key={i} className="flex">
              <span className="text-gray-600 select-none w-8 text-right mr-4 shrink-0">{i + 1}</span>
              <span dangerouslySetInnerHTML={{ __html: highlightLine(line) || '&nbsp;' }} />
            </div>
          ))}
        </code>
      </pre>
    </div>
  );
}

export function PhaseSection({ phase, index }: PhaseSectionProps) {
  const [activeTab, setActiveTab] = useState(0);
  const colors = colorMap[phase.color] || colorMap.cyan;
  const isEven = index % 2 === 0;

  return (
    <section id={phase.id} className="py-24 px-4 relative">
      {/* Background accent */}
      <div className={`absolute inset-0 opacity-30 ${colors.bg}`} style={{
        maskImage: 'radial-gradient(ellipse at center, black 0%, transparent 70%)',
        WebkitMaskImage: 'radial-gradient(ellipse at center, black 0%, transparent 70%)',
      }} />

      <div className="max-w-6xl mx-auto relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          {/* Phase Header */}
          <div className={`flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-start gap-8 mb-12`}>
            <div className="flex-1">
              <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${colors.bg} ${colors.text} border ${colors.border} mb-4`}>
                <span className="text-lg">{phase.icon}</span>
                <span className="text-sm font-medium">Phase {phase.number}</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-2">
                {phase.title}
              </h2>
              <p className={`text-lg ${colors.text} mb-4 font-medium`}>
                {phase.subtitle}
              </p>
              <p className="text-gray-400 leading-relaxed">
                {phase.description}
              </p>
            </div>
            
            <div className={`w-24 h-24 rounded-2xl ${colors.bg} border ${colors.border} flex items-center justify-center text-5xl shrink-0 animate-float`}>
              {phase.icon}
            </div>
          </div>

          {/* Code Tabs */}
          {phase.codeBlocks.length > 1 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {phase.codeBlocks.map((block, i) => (
                <button
                  key={i}
                  onClick={() => setActiveTab(i)}
                  className={`px-4 py-2 rounded-lg text-xs font-mono transition-all ${
                    activeTab === i
                      ? `${colors.bg} ${colors.text} border ${colors.border}`
                      : 'text-gray-500 hover:text-gray-300 bg-cyber-800/50'
                  }`}
                >
                  {block.filename}
                </button>
              ))}
            </div>
          )}

          {/* Code Display */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {phase.codeBlocks.length === 1 ? (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-sm font-mono text-gray-400">{phase.codeBlocks[0].filename}</span>
                </div>
                <SyntaxHighlight code={phase.codeBlocks[0].code} language={phase.codeBlocks[0].language} />
              </div>
            ) : (
              <div>
                <SyntaxHighlight code={phase.codeBlocks[activeTab].code} language={phase.codeBlocks[activeTab].language} />
              </div>
            )}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

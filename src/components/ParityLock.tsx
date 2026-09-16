import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

const checks = [
  {
    id: 1,
    title: 'Node Rendering',
    description: 'Every node in /object_info renders on Web Canvas AND Mobile Canvas',
    icon: '🎨',
    status: 'pass',
  },
  {
    id: 2,
    title: 'Execution Flow',
    description: 'A workflow started on Mobile finishes on Web history tab',
    icon: '⚡',
    status: 'pass',
  },
  {
    id: 3,
    title: 'Real-time Sync',
    description: 'Progress bars update simultaneously on both devices via WebSocket',
    icon: '🔄',
    status: 'pass',
  },
  {
    id: 4,
    title: 'Offline Resilience',
    description: 'Mobile app loads cached workflows when network is disconnected',
    icon: '📡',
    status: 'pass',
  },
  {
    id: 5,
    title: 'Auto-Scaling',
    description: 'Submitting 10 concurrent jobs triggers Kubernetes HPA to spin up new GPU pods',
    icon: '📈',
    status: 'pass',
  },
];

export function ParityLock() {
  const [animatedChecks, setAnimatedChecks] = useState<number[]>([]);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isVisible && animatedChecks.length < checks.length) {
      const timer = setTimeout(() => {
        setAnimatedChecks(prev => [...prev, prev.length]);
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [isVisible, animatedChecks.length]);

  return (
    <section id="parity" className="py-24 px-4 relative">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          onViewportEnter={() => setIsVisible(true)}
          className="text-center mb-16"
        >
          <h2 className="text-sm font-semibold text-green-glow uppercase tracking-wider mb-3">
            Final Verification
          </h2>
          <h3 className="text-4xl sm:text-5xl font-bold mb-4">
            The <span className="bg-gradient-to-r from-green-glow to-cyan-glow bg-clip-text text-transparent">Parity Lock</span>
          </h3>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Before the pipeline completes, it validates every single feature across all platforms.
          </p>
        </motion.div>

        <div className="space-y-4">
          {checks.map((check, index) => (
            <motion.div
              key={check.id}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="glass-card rounded-xl p-5 flex items-center gap-4 group hover:border-green-glow/30 transition-all"
            >
              <div className="w-12 h-12 rounded-lg bg-green-glow/10 flex items-center justify-center text-2xl shrink-0">
                {check.icon}
              </div>
              
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-white mb-1">{check.title}</h4>
                <p className="text-sm text-gray-400">{check.description}</p>
              </div>

              <motion.div
                initial={{ scale: 0 }}
                animate={animatedChecks.includes(index) ? { scale: 1 } : { scale: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="w-10 h-10 rounded-full bg-green-glow/20 border border-green-glow/40 flex items-center justify-center shrink-0"
              >
                <svg className="w-5 h-5 text-green-glow" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-12 text-center"
        >
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-green-glow/10 border border-green-glow/30">
            <span className="w-3 h-3 rounded-full bg-green-glow animate-pulse" />
            <span className="text-green-glow font-semibold">All 5/5 Checks Passed — Production Ready</span>
          </div>
        </motion.div>

        {/* Final Statement */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="mt-16 glass-card rounded-2xl p-8 text-center"
        >
          <p className="text-xl text-gray-300 leading-relaxed max-w-3xl mx-auto">
            This blueprint is <span className="text-cyan-glow font-semibold">fully stacked</span>, 
            <span className="text-purple-glow font-semibold"> fully automated</span>, and requires 
            <span className="text-green-glow font-semibold"> zero manual intervention</span> after 
            the initial repository setup. It delivers a production-grade ComfyUI ecosystem where 
            Web and Mobile are not separate products, but <span className="text-orange-glow font-semibold">two views of the same powerful engine</span>.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

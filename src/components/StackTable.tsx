import { motion } from 'framer-motion';

const stackItems = [
  { component: 'Core Engine', tech: 'Python 3.11 + ComfyUI (Headless)', role: 'Automated via Docker; auto-syncs nodes/models from Git', icon: '🐍', color: 'from-green-500 to-emerald-600' },
  { component: 'Logic Layer', tech: 'TypeScript (Shared Monorepo)', role: 'Shared state management, API clients, and workflow parsers', icon: '📘', color: 'from-blue-500 to-cyan-600' },
  { component: 'Web Shell', tech: 'Vue 3 + Vite + Tailwind', role: 'Auto-responsive; CSS Grid morphs from Desktop Graph to Mobile Cards', icon: '🌐', color: 'from-purple-500 to-violet-600' },
  { component: 'Mobile Shell', tech: 'React Native + Expo', role: 'Native touch gestures; offline-first caching via WatermelonDB', icon: '📱', color: 'from-pink-500 to-rose-600' },
  { component: 'Orchestrator', tech: 'Kubernetes + ArgoCD', role: 'Self-healing infrastructure; auto-scales GPU pods based on queue depth', icon: '☸️', color: 'from-blue-600 to-indigo-600' },
  { component: 'CI/CD', tech: 'GitHub Actions', role: 'Single-commit trigger builds, tests parity, and deploys to cloud/local', icon: '🚀', color: 'from-orange-500 to-amber-600' },
];

export function StackTable() {
  return (
    <section id="stack" className="py-24 px-4 relative">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-sm font-semibold text-cyan-glow uppercase tracking-wider mb-3">
            Technology Stack
          </h2>
          <h3 className="text-4xl sm:text-5xl font-bold mb-4">
            The <span className="bg-gradient-to-r from-cyan-glow to-purple-glow bg-clip-text text-transparent">ComfyUnity</span> Stack
          </h3>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Six core components working in perfect harmony, each automated for zero-touch deployment.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {stackItems.map((item, index) => (
            <motion.div
              key={item.component}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="glass-card rounded-xl p-6 hover:border-cyan-glow/30 transition-all duration-300 group"
            >
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${item.color} flex items-center justify-center text-2xl shrink-0 group-hover:scale-110 transition-transform`}>
                  {item.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-white mb-1">{item.component}</h4>
                  <p className="text-sm text-cyan-glow font-mono mb-2">{item.tech}</p>
                  <p className="text-sm text-gray-400">{item.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Architecture Flow */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-16 glass-card rounded-2xl p-8"
        >
          <h4 className="text-lg font-semibold text-center mb-6 text-gray-300">Data Flow Architecture</h4>
          <div className="flex flex-wrap items-center justify-center gap-3 text-sm">
            {['User Input', '→', 'Web/Mobile Shell', '→', 'Shared Core Logic', '→', 'FastAPI Gateway', '→', 'ComfyUI Engine', '→', 'GPU Processing'].map((item, i) => (
              item === '→' ? (
                <span key={i} className="text-cyan-glow font-bold">→</span>
              ) : (
                <span key={i} className="px-3 py-1.5 rounded-md bg-cyber-700 text-gray-300 border border-cyber-600">
                  {item}
                </span>
              )
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

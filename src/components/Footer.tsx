import { motion } from 'framer-motion';

export function Footer() {
  return (
    <footer className="relative py-16 px-4 border-t border-cyber-700">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-glow to-purple-glow flex items-center justify-center font-bold text-white">
              CU
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-cyan-glow to-purple-glow bg-clip-text text-transparent">
              ComfyUnity
            </span>
          </div>

          <p className="text-gray-500 text-sm mb-6 max-w-md mx-auto">
            The Single-Phase Master Blueprint — Zero-to-Production specification 
            designed to be executed as one continuous automated pipeline.
          </p>

          <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-500 mb-8">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-cyan-glow" />
              Python 3.11
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-400" />
              TypeScript
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-purple-glow" />
              Vue 3
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-pink-400" />
              React Native
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-indigo-400" />
              Kubernetes
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-orange-glow" />
              GitHub Actions
            </span>
          </div>

          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {['Architecture', 'Shared Logic', 'Infrastructure', 'Frontends', 'CI/CD', 'Verification'].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase().replace('/', '-')}`}
                className="text-xs text-gray-600 hover:text-gray-400 transition-colors"
              >
                {item}
              </a>
            ))}
          </div>

          <div className="pt-8 border-t border-cyber-700">
            <p className="text-xs text-gray-600">
              ComfyUnity Blueprint • Write Once, Deploy Everywhere • {new Date().getFullYear()}
            </p>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}

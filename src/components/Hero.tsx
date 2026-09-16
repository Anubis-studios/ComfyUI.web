import { motion } from 'framer-motion';

export function Hero() {
  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-cyber-900 via-cyber-800 to-cyber-900" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-glow/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-glow/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-cyan-glow/5 to-purple-glow/5 rounded-full blur-3xl animate-gradient" />
        
        {/* Grid overlay */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `linear-gradient(rgba(6, 182, 212, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(6, 182, 212, 0.3) 1px, transparent 1px)`,
          backgroundSize: '60px 60px'
        }} />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-8">
            <span className="w-2 h-2 rounded-full bg-green-glow animate-pulse" />
            <span className="text-sm text-gray-300">Single-Phase Master Blueprint</span>
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-5xl sm:text-7xl lg:text-8xl font-black mb-6 leading-tight"
        >
          <span className="bg-gradient-to-r from-cyan-glow via-blue-400 to-purple-glow bg-clip-text text-transparent">
            ComfyUnity
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-xl sm:text-2xl text-gray-400 mb-4 max-w-3xl mx-auto"
        >
          Zero-to-Production
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="text-lg text-gray-500 mb-12 max-w-2xl mx-auto"
        >
          A fully automated, production-grade ComfyUI ecosystem where Web and Mobile 
          are not separate products, but two views of the same powerful engine.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-wrap justify-center gap-4"
        >
          <a
            href="#stack"
            className="px-8 py-3 rounded-lg bg-gradient-to-r from-cyan-glow to-blue-500 text-white font-semibold hover:shadow-lg hover:shadow-cyan-glow/30 transition-all duration-300 hover:-translate-y-0.5"
          >
            Explore Architecture
          </a>
          <a
            href="#phase-1"
            className="px-8 py-3 rounded-lg glass-card text-gray-300 font-semibold hover:text-white hover:border-cyan-glow/40 transition-all duration-300"
          >
            View Phases →
          </a>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-20 grid grid-cols-2 sm:grid-cols-4 gap-4"
        >
          {[
            { value: '6', label: 'Core Components' },
            { value: '4', label: 'Automation Phases' },
            { value: '0', label: 'Manual Steps' },
            { value: '∞', label: 'Scale Potential' },
          ].map((stat) => (
            <div key={stat.label} className="glass-card rounded-xl p-4">
              <div className="text-3xl font-bold bg-gradient-to-r from-cyan-glow to-purple-glow bg-clip-text text-transparent">
                {stat.value}
              </div>
              <div className="text-sm text-gray-500 mt-1">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-6 h-10 rounded-full border-2 border-gray-600 flex items-start justify-center p-1.5"
        >
          <div className="w-1.5 h-1.5 rounded-full bg-cyan-glow" />
        </motion.div>
      </motion.div>
    </section>
  );
}

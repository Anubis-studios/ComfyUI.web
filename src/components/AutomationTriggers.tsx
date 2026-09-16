import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useCallback } from 'react';

interface PipelineStage {
  id: string;
  name: string;
  icon: string;
  description: string;
  duration: number;
  details: string[];
  color: string;
}

const pipelineStages: PipelineStage[] = [
  {
    id: 'trigger',
    name: 'Git Push Trigger',
    icon: '🔔',
    description: 'Detecting push to main branch',
    duration: 800,
    details: ['Webhook received', 'Branch: main', 'Commit: feat: update workflow parser'],
    color: 'cyan',
  },
  {
    id: 'checkout',
    name: 'Repository Checkout',
    icon: '📥',
    description: 'Cloning repository & installing dependencies',
    duration: 1200,
    details: ['actions/checkout@v4', 'npm ci — 847 packages', 'Cache restored: node_modules'],
    color: 'blue',
  },
  {
    id: 'core-build',
    name: 'Build Shared Core',
    icon: '📘',
    description: 'Compiling @comfy-unity/core logic package',
    duration: 1500,
    details: ['tsc --noEmit ✓', 'Building parser module', 'Building API client', 'Type definitions exported'],
    color: 'indigo',
  },
  {
    id: 'web-build',
    name: 'Build Web App',
    icon: '🌐',
    description: 'Compiling Vue 3 frontend with Vite',
    duration: 2000,
    details: ['Vite build — 392 modules', 'Tree-shaking complete', 'CSS purged: 36.48 kB', 'Bundle: 288.96 kB'],
    color: 'purple',
  },
  {
    id: 'mobile-build',
    name: 'Build Mobile App',
    icon: '📱',
    description: 'Expo EAS build for Android',
    duration: 2500,
    details: ['eas build --platform android', 'Gradle sync complete', 'APK generated: 42.3 MB', 'Artifact uploaded'],
    color: 'pink',
  },
  {
    id: 'docker',
    name: 'Build Docker Images',
    icon: '🐳',
    description: 'Building container images for infrastructure',
    duration: 3000,
    details: ['comfy-core: CUDA 12.4 + ComfyUI', 'comfy-gateway: FastAPI + httpx', 'Layers cached: 12/14', 'Pushed to registry.local'],
    color: 'blue',
  },
  {
    id: 'parity-test',
    name: 'Parity Testing',
    icon: '🧪',
    description: 'Cross-platform validation suite',
    duration: 4000,
    details: ['Playwright: Chromium ✓', 'Playwright: Firefox ✓', 'Detox: Android Emulator ✓', '5/5 parity checks passed'],
    color: 'green',
  },
  {
    id: 'deploy-k8s',
    name: 'Deploy to Kubernetes',
    icon: '☸️',
    description: 'Rolling update to production cluster',
    duration: 3500,
    details: ['kubectl set image comfy-core', 'kubectl set image comfy-gateway', 'Rolling update: 3/3 pods ready', 'HPA configured: 1-5 replicas'],
    color: 'orange',
  },
  {
    id: 'smoke-test',
    name: 'Post-Deploy Validation',
    icon: '✅',
    description: 'Live endpoint health verification',
    duration: 1000,
    details: ['GET /health → 200 OK', 'WebSocket /ws → Connected', 'Response time: 47ms', 'All systems operational'],
    color: 'green',
  },
];

const colorClasses: Record<string, { bg: string; border: string; text: string; glow: string }> = {
  cyan: { bg: 'bg-cyan-500/10', border: 'border-cyan-500/30', text: 'text-cyan-400', glow: 'shadow-cyan-500/20' },
  blue: { bg: 'bg-blue-500/10', border: 'border-blue-500/30', text: 'text-blue-400', glow: 'shadow-blue-500/20' },
  indigo: { bg: 'bg-indigo-500/10', border: 'border-indigo-500/30', text: 'text-indigo-400', glow: 'shadow-indigo-500/20' },
  purple: { bg: 'bg-purple-500/10', border: 'border-purple-500/30', text: 'text-purple-400', glow: 'shadow-purple-500/20' },
  pink: { bg: 'bg-pink-500/10', border: 'border-pink-500/30', text: 'text-pink-400', glow: 'shadow-pink-500/20' },
  green: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', text: 'text-emerald-400', glow: 'shadow-emerald-500/20' },
  orange: { bg: 'bg-orange-500/10', border: 'border-orange-500/30', text: 'text-orange-400', glow: 'shadow-orange-500/20' },
};

type PipelineStatus = 'idle' | 'running' | 'complete' | 'failed';

export function AutomationTriggers() {
  const [status, setStatus] = useState<PipelineStatus>('idle');
  const [activeStage, setActiveStage] = useState(-1);
  const [completedStages, setCompletedStages] = useState<number[]>([]);
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);
  const [triggerCount, setTriggerCount] = useState(0);
  const [autoMode, setAutoMode] = useState(false);

  const addLog = useCallback((msg: string) => {
    setLogs(prev => [...prev.slice(-20), msg]);
  }, []);

  const runPipeline = useCallback(async () => {
    setStatus('running');
    setActiveStage(-1);
    setCompletedStages([]);
    setProgress(0);
    setLogs([]);
    setTriggerCount(prev => prev + 1);

    addLog('⚡ Pipeline triggered by push to main');
    await delay(500);

    for (let i = 0; i < pipelineStages.length; i++) {
      setActiveStage(i);
      const stage = pipelineStages[i];
      addLog(`▶ [${stage.name}] ${stage.description}`);
      
      // Simulate stage progress
      const steps = stage.details.length;
      for (let j = 0; j < steps; j++) {
        await delay(stage.duration / steps);
        addLog(`  ${stage.details[j]}`);
      }
      
      setCompletedStages(prev => [...prev, i]);
      setProgress(Math.round(((i + 1) / pipelineStages.length) * 100));
      addLog(`✓ [${stage.name}] Complete`);
      await delay(300);
    }

    setStatus('complete');
    addLog('🎉 Pipeline complete — All stages passed');
  }, [addLog]);

  useEffect(() => {
    if (autoMode && status === 'idle') {
      const timer = setTimeout(() => {
        runPipeline();
      }, 2000);
      return () => clearTimeout(timer);
    }
    if (autoMode && status === 'complete') {
      const timer = setTimeout(() => {
        setStatus('idle');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [autoMode, status, runPipeline]);

  const reset = () => {
    setStatus('idle');
    setActiveStage(-1);
    setCompletedStages([]);
    setProgress(0);
    setLogs([]);
  };

  return (
    <section id="automation" className="py-24 px-4 relative">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-cyan-500/5 to-transparent rounded-full blur-3xl" />
      </div>

      <div className="max-w-6xl mx-auto relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-sm font-semibold text-orange-400 uppercase tracking-wider mb-3">
            Zero-Touch Deployment
          </h2>
          <h3 className="text-4xl sm:text-5xl font-bold mb-4">
            Automated <span className="bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent">Trigger Chain</span>
          </h3>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Every push to the repository fires the complete automation pipeline — 
            from build to deploy to verification — with zero manual intervention.
          </p>
        </motion.div>

        {/* Trigger Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-card rounded-2xl p-6 mb-8"
        >
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${
                status === 'running' ? 'bg-orange-500/20 animate-pulse' :
                status === 'complete' ? 'bg-emerald-500/20' :
                'bg-cyber-700'
              }`}>
                {status === 'running' ? '🔄' : status === 'complete' ? '✅' : '🚀'}
              </div>
              <div>
                <h4 className="font-semibold text-white">
                  {status === 'running' ? 'Pipeline Running...' :
                   status === 'complete' ? 'Deployment Complete' :
                   'Ready to Deploy'}
                </h4>
                <p className="text-sm text-gray-500">
                  {status === 'running' ? `Stage ${activeStage + 1} of ${pipelineStages.length}` :
                   status === 'complete' ? `${triggerCount} deployment${triggerCount !== 1 ? 's' : ''} completed` :
                   'Push to main to trigger automation'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <span className="text-xs text-gray-400">Auto Mode</span>
                <div 
                  onClick={() => setAutoMode(!autoMode)}
                  className={`w-10 h-5 rounded-full transition-colors relative cursor-pointer ${
                    autoMode ? 'bg-orange-500' : 'bg-cyber-700'
                  }`}
                >
                  <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${
                    autoMode ? 'translate-x-5' : 'translate-x-0.5'
                  }`} />
                </div>
              </label>

              {status === 'idle' && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={runPipeline}
                  className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold text-sm hover:shadow-lg hover:shadow-orange-500/30 transition-all"
                >
                  <span className="flex items-center gap-2">
                    <span>git push origin main</span>
                    <span>→</span>
                  </span>
                </motion.button>
              )}
              {status === 'complete' && (
                <button
                  onClick={reset}
                  className="px-5 py-2.5 rounded-lg bg-cyber-700 text-gray-300 font-semibold text-sm hover:bg-cyber-600 transition-all"
                >
                  Reset
                </button>
              )}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-4">
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>Progress</span>
              <span>{progress}%</span>
            </div>
            <div className="h-2 rounded-full bg-cyber-700 overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-orange-500 via-amber-500 to-emerald-500"
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
        </motion.div>

        {/* Pipeline Stages */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Pipeline Visualization */}
          <div className="lg:col-span-2">
            <div className="glass-card rounded-2xl p-6">
              <h4 className="text-sm font-semibold text-gray-400 mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-orange-400" />
                Pipeline Stages
              </h4>
              
              <div className="space-y-2">
                {pipelineStages.map((stage, index) => {
                  const colors = colorClasses[stage.color];
                  const isActive = activeStage === index;
                  const isComplete = completedStages.includes(index);
                  const isPending = !isActive && !isComplete;

                  return (
                    <motion.div
                      key={stage.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`relative flex items-center gap-3 p-3 rounded-xl border transition-all duration-300 ${
                        isActive ? `${colors.bg} ${colors.border} shadow-lg ${colors.glow}` :
                        isComplete ? 'bg-emerald-500/5 border-emerald-500/20' :
                        'bg-cyber-800/30 border-transparent'
                      }`}
                    >
                      {/* Status indicator */}
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm shrink-0 ${
                        isActive ? `${colors.bg} ${colors.border} border` :
                        isComplete ? 'bg-emerald-500/20' :
                        'bg-cyber-700'
                      }`}>
                        {isActive ? (
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                            className="text-base"
                          >
                            ⚙️
                          </motion.div>
                        ) : isComplete ? (
                          <span className="text-emerald-400">✓</span>
                        ) : (
                          <span className="text-gray-600 text-xs">{index + 1}</span>
                        )}
                      </div>

                      {/* Stage info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className={`text-sm font-medium ${
                            isActive ? colors.text :
                            isComplete ? 'text-emerald-400' :
                            'text-gray-400'
                          }`}>
                            {stage.name}
                          </span>
                          {isActive && (
                            <motion.span
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              className={`text-xs px-2 py-0.5 rounded-full ${colors.bg} ${colors.text}`}
                            >
                              running
                            </motion.span>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 truncate">{stage.description}</p>
                      </div>

                      {/* Duration */}
                      <span className="text-xs text-gray-600 font-mono shrink-0">
                        {(stage.duration / 1000).toFixed(1)}s
                      </span>

                      {/* Connector line */}
                      {index < pipelineStages.length - 1 && (
                        <div className="absolute -bottom-2 left-[2.1rem] w-px h-2 bg-cyber-700" />
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Live Logs */}
          <div className="lg:col-span-1">
            <div className="glass-card rounded-2xl p-6 h-full flex flex-col">
              <h4 className="text-sm font-semibold text-gray-400 mb-4 flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${status === 'running' ? 'bg-orange-400 animate-pulse' : 'bg-gray-600'}`} />
                Live Output
              </h4>
              
              <div className="flex-1 bg-cyber-900 rounded-xl p-4 overflow-y-auto max-h-[500px] font-mono text-xs">
                <AnimatePresence>
                  {logs.length === 0 ? (
                    <p className="text-gray-600 italic">Waiting for trigger...</p>
                  ) : (
                    logs.map((log, i) => (
                      <motion.div
                        key={`${i}-${log}`}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`py-0.5 ${
                          log.startsWith('✓') ? 'text-emerald-400' :
                          log.startsWith('⚡') ? 'text-orange-400' :
                          log.startsWith('🎉') ? 'text-cyan-400' :
                          log.startsWith('▶') ? 'text-blue-400' :
                          'text-gray-500'
                        }`}
                      >
                        {log}
                      </motion.div>
                    ))
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>

        {/* Trigger Sources */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-card rounded-2xl p-6"
        >
          <h4 className="text-sm font-semibold text-gray-400 mb-4 text-center">
            Automatic Trigger Sources
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { trigger: 'git push origin main', desc: 'Direct push to main', icon: '📤' },
              { trigger: 'Pull Request merged', desc: 'Auto-deploy on merge', icon: '🔀' },
              { trigger: 'Release tag created', desc: 'v*.*.*  tag triggers', icon: '🏷️' },
              { trigger: 'Schedule (cron)', desc: 'Nightly rebuild at 00:00', icon: '⏰' },
            ].map((item) => (
              <div key={item.trigger} className="bg-cyber-800/50 rounded-xl p-4 border border-cyber-700 hover:border-orange-500/30 transition-all group">
                <div className="text-xl mb-2">{item.icon}</div>
                <code className="text-xs text-orange-400 font-mono block mb-1">{item.trigger}</code>
                <p className="text-xs text-gray-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Workflow YAML Preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-8"
        >
          <details className="glass-card rounded-2xl overflow-hidden group">
            <summary className="p-6 cursor-pointer flex items-center justify-between hover:bg-white/5 transition-colors">
              <div className="flex items-center gap-3">
                <span className="text-xl">📋</span>
                <div>
                  <h4 className="font-semibold text-white text-sm">.github/workflows/deploy-all.yml</h4>
                  <p className="text-xs text-gray-500">The master automation script — click to expand</p>
                </div>
              </div>
              <motion.span
                className="text-gray-500"
                animate={{ rotate: 0 }}
              >
                ▼
              </motion.span>
            </summary>
            <div className="px-6 pb-6">
              <pre className="code-block p-4 text-xs overflow-x-auto">
                <code className="text-gray-300">{`name: ComfyUnity Full Stack Deploy
on:
  push:
    branches: [main]
  pull_request:
    types: [closed]
    branches: [main]
  release:
    types: [published]
  schedule:
    - cron: '0 0 * * *'

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      # 1. Build Shared Core
      - name: Install Dependencies
        run: npm ci

      - name: Build Shared Packages
        run: npx turbo run build --filter=@comfy-unity/core

      # 2. Build Frontends
      - name: Build Web App
        run: npx turbo run build --filter=web

      - name: Build Mobile App (Expo EAS)
        run: eas build --platform android --non-interactive

      # 3. Build Infrastructure
      - name: Build Docker Images
        run: |
          docker build -t comfy-core ./infra/docker/comfy-core
          docker build -t comfy-gateway ./infra/docker/gateway

      # 4. Parity Testing
      - name: Run Parity Tests
        run: |
          npx playwright test --project=chromium
          npx detox test --configuration android.emu.release

      # 5. Deploy to Kubernetes
      - name: Deploy to Cluster
        run: |
          kubectl set image deployment/comfy-core \\
            comfy-core=comfy-core:\${{ github.sha }}
          kubectl set image deployment/comfy-gateway \\
            comfy-gateway=comfy-gateway:\${{ github.sha }}
          kubectl rollout status deployment/comfy-core
          kubectl rollout status deployment/comfy-gateway

      # 6. Post-Deploy Validation
      - name: Smoke Test Live Endpoint
        run: curl -f https://api.comfyunity.com/health`}</code>
              </pre>
            </div>
          </details>
        </motion.div>
      </div>
    </section>
  );
}

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

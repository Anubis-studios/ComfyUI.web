import { motion } from 'framer-motion';
import { useState } from 'react';

interface TreeNode {
  name: string;
  type: 'folder' | 'file';
  description?: string;
  children?: TreeNode[];
}

const treeData: TreeNode = {
  name: 'comfy-unity/',
  type: 'folder',
  children: [
    {
      name: 'apps/',
      type: 'folder',
      children: [
        {
          name: 'web/',
          type: 'folder',
          description: 'Vue 3 Frontend',
          children: [
            { name: 'src/', type: 'folder', children: [
              { name: 'components/', type: 'folder', description: 'Responsive GraphCanvas, NodePalette' },
              { name: 'layouts/', type: 'folder', description: 'AdaptiveLayout (Sidebar vs BottomNav)' },
            ]},
            { name: 'vite.config.ts', type: 'file' },
          ]
        },
        {
          name: 'mobile/',
          type: 'folder',
          description: 'React Native Frontend',
          children: [
            { name: 'src/', type: 'folder', children: [
              { name: 'screens/', type: 'folder', description: 'GenerateScreen, EditorScreen' },
              { name: 'hooks/', type: 'folder', description: 'useTouchGraph, useOfflineQueue' },
            ]},
            { name: 'app.json', type: 'file' },
          ]
        },
      ]
    },
    {
      name: 'packages/',
      type: 'folder',
      children: [
        {
          name: 'core/',
          type: 'folder',
          description: 'SHARED LOGIC (The Parity Engine)',
          children: [
            { name: 'api/', type: 'folder', description: 'Unified Axios/Fetch client' },
            { name: 'parser/', type: 'folder', description: 'Workflow JSON ↔ UI State converter' },
            { name: 'types/', type: 'folder', description: 'Shared TypeScript interfaces' },
          ]
        },
        {
          name: 'config/',
          type: 'folder',
          description: 'Shared ESLint, Prettier, TSConfig',
        },
      ]
    },
    {
      name: 'infra/',
      type: 'folder',
      children: [
        {
          name: 'docker/',
          type: 'folder',
          children: [
            { name: 'comfy-core/', type: 'folder', description: 'Headless ComfyUI Dockerfile' },
            { name: 'gateway/', type: 'folder', description: 'FastAPI Gateway Dockerfile' },
          ]
        },
        { name: 'k8s/', type: 'folder', description: 'Kubernetes Manifests' },
      ]
    },
    {
      name: '.github/',
      type: 'folder',
      children: [
        { name: 'workflows/', type: 'folder', children: [
          { name: 'deploy-all.yml', type: 'file', description: 'The Single-Phase Automation Script' },
        ]},
      ]
    },
  ]
};

function TreeItem({ node, depth = 0 }: { node: TreeNode; depth?: number }) {
  const [expanded, setExpanded] = useState(depth < 2);
  const hasChildren = node.children && node.children.length > 0;

  return (
    <div className={`${depth > 0 ? 'ml-4 sm:ml-6' : ''}`}>
      <button
        onClick={() => hasChildren && setExpanded(!expanded)}
        className={`flex items-center gap-2 py-1 px-2 rounded-md w-full text-left hover:bg-white/5 transition-colors group ${
          hasChildren ? 'cursor-pointer' : 'cursor-default'
        }`}
      >
        {hasChildren && (
          <span className={`text-gray-500 transition-transform duration-200 text-xs ${expanded ? 'rotate-90' : ''}`}>
            ▶
          </span>
        )}
        {!hasChildren && <span className="w-3" />}
        
        <span className={node.type === 'folder' ? 'text-cyan-glow' : 'text-gray-400'}>
          {node.type === 'folder' ? '📁' : '📄'}
        </span>
        
        <span className={`font-mono text-sm ${node.type === 'folder' ? 'text-gray-200 font-medium' : 'text-gray-400'}`}>
          {node.name}
        </span>
        
        {node.description && (
          <span className="hidden sm:inline text-xs text-gray-500 ml-2 italic">
            — {node.description}
          </span>
        )}
      </button>
      
      {expanded && hasChildren && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="border-l border-cyan-glow/10 ml-3"
        >
          {node.children!.map((child, i) => (
            <TreeItem key={`${child.name}-${i}`} node={child} depth={depth + 1} />
          ))}
        </motion.div>
      )}
    </div>
  );
}

export function MonorepoStructure() {
  return (
    <section id="monorepo" className="py-24 px-4 relative">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-sm font-semibold text-purple-glow uppercase tracking-wider mb-3">
            Project Structure
          </h2>
          <h3 className="text-4xl sm:text-5xl font-bold mb-4">
            Monorepo Architecture
          </h3>
          <p className="text-gray-400 max-w-2xl mx-auto">
            A Turborepo structure where shared logic propagates automatically to all platforms.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="glass-card rounded-2xl p-6 sm:p-8 overflow-x-auto"
        >
          <TreeItem node={treeData} />
        </motion.div>

        {/* Key Principles */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4"
        >
          {[
            { icon: '🔗', title: 'Shared Core', desc: 'Single source of truth for all logic' },
            { icon: '🔄', title: 'Auto Propagation', desc: 'Changes flow to all platforms instantly' },
            { icon: '🎯', title: 'Type Safety', desc: 'Shared TypeScript interfaces everywhere' },
          ].map((item) => (
            <div key={item.title} className="glass-card rounded-xl p-4 text-center">
              <div className="text-2xl mb-2">{item.icon}</div>
              <h4 className="font-semibold text-white text-sm mb-1">{item.title}</h4>
              <p className="text-xs text-gray-500">{item.desc}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

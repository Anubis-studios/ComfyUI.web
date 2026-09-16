import { motion } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip, BarChart, Bar } from 'recharts';

// Simulated real-time data generators
function generateQueueData() {
  return Array.from({ length: 20 }, (_, i) => ({
    time: i,
    queue: Math.floor(Math.random() * 8) + 1,
    processing: Math.floor(Math.random() * 3),
  }));
}

function generateGpuMetrics() {
  return Array.from({ length: 30 }, (_, i) => ({
    time: i,
    utilization: Math.floor(40 + Math.random() * 55),
    memory: Math.floor(50 + Math.random() * 40),
    temp: Math.floor(55 + Math.random() * 20),
  }));
}

function generateLatencyData() {
  return Array.from({ length: 15 }, (_, i) => ({
    name: `P${i + 1}`,
    latency: Math.floor(20 + Math.random() * 80),
  }));
}

interface MetricCardProps {
  label: string;
  value: string | number;
  unit?: string;
  trend?: 'up' | 'down' | 'stable';
  color: string;
  icon: string;
}

function MetricCard({ label, value, unit, trend, color, icon }: MetricCardProps) {
  const [displayValue, setDisplayValue] = useState(value);

  useEffect(() => {
    setDisplayValue(value);
  }, [value]);

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      className="glass-card rounded-xl p-4 relative overflow-hidden group"
    >
      {/* Background glow */}
      <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br ${color} blur-xl`} />
      
      <div className="relative">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-gray-500 uppercase tracking-wider">{label}</span>
          <span className="text-lg">{icon}</span>
        </div>
        
        <div className="flex items-baseline gap-1">
          <motion.span
            key={displayValue}
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-2xl font-bold text-white"
          >
            {displayValue}
          </motion.span>
          {unit && <span className="text-sm text-gray-500">{unit}</span>}
        </div>
        
        {trend && (
          <div className={`flex items-center gap-1 mt-1 text-xs ${
            trend === 'up' ? 'text-emerald-400' :
            trend === 'down' ? 'text-red-400' :
            'text-gray-500'
          }`}>
            {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'}
            <span>{trend === 'up' ? '+12%' : trend === 'down' ? '-5%' : 'stable'}</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}

interface PodStatus {
  id: string;
  name: string;
  status: 'running' | 'scaling' | 'idle';
  gpu: number;
  queue: number;
}

function PodVisualization() {
  const [pods, setPods] = useState<PodStatus[]>([
    { id: '1', name: 'comfy-core-0', status: 'running', gpu: 78, queue: 3 },
    { id: '2', name: 'comfy-core-1', status: 'idle', gpu: 0, queue: 0 },
    { id: '3', name: 'comfy-core-2', status: 'idle', gpu: 0, queue: 0 },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setPods(prev => prev.map((pod, i) => {
        if (i === 0) {
          return {
            ...pod,
            gpu: Math.floor(60 + Math.random() * 35),
            queue: Math.floor(Math.random() * 6),
            status: 'running' as const,
          };
        }
        // Simulate scaling
        const shouldScale = Math.random() > 0.7;
        return {
          ...pod,
          status: shouldScale ? (pod.status === 'idle' ? 'scaling' : 'idle') : pod.status,
          gpu: pod.status === 'running' ? Math.floor(50 + Math.random() * 45) : 0,
          queue: pod.status === 'running' ? Math.floor(Math.random() * 4) : 0,
        };
      }));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-3">
      {pods.map((pod) => (
        <motion.div
          key={pod.id}
          layout
          className={`rounded-lg p-3 border transition-all ${
            pod.status === 'running' ? 'bg-emerald-500/5 border-emerald-500/20' :
            pod.status === 'scaling' ? 'bg-orange-500/5 border-orange-500/20' :
            'bg-cyber-800/30 border-cyber-700'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${
                pod.status === 'running' ? 'bg-emerald-400 animate-pulse' :
                pod.status === 'scaling' ? 'bg-orange-400 animate-pulse' :
                'bg-gray-600'
              }`} />
              <span className="text-xs font-mono text-gray-300">{pod.name}</span>
            </div>
            <span className={`text-xs px-2 py-0.5 rounded-full ${
              pod.status === 'running' ? 'bg-emerald-500/10 text-emerald-400' :
              pod.status === 'scaling' ? 'bg-orange-500/10 text-orange-400' :
              'bg-cyber-700 text-gray-500'
            }`}>
              {pod.status}
            </span>
          </div>
          
          {pod.status !== 'idle' && (
            <div className="grid grid-cols-2 gap-2">
              <div>
                <div className="text-xs text-gray-500 mb-1">GPU</div>
                <div className="h-1.5 rounded-full bg-cyber-700 overflow-hidden">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-500"
                    animate={{ width: `${pod.gpu}%` }}
                    transition={{ duration: 1 }}
                  />
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-500 mb-1">Queue</div>
                <div className="text-sm font-mono text-gray-300">{pod.queue} jobs</div>
              </div>
            </div>
          )}
        </motion.div>
      ))}
    </div>
  );
}

function ArchitectureDiagram() {
  const [activeFlow, setActiveFlow] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFlow(prev => (prev + 1) % 5);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const nodes = [
    { id: 'user', label: 'User', x: 50, y: 50, icon: '👤', color: 'cyan' },
    { id: 'web', label: 'Web Shell', x: 200, y: 30, icon: '🌐', color: 'purple' },
    { id: 'mobile', label: 'Mobile Shell', x: 200, y: 120, icon: '📱', color: 'pink' },
    { id: 'core', label: 'Shared Core', x: 370, y: 75, icon: '📘', color: 'blue' },
    { id: 'gateway', label: 'API Gateway', x: 530, y: 75, icon: '🔌', color: 'indigo' },
    { id: 'comfy', label: 'ComfyUI', x: 690, y: 75, icon: '🎨', color: 'green' },
  ];

  const connections = [
    { from: 'user', to: 'web' },
    { from: 'user', to: 'mobile' },
    { from: 'web', to: 'core' },
    { from: 'mobile', to: 'core' },
    { from: 'core', to: 'gateway' },
    { from: 'gateway', to: 'comfy' },
  ];

  const getNodePos = (id: string) => {
    const node = nodes.find(n => n.id === id);
    return node ? { x: node.x, y: node.y } : { x: 0, y: 0 };
  };

  return (
    <div className="relative w-full overflow-x-auto">
      <svg viewBox="0 0 780 170" className="w-full min-w-[600px] h-auto">
        {/* Connections */}
        {connections.map((conn, i) => {
          const from = getNodePos(conn.from);
          const to = getNodePos(conn.to);
          const isActive = i === activeFlow || i === activeFlow - 1;
          
          return (
            <g key={i}>
              <line
                x1={from.x + 30}
                y1={from.y + 20}
                x2={to.x - 10}
                y2={to.y + 20}
                stroke={isActive ? '#06b6d4' : '#374151'}
                strokeWidth={isActive ? 2 : 1}
                strokeDasharray={isActive ? '0' : '4 4'}
                opacity={isActive ? 1 : 0.5}
              />
              {isActive && (
                <motion.circle
                  r="4"
                  fill="#06b6d4"
                  initial={{ cx: from.x + 30, cy: from.y + 20 }}
                  animate={{ cx: to.x - 10, cy: to.y + 20 }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <animate attributeName="opacity" values="1;0.3;1" dur="1s" repeatCount="infinite" />
                </motion.circle>
              )}
            </g>
          );
        })}

        {/* Nodes */}
        {nodes.map((node) => (
          <g key={node.id}>
            <rect
              x={node.x - 10}
              y={node.y}
              width="80"
              height="40"
              rx="8"
              fill="rgba(17, 24, 39, 0.8)"
              stroke={
                node.color === 'cyan' ? '#06b6d4' :
                node.color === 'purple' ? '#a855f7' :
                node.color === 'pink' ? '#ec4899' :
                node.color === 'blue' ? '#3b82f6' :
                node.color === 'indigo' ? '#6366f1' :
                '#10b981'
              }
              strokeWidth="1"
              opacity="0.9"
            />
            <text
              x={node.x + 30}
              y={node.y + 16}
              textAnchor="middle"
              fontSize="14"
            >
              {node.icon}
            </text>
            <text
              x={node.x + 30}
              y={node.y + 34}
              textAnchor="middle"
              fontSize="9"
              fill="#9ca3af"
              fontFamily="monospace"
            >
              {node.label}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}

export function MissionControl() {
  const [queueData, setQueueData] = useState(generateQueueData());
  const [gpuMetrics, setGpuMetrics] = useState(generateGpuMetrics());
  const [latencyData, setLatencyData] = useState(generateLatencyData());
  const [activeConnections, setActiveConnections] = useState(847);
  const [uptime, setUptime] = useState('99.97%');
  const intervalRef = useRef<ReturnType<typeof setInterval>>();

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setQueueData(prev => {
        const newData = [...prev.slice(1), {
          time: prev[prev.length - 1].time + 1,
          queue: Math.floor(Math.random() * 8) + 1,
          processing: Math.floor(Math.random() * 3),
        }];
        return newData;
      });

      setGpuMetrics(prev => {
        const newData = [...prev.slice(1), {
          time: prev[prev.length - 1].time + 1,
          utilization: Math.floor(40 + Math.random() * 55),
          memory: Math.floor(50 + Math.random() * 40),
          temp: Math.floor(55 + Math.random() * 20),
        }];
        return newData;
      });

      setLatencyData(generateLatencyData());
      setActiveConnections(prev => prev + Math.floor(Math.random() * 20) - 10);
    }, 2000);

    return () => clearInterval(intervalRef.current);
  }, []);

  return (
    <section id="mission-control" className="py-24 px-4 relative">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-cyan-500/5 via-purple-500/5 to-pink-500/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-4">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-sm text-gray-300">Live System Monitor</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">
            Mission <span className="bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">Control</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Real-time visibility into the ComfyUnity ecosystem — GPU utilization, queue depth, 
            pod scaling, and cross-platform sync status.
          </p>
        </motion.div>

        {/* Metrics Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        >
          <MetricCard label="Active Connections" value={activeConnections} trend="up" color="from-cyan-500/20 to-transparent" icon="🔗" />
          <MetricCard label="GPU Utilization" value={`${gpuMetrics[gpuMetrics.length - 1]?.utilization || 0}`} unit="%" trend="stable" color="from-purple-500/20 to-transparent" icon="⚡" />
          <MetricCard label="Queue Depth" value={queueData[queueData.length - 1]?.queue || 0} unit="jobs" trend="down" color="from-orange-500/20 to-transparent" icon="📋" />
          <MetricCard label="Uptime" value={uptime} trend="stable" color="from-emerald-500/20 to-transparent" icon="🛡️" />
        </motion.div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Queue Depth Chart */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="glass-card rounded-2xl p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-semibold text-gray-300">Queue Depth & Processing</h4>
              <span className="text-xs text-gray-500 font-mono">Last 40s</span>
            </div>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={queueData}>
                  <defs>
                    <linearGradient id="queueGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="processGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="time" hide />
                  <YAxis hide />
                  <Tooltip
                    contentStyle={{ background: '#111827', border: '1px solid #374151', borderRadius: '8px' }}
                    labelStyle={{ color: '#9ca3af' }}
                  />
                  <Area type="monotone" dataKey="queue" stroke="#06b6d4" fill="url(#queueGradient)" strokeWidth={2} />
                  <Area type="monotone" dataKey="processing" stroke="#10b981" fill="url(#processGradient)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* GPU Metrics Chart */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="glass-card rounded-2xl p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-semibold text-gray-300">GPU Metrics</h4>
              <span className="text-xs text-gray-500 font-mono">Real-time</span>
            </div>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={gpuMetrics}>
                  <defs>
                    <linearGradient id="gpuGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="time" hide />
                  <YAxis hide domain={[0, 100]} />
                  <Tooltip
                    contentStyle={{ background: '#111827', border: '1px solid #374151', borderRadius: '8px' }}
                    labelStyle={{ color: '#9ca3af' }}
                  />
                  <Area type="monotone" dataKey="utilization" stroke="#a855f7" fill="url(#gpuGradient)" strokeWidth={2} name="Utilization %" />
                  <Area type="monotone" dataKey="memory" stroke="#f59e0b" fill="transparent" strokeWidth={1.5} strokeDasharray="4 4" name="Memory %" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>

        {/* Bottom Row: Pods + Architecture */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Pod Visualization */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-card rounded-2xl p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-semibold text-gray-300">Kubernetes Pods</h4>
              <span className="text-xs px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-400">
                Auto-scaling
              </span>
            </div>
            <PodVisualization />
          </motion.div>

          {/* Architecture Diagram */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2 glass-card rounded-2xl p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-semibold text-gray-300">Live Data Flow</h4>
              <span className="text-xs text-gray-500">Animated architecture</span>
            </div>
            <ArchitectureDiagram />
          </motion.div>
        </div>

        {/* WebSocket Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-8 glass-card rounded-2xl p-6"
        >
          <h4 className="text-sm font-semibold text-gray-300 mb-4">Real-time Sync Channels</h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { channel: 'ws://gateway/progress', status: 'connected', clients: 342, icon: '📊' },
              { channel: 'ws://gateway/history', status: 'connected', clients: 287, icon: '📜' },
              { channel: 'ws://gateway/notifications', status: 'connected', clients: 512, icon: '🔔' },
            ].map((ws) => (
              <div key={ws.channel} className="bg-cyber-800/50 rounded-xl p-4 border border-cyber-700">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs font-mono text-gray-400 truncate">{ws.channel}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-emerald-400">{ws.status}</span>
                  <span className="text-xs text-gray-500">{ws.icon} {ws.clients} clients</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

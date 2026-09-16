export interface CodeBlock {
  filename: string;
  language: string;
  code: string;
}

export interface Phase {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  icon: string;
  color: string;
  description: string;
  codeBlocks: CodeBlock[];
}

export const phases: Phase[] = [
  {
    id: 'phase-1',
    number: '01',
    title: 'Monorepo Structure & Shared Logic',
    subtitle: 'Write Once, Deploy Everywhere',
    icon: '📂',
    color: 'cyan',
    description: 'A Turborepo structure ensures that any change in logic automatically propagates to both Web and Mobile. The shared core acts as the "Parity Engine" — a single source of truth for workflow parsing, API communication, and type definitions.',
    codeBlocks: [
      {
        filename: 'packages/core/src/parser.ts',
        language: 'typescript',
        code: `import { WorkflowNode, Connection } from './types';

export class WorkflowParser {
  static toComfyPrompt(nodes: WorkflowNode[], connections: Connection[]) {
    // Converts UI state to ComfyUI's internal API format
    const prompt: Record<string, any> = {};
    nodes.forEach(node => {
      prompt[node.id] = {
        class_type: node.type,
        inputs: this.mapInputs(node.widgets, connections)
      };
    });
    return { prompt };
  }

  static fromComfyPrompt(apiResponse: any): WorkflowNode[] {
    // Converts API response back to UI state for both platforms
    return Object.entries(apiResponse.prompt).map(([id, data]: any) => ({
      id,
      type: data.class_type,
      widgets: data.inputs,
      position: data._meta?.position || [0, 0]
    }));
  }
}`
      }
    ]
  },
  {
    id: 'phase-2',
    number: '02',
    title: 'Automated Infrastructure Deployment',
    subtitle: 'Infrastructure as Code — Zero Manual Setup',
    icon: '⚙️',
    color: 'purple',
    description: 'Every piece of infrastructure is defined as code. From the headless ComfyUI Docker image to the FastAPI gateway with auto-discovery, to Kubernetes auto-scaling manifests — no manual server configuration required.',
    codeBlocks: [
      {
        filename: 'infra/docker/comfy-core/Dockerfile',
        language: 'dockerfile',
        code: `FROM nvidia/cuda:12.4.1-cudnn-runtime-ubuntu22.04
WORKDIR /app
RUN apt-get update && apt-get install -y git python3-pip
RUN git clone https://github.com/comfyanonymous/ComfyUI.git
WORKDIR /app/ComfyUI
RUN pip install -r requirements.txt
# Auto-install Manager for dynamic node parity
RUN cd custom_nodes && git clone https://github.com/ltdrdata/ComfyUI-Manager.git
EXPOSE 8188
CMD ["python", "main.py", "--listen", "0.0.0.0", "--port", "8188", "--disable-auto-launch"]`
      },
      {
        filename: 'infra/docker/gateway/main.py',
        language: 'python',
        code: `from fastapi import FastAPI, WebSocket
import httpx, json

app = FastAPI()
COMFY_URL = "http://comfy-core:8188"

@app.get("/api/v1/object_info")
async def get_node_schema():
    """Fetches live node schema for dynamic UI generation"""
    async with httpx.AsyncClient() as client:
        resp = await client.get(f"{COMFY_URL}/object_info")
        return resp.json()

@app.websocket("/ws/{client_id}")
async def proxy_ws(websocket: WebSocket, client_id: str):
    await websocket.accept()
    async with httpx.AsyncClient() as client:
        async with client.stream("GET", f"{COMFY_URL}/ws?clientId={client_id}") as stream:
            async for chunk in stream.aiter_bytes():
                await websocket.send_bytes(chunk)`
      },
      {
        filename: 'infra/k8s/deployment.yaml',
        language: 'yaml',
        code: `apiVersion: apps/v1
kind: Deployment
metadata:
  name: comfy-core
spec:
  replicas: 1
  selector:
    matchLabels:
      app: comfy-core
  template:
    spec:
      containers:
      - name: comfy-core
        image: registry.local/comfy-core:latest
        resources:
          limits:
            nvidia.com/gpu: 1
---
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: comfy-core-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: comfy-core
  minReplicas: 1
  maxReplicas: 5
  metrics:
  - type: Pods
    pods:
      metric:
        name: queue_depth
      target:
        type: AverageValue
        averageValue: "5"`
      }
    ]
  },
  {
    id: 'phase-3',
    number: '03',
    title: 'Adaptive Frontend Automation',
    subtitle: 'One Engine, Two Views',
    icon: '💻',
    color: 'green',
    description: 'Frontends are generated from shared components to ensure visual and functional parity. The Web shell uses Vue 3 with CSS Grid morphing, while the Mobile shell uses React Native with native touch gestures and offline-first caching.',
    codeBlocks: [
      {
        filename: 'apps/web/src/components/GraphCanvas.vue',
        language: 'vue',
        code: `<template>
  <div 
    ref="canvasRef"
    class="w-full h-full bg-gray-900 relative overflow-hidden"
    @wheel.prevent="handleZoom"
    @touchmove.prevent="handleTouchMove"
  >
    <NodeComponent 
      v-for="node in visibleNodes" 
      :key="node.id"
      :node="node"
      :scale="zoomLevel"
    />
    
    <!-- Mobile-only floating action button -->
    <FloatingParamsPanel v-if="isMobile" :selected-node="selectedNode" />
  </div>
</template>

<script setup lang="ts">
import { useResponsive } from '@comfy-unity/core/hooks';
const { isMobile, zoomLevel } = useResponsive();
// Touch gestures are normalized to match mouse events
</script>`
      },
      {
        filename: 'apps/mobile/src/screens/EditorScreen.tsx',
        language: 'tsx',
        code: `import { GestureHandler, State } from 'react-native-gesture-handler';
import { useSharedWorkflow } from '@comfy-unity/core/hooks';

export default function EditorScreen() {
  const { nodes, updateNodePosition } = useSharedWorkflow();

  const onPan = (event: any) => {
    if (event.nativeEvent.state === State.ACTIVE) {
      updateNodePosition(
        event.tag, 
        event.nativeEvent.translationX, 
        event.nativeEvent.translationY
      );
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#1a1a1a' }}>
      <GestureHandler onPan={onPan}>
        <GraphCanvas nodes={nodes} />
      </GestureHandler>
      
      {/* Native Bottom Sheet for Properties */}
      <BottomSheet>
        <PropertyEditor nodeId={selectedNodeId} />
      </BottomSheet>
    </View>
  );
}`
      }
    ]
  },
  {
    id: 'phase-4',
    number: '04',
    title: 'Single-Phase Automation Pipeline',
    subtitle: 'The Master Switch — One Commit, Full Deploy',
    icon: '🔄',
    color: 'orange',
    description: 'The GitHub Actions pipeline is the "Master Switch." Running it once builds, tests, and deploys the entire ecosystem — from shared core logic to Docker images to Kubernetes pods, with parity testing at every stage.',
    codeBlocks: [
      {
        filename: '.github/workflows/deploy-all.yml',
        language: 'yaml',
        code: `name: ComfyUnity Full Stack Deploy
on:
  push:
    branches: [main]

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
          kubectl set image deployment/comfy-core comfy-core=comfy-core:\${{ github.sha }}
          kubectl rollout status deployment/comfy-core

      # 6. Post-Deploy Validation
      - name: Smoke Test Live Endpoint
        run: curl -f https://api.comfyunity.com/health`
      }
    ]
  }
];

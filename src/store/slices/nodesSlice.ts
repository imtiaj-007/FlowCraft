import { create } from 'zustand';
import { applyNodeChanges, NodeChange } from 'reactflow';
import { FlowNode, MessageNodeData } from '@/types/flow';


interface NodesSlice {
    nodes: FlowNode[];
    selectedNode: FlowNode | null;
    setNodes: (nodes: FlowNode[]) => void;
    setSelectedNode: (node: FlowNode | null) => void;
    onNodesChange: (changes: NodeChange[]) => void;
    onUpdateNode: (id: string, data: Partial<MessageNodeData>) => void;
}

export const useNodesStore = create<NodesSlice>((set, get) => ({
    nodes: [],
    selectedNode: null,
    setNodes: (nodes) => set({ nodes: Array.isArray(nodes) ? nodes : [] }),
    setSelectedNode: (node) => set({ selectedNode: node }),
    onNodesChange: (changes) => {
        const currentNodes = get().nodes;
        if (!Array.isArray(currentNodes)) {
            console.error('Nodes is not an array:', currentNodes);
            set({ nodes: [] });
            return;
        }
        set({ nodes: applyNodeChanges(changes, currentNodes) });
    },
    onUpdateNode: (id, data) => {
        set((state) => {
            const currentNodes = Array.isArray(state.nodes) ? state.nodes : [];
            return {
                nodes: currentNodes.map((node) =>
                    node.id === id
                        ? { ...node, data: { ...node.data, ...data } }
                        : node
                ),
            };
        });
    },
}));
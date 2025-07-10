import { create } from 'zustand';
import { applyEdgeChanges, Connection, Edge, EdgeChange } from 'reactflow';
import { createEdge } from '@/lib/flow-helpers';
import { validateTargetNode } from '@/lib/flow-validation';
import { toast } from 'sonner';


interface EdgesSlice {
    edges: Edge[];
    setEdges: (edges: Edge[]) => void;
    onEdgesChange: (changes: EdgeChange[]) => void;
    onConnect: (connection: Connection) => void;
}

export const useEdgesStore = create<EdgesSlice>((set, get) => ({
    edges: [],
    setEdges: (edges) => set({ edges: Array.isArray(edges) ? edges : [] }),
    onEdgesChange: (changes) => {
        const currentEdges = get().edges;
        if (!Array.isArray(currentEdges)) {
            set({ edges: [] });
            return;
        }
        set({ edges: applyEdgeChanges(changes, currentEdges) });
    },
    onConnect: (connection) => {
        const currentEdges = get().edges;
        if (!connection.target) {
            toast.warning('Edge creation aborted.', {
                description: 'Connection target is not defined.'
            });
            return;
        }
        
        // Validate if the target node already has an incoming edge
        if (!validateTargetNode(currentEdges, connection.target)) {
            toast.warning('Edge creation aborted.', {
                description: 'Target node already has an incoming edge.'
            });
            return;
        }
        const newEdge: Edge = createEdge(connection);
        set((state) => ({ edges: [...state.edges, newEdge] }));
    },
}));
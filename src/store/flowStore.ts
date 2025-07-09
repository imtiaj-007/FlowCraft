import { Connection, Edge, EdgeChange, NodeChange } from 'reactflow';
import { useNodesStore } from './slices/nodesSlice';
import { useEdgesStore } from './slices/edgesSlice';
import { FlowNode, MessageNodeData } from '@/types/flow';
import { findNonOverlappingPosition } from '@/lib/flow-helpers';
import { flowConstants } from '@/constants/flowConstants';
import { createEdge, createNode } from '@/lib/flow-helpers';

// Define the combined store interface
interface FlowStore {
    nodes: FlowNode[];
    edges: Edge[];
    selectedNode: FlowNode | null;
    setNodes: (nodes: FlowNode[]) => void;
    setEdges: (edges: Edge[]) => void;
    setSelectedNode: (node: FlowNode | null) => void;
    onNodesChange: (changes: NodeChange[]) => void;
    onEdgesChange: (changes: EdgeChange[]) => void;
    onConnect: (connection: Connection) => void;
    onUpdateNode: (id: string, data: Partial<MessageNodeData>) => void;
    addMessageNode: (currentNode: FlowNode) => void;
}

// Create a custom hook to combine the slices reactively
export const useFlowStore = (): FlowStore => {
    const nodes = useNodesStore((state) => state.nodes);
    const edges = useEdgesStore((state) => state.edges);
    const selectedNode = useNodesStore((state) => state.selectedNode);
    const setNodes = useNodesStore((state) => state.setNodes);
    const setEdges = useEdgesStore((state) => state.setEdges);
    const setSelectedNode = useNodesStore((state) => state.setSelectedNode);
    const onNodesChange = useNodesStore((state) => state.onNodesChange);
    const onEdgesChange = useEdgesStore((state) => state.onEdgesChange);
    const onConnect = useEdgesStore((state) => state.onConnect);
    const onUpdateNode = useNodesStore((state) => state.onUpdateNode);

    const addMessageNode = (currentNode: FlowNode) => {
        const baseX = currentNode.position.x + flowConstants.HORIZONTAL_GAP;
        const baseY = currentNode.position.y;

        const position = findNonOverlappingPosition(baseX, baseY, nodes);
        const newNode = createNode('messageNode', position, { label: 'Send Message', text: '' });
        const newEdge = createEdge({ source: currentNode.id, target: newNode.id } as Connection, '#14b8a6');

        setNodes([...nodes, newNode]);
        setEdges([...edges, newEdge]);
    };

    return {
        nodes,
        edges,
        selectedNode,
        setNodes,
        setEdges,
        setSelectedNode,
        onNodesChange,
        onEdgesChange,
        onConnect,
        onUpdateNode,
        addMessageNode,
    };
};
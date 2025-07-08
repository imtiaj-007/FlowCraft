import { ReactElement, useCallback, useRef, useState } from "react";
import { v4 as uuid } from "uuid";
import ReactFlow, {
    addEdge, Background, BackgroundVariant, Connection,
    Controls, Edge, MiniMap, useEdgesState, useNodesState, useReactFlow
} from "reactflow";
import { Button } from "@/components/ui/button";
import { AlertCircle, Plus, Save } from "lucide-react";
import { FlowNode, MessageNodeData } from "@/types/flow";
import { nodeTypes } from "./nodes/node-types";
import { NodesPanel } from "./panels/nodes-panel";
import { SettingsPanel } from "./panels/settings-panel";


export const FlowBuilderCanvas: React.FC = (): ReactElement => {
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);
    const [selectedNode, setSelectedNode] = useState<FlowNode | null>(null);
    const [showNodesPanel, setShowNodesPanel] = useState(false);
    const [saveError, setSaveError] = useState<string | null>(null);

    const { screenToFlowPosition } = useReactFlow();
    const reactFlowWrapper = useRef<HTMLDivElement>(null);

    const onConnect = useCallback((params: Connection | Edge) => {
        // Check if source already has an edge
        const sourceHasEdge = edges.some(edge => edge.source === params.source);
        if (sourceHasEdge) {
            return; // Don't allow multiple edges from same source
        }

        const newEdge = {
            ...params,
            type: 'smoothstep',
            animated: true,
        };
        setEdges((eds) => addEdge(newEdge, eds));
    }, [edges, setEdges]);

    const onDragOver = useCallback((event: React.DragEvent) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    }, []);

    const onDrop = useCallback(
        (event: React.DragEvent) => {
            event.preventDefault();

            const type = event.dataTransfer.getData('application/reactflow');
            if (typeof type === 'undefined' || !type) return;

            const position = screenToFlowPosition({
                x: event.clientX,
                y: event.clientY,
            });

            const newNode: FlowNode = {
                id: `node-${uuid()}`,
                type,
                position,
                data: { label: 'Send Message', text: '' },
            };

            setNodes((nds) => nds.concat(newNode));
        },
        [screenToFlowPosition, setNodes]
    );

    const onNodeClick = useCallback((event: React.MouseEvent, node: unknown) => {
        setSelectedNode(node as FlowNode);
    }, []);

    const onPaneClick = useCallback(() => {
        setSelectedNode(null);
    }, []);

    const onUpdateNode = useCallback((id: string, data: Partial<MessageNodeData>) => {
        setNodes((nds) =>
            nds.map((node) =>
                node.id === id ? { ...node, data: { ...node.data, ...data } } : node
            )
        );
    }, [setNodes]);

    const validateFlow = useCallback(() => {
        if (nodes.length <= 1) return null;

        const nodesWithEmptyTargets = nodes.filter(node => {
            const hasIncomingEdge = edges.some(edge => edge.target === node.id);
            return !hasIncomingEdge;
        });

        if (nodesWithEmptyTargets.length > 1) {
            return 'Cannot save flow: More than one node has empty target handles';
        }

        return null;
    }, [nodes, edges]);

    const handleSave = useCallback(() => {
        const error = validateFlow();
        if (error) {
            setSaveError(error);
            setTimeout(() => setSaveError(null), 5000);
            return;
        }

        setSaveError(null);
        console.log('Flow saved successfully!', { nodes, edges });
        // Here you would typically send the flow to your backend
    }, [validateFlow, nodes, edges]);

    const onNodeDoubleClick = useCallback((e: React.MouseEvent, node: unknown) => {
        e.stopPropagation();
        setSelectedNode(node as FlowNode);
    }, []);

    return (
        <div className="w-full h-screen bg-gray-50 relative">
            {/* Top Toolbar */}
            <div className="absolute top-0 left-0 right-0 h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4 z-40">
                <div className="flex items-center gap-4">
                    <h1 className="text-lg font-semibold text-gray-900">Chatbot Flow Builder</h1>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowNodesPanel(!showNodesPanel)}
                    >
                        <Plus size={16} className="mr-2" />
                        Add Node
                    </Button>
                </div>

                <div className="flex items-center gap-2">
                    {saveError && (
                        <div className="flex items-center gap-2 text-red-600 text-sm">
                            <AlertCircle size={16} />
                            {saveError}
                        </div>
                    )}
                    <Button onClick={handleSave} className="flex items-center gap-2">
                        <Save size={16} />
                        Save Changes
                    </Button>
                </div>
            </div>

            {/* React Flow Canvas */}
            <div ref={reactFlowWrapper} className="w-full h-full pt-14">
                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onConnect={onConnect}
                    onDrop={onDrop}
                    onDragOver={onDragOver}
                    onNodeClick={onNodeClick}
                    onNodeDoubleClick={onNodeDoubleClick}
                    onPaneClick={onPaneClick}
                    nodeTypes={nodeTypes}
                    fitView
                >
                    <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
                    <Controls />
                    <MiniMap
                        nodeColor={'#14b8a6'}
                        maskColor="rgba(0,0,0,0.1)"
                    />
                </ReactFlow>
            </div>

            {/* Panels */}
            <NodesPanel
                isOpen={showNodesPanel}
                onClose={() => setShowNodesPanel(false)}
            />

            <SettingsPanel
                selectedNode={selectedNode}
                onUpdateNode={onUpdateNode}
                onClose={() => setSelectedNode(null)}
            />
        </div>
    );
};
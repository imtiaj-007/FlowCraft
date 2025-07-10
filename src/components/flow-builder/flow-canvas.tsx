import { ReactElement, useCallback, useRef, useState, useMemo } from "react";
import ReactFlow, { 
    Background, 
    BackgroundVariant, 
    Controls, 
    MiniMap, 
    useReactFlow
} from "reactflow";
import { FlowNode } from "@/types/flow";
import { useFlowStore } from "@/store/flowStore";
import { createNode } from "@/lib/flow-helpers";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Save, Settings } from "lucide-react";
import { nodeTypes } from "./nodes/node-types";
import { NodesPanel } from "./panels/nodes-panel";
import { SettingsPanel } from "./panels/settings-panel";

/**
 * `FlowBuilderCanvas` Component
 * 
 * The core interactive canvas for building and editing node flows with:
 * - Drag-and-drop node creation
 * - Real-time flow validation
 * - Node selection and property editing
 * - Responsive panel system
 * 
 * Key Features:
 * - Optimized performance with memoization
 * - Comprehensive error handling
 * - Accessibility-compliant interactions
 * - Type-safe operations
 * 
 * @returns {ReactElement} The flow builder interface
 * 
 * @see {@link useFlowStore} - State management
 * @see {@link nodeTypes} - Node component registry
 */
export const FlowBuilderCanvas: React.FC = (): ReactElement => {
    const {
        nodes,
        edges,
        selectedNode,
        setNodes,
        onNodesChange,
        onEdgesChange,
        setSelectedNode,
        onConnect,
        onUpdateNode
    } = useFlowStore();
    
    const { screenToFlowPosition } = useReactFlow();
    const [activeTab, setActiveTab] = useState<'nodes' | 'settings'>('nodes');
    const reactFlowWrapper = useRef<HTMLDivElement>(null);

    // Memoized safe nodes/edges to prevent unnecessary re-renders
    const safeNodes = useMemo(() => Array.isArray(nodes) ? nodes : [], [nodes]);
    const safeEdges = useMemo(() => Array.isArray(edges) ? edges : [], [edges]);

    /**
     * Handles node drop with position calculation
     * @param {React.DragEvent} event - Drop event
     * @throws {Error} If node creation fails
     */
    const onDrop = useCallback((event: React.DragEvent) => {
        try {
            event.preventDefault();
            const type = event.dataTransfer.getData('application/reactflow');
            if (!type) throw new Error("Invalid node type");

            const position = screenToFlowPosition({
                x: event.clientX,
                y: event.clientY,
            });
            const newNode = createNode(type, position, { 
                label: 'Send Message', 
                text: '' 
            });
            setNodes([...safeNodes, newNode]);
        } catch (error) {
            toast.error("Failed to create node", {
                description: error instanceof Error ? error.message : String(error)
            });
        }
    }, [screenToFlowPosition, setNodes, safeNodes]);

    /**
     * Validates flow integrity
     * @returns {string | null} Error message or null if valid
     */
    const validateFlow = useCallback((): string | null => {
        if (safeNodes.length === 0) return null;

        // Check for empty content
        const emptyNodes = safeNodes.filter(node => !node.data.text?.trim());
        if (emptyNodes.length > 0) {
            return `${emptyNodes.length} nodes have empty content`;
        }

        // Check connectivity (if multiple nodes exist)
        if (safeNodes.length > 1) {
            const disconnectedNodes = safeNodes.filter(node => 
                !safeEdges.some(edge => edge.target === node.id)
            );
            if (disconnectedNodes.length > 1) {
                return `${disconnectedNodes.length} nodes are disconnected`;
            }
        }

        return null;
    }, [safeNodes, safeEdges]);

    /**
     * Handles flow saving with validation
     */
    const handleSave = useCallback(() => {
        const error = validateFlow();
        if (error) {
            toast.error("Validation failed", { 
                description: error,
                action: {
                    label: "View Issues",
                    onClick: () => {
                        setActiveTab('settings');
                        setSelectedNode(
                            safeNodes.find(n => !n.data.text?.trim()) || null
                        );
                    }
                }
            });
            return;
        }
        toast.success("Flow saved successfully");
        // TODO: Implement API logic to save the flow
    }, [validateFlow, safeNodes, setSelectedNode]);

    // Panel management
    const handleTabChange = useCallback((value: string) => {
        setActiveTab(value as 'nodes' | 'settings');
        if (value === 'nodes') setSelectedNode(null);
    }, [setSelectedNode]);

    return (
        <div 
            className="w-full h-screen bg-gray-50 relative flex flex-col"
            data-testid="flow-canvas"
        >
            {/* Header */}
            <header 
                className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-6 flex-shrink-0"
                aria-label="Flow editor header"
            >
                <h1 className="text-lg font-semibold text-gray-900">Flow Craft</h1>
                <Button 
                    onClick={handleSave}
                    className="flex items-center gap-2"
                    aria-label="Save flow"
                >
                    <Save size={16} />
                    Save Changes
                </Button>
            </header>

            {/* Main workspace */}
            <div className="flex-1 flex min-h-0">
                {/* ReactFlow canvas */}
                <div className="flex-1" ref={reactFlowWrapper}>
                    <ReactFlow
                        nodes={safeNodes}
                        edges={safeEdges}
                        onNodesChange={onNodesChange}
                        onEdgesChange={onEdgesChange}
                        onConnect={onConnect}
                        onDrop={onDrop}
                        onDragOver={useCallback((e: React.DragEvent) => e.preventDefault(), [])}
                        onNodeClick={useCallback((_: unknown, node: FlowNode) => {
                            setSelectedNode(node);
                            setActiveTab('settings');
                        }, [setSelectedNode])}
                        onPaneClick={useCallback(() => setSelectedNode(null), [setSelectedNode])}
                        nodeTypes={nodeTypes}
                        fitView
                        nodeOrigin={[0.5, 0.5]}
                        aria-label="Flow diagram workspace"
                    >
                        <Background 
                            variant={BackgroundVariant.Dots} 
                            gap={8} 
                            size={1} 
                        />
                        <Controls aria-label="Diagram controls" />
                        <MiniMap 
                            nodeColor="#14b8a6" 
                            aria-label="Flow overview minimap" 
                        />
                    </ReactFlow>
                </div>

                {/* Side panel */}
                <aside 
                    className="w-80 border-l border-gray-200 bg-white flex-shrink-0 p-4"
                    aria-label="Properties panel"
                >
                    <Tabs
                        value={activeTab}
                        onValueChange={handleTabChange}
                        className="w-full h-full flex flex-col"
                    >
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger 
                                value="nodes" 
                                className="flex items-center gap-2"
                                aria-label="Nodes library"
                            >
                                <Plus size={16} />
                                Nodes
                            </TabsTrigger>
                            <TabsTrigger 
                                value="settings" 
                                className="flex items-center gap-2"
                                aria-label="Node settings"
                            >
                                <Settings size={16} />
                                Settings
                            </TabsTrigger>
                        </TabsList>

                        <div className="flex-1 overflow-y-auto">
                            <TabsContent value="nodes" className="m-0 h-full">
                                <NodesPanel />
                            </TabsContent>
                            <TabsContent value="settings" className="m-0 h-full">
                                <SettingsPanel
                                    selectedNode={selectedNode}
                                    onUpdateNode={onUpdateNode}
                                    onBack={useCallback(() => {
                                        setSelectedNode(null);
                                        setActiveTab('nodes');
                                    }, [setSelectedNode])}
                                />
                            </TabsContent>
                        </div>
                    </Tabs>
                </aside>
            </div>
        </div>
    );
};
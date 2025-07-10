import { ReactElement, useCallback, useRef, useState } from "react";
import ReactFlow, { Background, BackgroundVariant, Controls, MiniMap, useReactFlow } from "reactflow";
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


    const onDragOver = useCallback((event: React.DragEvent) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    }, []);

    const onDrop = useCallback((event: React.DragEvent) => {
        event.preventDefault();

        const type = event.dataTransfer.getData('application/reactflow');
        if (!type) return;

        const position = screenToFlowPosition({
            x: event.clientX,
            y: event.clientY,
        });

        const newNode: FlowNode = createNode(type, position, { label: 'Send Message', text: '' });
        setNodes([...nodes, newNode]);
    }, [screenToFlowPosition, setNodes, nodes]);

    const onNodeClick = useCallback((event: React.MouseEvent, node: unknown) => {
        setSelectedNode(node as FlowNode);
        setActiveTab('settings');
    }, [setSelectedNode]);

    const onPaneClick = useCallback(() => {
        setSelectedNode(null);
    }, [setSelectedNode]);

    const onSettingsClose = useCallback(() => {
        setSelectedNode(null);
        setActiveTab('nodes');
    }, [setSelectedNode]);

    const validateFlow = useCallback(() => {
        // Ensure nodes is an array
        const safeNodes = Array.isArray(nodes) ? nodes : [];
        const safeEdges = Array.isArray(edges) ? edges : [];
        
        if (safeNodes.length === 0) return null;

        const emptyTextNodes = safeNodes.filter(node => !node.data.text?.trim());
        if (emptyTextNodes.length > 0) {
            return 'Some nodes have empty text fields';
        }

        if (safeNodes.length <= 1) return null;

        const nodesWithEmptyTargets = safeNodes.filter(node => {
            const hasIncomingEdge = safeEdges.some(edge => edge.target === node.id);
            return !hasIncomingEdge;
        });

        if (nodesWithEmptyTargets.length > 1) {
            return 'Some node are not connected';
        }

        return null;
    }, [nodes, edges]);

    const handleSave = useCallback(() => {
        const error = validateFlow();
        if (error) {
            toast.error("Cannot save flow:", {                
                description: error,
                duration: 7000,         
            });
            return;
        }

        toast.success("Flow saved successfully!");
        // Send flow to backend or persist elsewhere
    }, [validateFlow]);

    // Ensure we have arrays before rendering
    const safeNodes = Array.isArray(nodes) ? nodes : [];
    const safeEdges = Array.isArray(edges) ? edges : [];

    return (
        <div className="w-full h-screen bg-gray-50 relative flex flex-col">
            <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-6 flex-shrink-0">
                <h1 className="text-lg font-semibold text-gray-900">Flow Craft</h1>
                <Button onClick={handleSave} className="flex items-center gap-2">
                    <Save size={16} />
                    Save Changes
                </Button>
            </header>

            <div className="flex-1 flex min-h-0">
                <div className="flex-1">
                    <div ref={reactFlowWrapper} className="w-full h-full">
                        <ReactFlow
                            nodes={safeNodes}
                            edges={safeEdges}
                            onNodesChange={onNodesChange}
                            onEdgesChange={onEdgesChange}
                            onConnect={onConnect}
                            onDrop={onDrop}
                            onDragOver={onDragOver}
                            onNodeClick={onNodeClick}
                            onPaneClick={onPaneClick}
                            nodeTypes={nodeTypes}
                            fitView
                            nodeOrigin={[0.5, 0.5]}
                        >
                            <Background variant={BackgroundVariant.Dots} gap={8} size={1} />
                            <Controls />
                            <MiniMap nodeColor="#14b8a6" />
                        </ReactFlow>
                    </div>
                </div>

                <div className="w-80 border-l border-gray-200 bg-white flex-shrink-0 p-4">
                    <Tabs
                        value={activeTab}
                        onValueChange={(value) => setActiveTab(value as 'nodes' | 'settings')}
                        className="w-full h-full flex flex-col"
                    >
                        <TabsList className="grid w-full grid-cols-2 ">
                            <TabsTrigger value="nodes" className="flex items-center gap-2">
                                <Plus size={16} />
                                Nodes
                            </TabsTrigger>
                            <TabsTrigger value="settings" className="flex items-center gap-2">
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
                                    onBack={onSettingsClose}
                                />
                            </TabsContent>
                        </div>
                    </Tabs>
                </div>
            </div>
        </div>
    );
};
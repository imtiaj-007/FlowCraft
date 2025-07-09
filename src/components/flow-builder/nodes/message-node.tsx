import React, { useState } from 'react';
import { v4 as uuid } from "uuid";
import { Handle, Position, useReactFlow } from 'reactflow';
import 'reactflow/dist/style.css';
import { MessageSquare, Grip, AlertCircle, Plus } from 'lucide-react';
import { MessageNodeData } from '@/types/flow';
import { findNonOverlappingPosition, HORIZONTAL_GAP } from '@/components/flow-builder/toolbar';

export const MessageNode = (
    { data, selected, id }: { data: MessageNodeData; selected: boolean; id: string }
) => {
    const [hover, setHover] = useState<boolean>(false);
    const { setNodes, setEdges, getNodes } = useReactFlow();
    const isEmpty = !data.text?.trim();

    const addNewNode = (e: React.MouseEvent) => {
        e.stopPropagation();

        const currentNode = getNodes().find(n => n.id === id);
        if (!currentNode) return;

        const allNodes = getNodes();
        const baseX = currentNode.position.x + HORIZONTAL_GAP;
        const baseY = currentNode.position.y;

        const position = findNonOverlappingPosition(baseX, baseY, allNodes);

        const newNode = {
            id: `node-${uuid()}`,
            type: 'messageNode',
            position,
            data: { label: 'Send Message', text: '' },
        };

        const newEdge = {
            id: `edge-${uuid()}`,
            source: id,
            target: newNode.id,
        };

        setNodes(nds => [...nds, newNode]);
        setEdges(eds => [...eds, newEdge]);
    };


    return (
        <div
            className={`relative bg-white rounded-lg border-2 transition-all duration-200 z-10 ${selected
                ? 'border-blue-500 shadow-lg'
                : 'border-gray-200 hover:border-gray-300'
                } ${isEmpty ? 'border-red-200 bg-red-50' : ''}`}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
        >

            {/* Invisible hover area that extends beyond the node */}
            <div className="absolute -inset-5 z-0" />
            {/* Input Handle */}
            <Handle
                type="target"
                position={Position.Left}
                className="w-3 h-3 bg-gray-400 border-2 border-white hover:bg-gray-600 transition-colors"
            />

            {/* Output Handle */}
            <Handle
                type="source"
                position={Position.Right}
                className="w-3 h-3 bg-gray-400 border-2 border-white hover:bg-gray-600 transition-colors"
            />

            {/* Node Header */}
            <div className="flex items-center gap-2 p-3 bg-teal-500 text-white rounded-t-lg">
                <MessageSquare size={16} />
                <span className="font-medium text-sm">Send Message</span>
                <Grip size={12} className="ml-auto opacity-70" />
            </div>

            {/* Node Content */}
            <div className="p-4 min-w-[200px] max-w-[280px]">
                <div className="text-sm text-gray-600 break-words">
                    {data.text ? (
                        <div className="whitespace-pre-wrap">
                            {data.text}
                        </div>
                    ) : (
                        <span className="text-red-400 italic">Enter message text</span>
                    )}
                </div>
            </div>

            {/* Empty State Indicator */}
            {isEmpty && (
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center z-10">
                    <AlertCircle size={12} className="text-white" />
                </div>
            )}

            {/* Add Node Button */}
            {hover && (
                <div className="absolute -right-7 top-1/2 transform -translate-y-1/2 z-20">
                    <button
                        onClick={addNewNode}
                        className="w-6 h-6 bg-blue-500 hover:bg-blue-600 text-white rounded-full flex items-center justify-center transition-all duration-200 shadow-md hover:shadow-lg"
                        title="Add new message node"
                    >
                        <Plus size={14} />
                    </button>
                </div>
            )}
        </div>
    );
};
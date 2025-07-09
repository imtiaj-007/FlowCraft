import React, { useState } from 'react';
import { Handle, Position } from 'reactflow';
import 'reactflow/dist/style.css';
import { useFlowStore } from '@/store/flowStore';
import { MessageSquare, Grip, AlertCircle, Plus } from 'lucide-react';
import { MessageNodeData } from '@/types/flow';


export const MessageNode = (
    { data, selected, id }: { data: MessageNodeData; selected: boolean; id: string }
) => {
    const [hover, setHover] = useState<boolean>(false);
    const { nodes, addMessageNode } = useFlowStore();
    const isEmpty = !data.text?.trim();

    const addNewNode = (e: React.MouseEvent) => {
        e.stopPropagation();
        const currentNode = nodes.find(node => node.id === id);
        if (!currentNode) return;

        addMessageNode(currentNode);
    };

    return (
        <div
            className={`relative bg-white rounded-lg border-2 transition-all duration-200 z-10 
                ${selected ? 'border-blue-500 shadow-lg' : 'border-gray-200'}
                ${isEmpty ? 'border-red-400 bg-red-100' : ''}`
            }
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
        >

            {/* Invisible hover area that extends beyond the node */}
            <div className="absolute -inset-5 z-0" />
            {/* Input Handle */}
            <Handle
                type="target"
                position={Position.Left}
                style={{ width: '8px', height: '8px', backgroundColor: '#4A90E2' }}
                isConnectableEnd
            />

            {/* Output Handle */}
            <Handle
                type="source"
                position={Position.Right}
                style={{ width: '8px', height: '8px', backgroundColor: '#4A90E2' }}
            />

            {/* Node Header */}
            <div className="flex items-center gap-2 p-2 bg-teal-500 text-white rounded-t-md">
                <MessageSquare size={12} />
                <span className="font-medium text-xs">Send Message</span>
                <Grip size={12} className="ml-auto opacity-70" />
            </div>

            {/* Node Content */}
            <div className="p-2 w-[200px]">
                <div className="text-xs text-gray-600 break-words">
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
                <div className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center z-10">
                    <AlertCircle size={12} className="text-white" />
                </div>
            )}

            {/* Add Node Button */}
            {hover && (
                <div className="absolute -right-6 top-1/2 transform -translate-y-1/2 z-20">
                    <button
                        onClick={addNewNode}
                        className="w-5 h-5 bg-blue-500 hover:bg-blue-600 text-white rounded-full flex items-center justify-center transition-all duration-200 shadow-md hover:shadow-lg"
                        title="Add new message node"
                    >
                        <Plus size={12} />
                    </button>
                </div>
            )}
        </div>
    );
};
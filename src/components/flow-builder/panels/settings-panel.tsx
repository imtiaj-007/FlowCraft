import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft } from "lucide-react";
import { FlowNode, MessageNodeData } from "@/types/flow";


export const SettingsPanel = ({
    selectedNode,
    onUpdateNode,
    onClose
}: {
    selectedNode: FlowNode | null;
    onUpdateNode: (id: string, data: Partial<MessageNodeData>) => void;
    onClose: () => void;
}) => {
    const [text, setText] = useState('');

    useEffect(() => {
        if (selectedNode) {
            setText(selectedNode.data.text || '');
        }
    }, [selectedNode]);

    const handleSave = () => {
        if (selectedNode) {
            onUpdateNode(selectedNode.id, { text });
        }
    };

    if (!selectedNode) return null;

    return (
        <div className="fixed right-0 top-0 w-80 h-full bg-white border-l border-gray-200 shadow-lg z-50 flex flex-col">
            <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" onClick={onClose}>
                            <ArrowLeft size={16} />
                        </Button>
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900">Message</h2>
                            <p className="text-sm text-gray-500">Edit message content</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex-1 p-4">
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Text
                        </label>
                        <Textarea
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            placeholder="Enter message text..."
                            className="w-full h-32 resize-none"
                        />
                    </div>

                    <Button onClick={handleSave} className="w-full">
                        Save Changes
                    </Button>
                </div>
            </div>
        </div>
    );
};
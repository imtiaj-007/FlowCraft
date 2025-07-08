import { Button } from "@/components/ui/button";
import { MessageSquare, X } from "lucide-react";


export const NodesPanel = (
    { isOpen, onClose }: { isOpen: boolean; onClose: () => void }
) => {
    const onDragStart = (event: React.DragEvent, nodeType: string) => {
        event.dataTransfer.setData('application/reactflow', nodeType);
        event.dataTransfer.effectAllowed = 'move';
    };

    if (!isOpen) return null;

    return (
        <div className="fixed left-0 top-0 w-80 h-full bg-white border-r border-gray-200 shadow-lg z-50 flex flex-col">
            <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-gray-900">Nodes Panel</h2>
                    <Button variant="ghost" size="sm" onClick={onClose}>
                        <X size={16} />
                    </Button>
                </div>
            </div>

            <div className="flex-1 p-4">
                <div className="space-y-4">
                    <div>
                        <h3 className="text-sm font-medium text-gray-700 mb-2">Messages</h3>
                        <div
                            className="p-4 bg-teal-50 border border-teal-200 rounded-lg cursor-grab active:cursor-grabbing hover:bg-teal-100 transition-colors"
                            draggable
                            onDragStart={(event) => onDragStart(event, 'messageNode')}
                        >
                            <div className="flex items-center gap-2 text-teal-700">
                                <MessageSquare size={16} />
                                <span className="font-medium">Message</span>
                            </div>
                            <p className="text-xs text-teal-600 mt-1">Send a text message</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
import { Handle, Position, NodeProps } from "reactflow";

export default function TextNode({ data }: NodeProps) {
    return (
        <div className="bg-teal-100 rounded-md px-4 py-2 shadow text-sm text-gray-800">
            <div className="font-semibold mb-1">Send Message</div>
            <div>{data.text}</div>
            <Handle type="target" position={Position.Left} className="w-2 h-2 bg-black" />
            <Handle type="source" position={Position.Right} className="w-2 h-2 bg-black" />
        </div>
    );
}
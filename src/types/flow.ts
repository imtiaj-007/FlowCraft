import { Node } from 'reactflow';

interface MessageNodeData {
    label: string;
    text: string;
}

interface FlowNode extends Node {
    data: MessageNodeData;
}

export type { FlowNode, MessageNodeData };
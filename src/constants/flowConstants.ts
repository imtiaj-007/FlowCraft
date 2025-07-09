interface FlowConstants {
    NODE_WIDTH: number;
    NODE_HEIGHT: number;
    HORIZONTAL_GAP: number;
    VERTICAL_GAP: number;
    DEFAULT_EDGE_COLOR: string;
    DEFAULT_NODE_TYPE: string;
    DEFAULT_NODE_DATA: {
        label: string;
        text: string;
    };
    DEFAULT_NODE_POSITION: {
        x: number;
        y: number;
    };
}

export const flowConstants: FlowConstants = {
    NODE_WIDTH: 200,
    NODE_HEIGHT: 80,
    HORIZONTAL_GAP: 300,
    VERTICAL_GAP: 80,
    DEFAULT_EDGE_COLOR: '#14b8a6',
    DEFAULT_NODE_TYPE: 'messageNode',
    DEFAULT_NODE_DATA: {
        label: 'Send Message',
        text: '',
    },
    DEFAULT_NODE_POSITION: { x: 0, y: 0 },
};
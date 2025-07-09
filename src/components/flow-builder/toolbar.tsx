/* eslint-disable @typescript-eslint/no-explicit-any */
const NODE_WIDTH = 250;
const NODE_HEIGHT = 100;
const HORIZONTAL_GAP = 300;
const VERTICAL_GAP = 120;

const isOverlapping = (x: number, y: number, existingNodes: any[]) => {
    return existingNodes.some(n => {
        const dx = Math.abs(n.position.x - x);
        const dy = Math.abs(n.position.y - y);
        return dx < NODE_WIDTH && dy < NODE_HEIGHT;
    });
};

const findNonOverlappingPosition = (
    baseX: number,
    baseY: number,
    existingNodes: Node[]
) => {
    const x = baseX, y = baseY;
    let yOffset = 0;

    // Try downward positions until no overlap
    while (isOverlapping(x, y + yOffset, existingNodes)) {
        yOffset += VERTICAL_GAP;
    }

    return { x, y: y + yOffset };
};

export { isOverlapping, findNonOverlappingPosition, NODE_WIDTH, NODE_HEIGHT, HORIZONTAL_GAP, VERTICAL_GAP };
export const MAP_WIDTH = 10;
export const MAP_HEIGHT = 20;
export const INITIAL_BLOCK_SETTTING = Object.freeze({
    straight: {
        type: 'straight',
        coord: [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 }, { x: 3, y: 0 }],
        point: { pointX: 0, pointY: 0 }
    },
    shapeL: {
        type: 'shapeL',
        coord: [{ x: 2, y: 0 }, { x: 2, y: 1 }, { x: 1, y: 1 }, { x: 0, y: 1 }],
        point: { pointX: 0, pointY: 0 }
    },
    revShapeL: {
        type: 'revShapeL',
        coord: [{ x: 0, y: 0 }, { x: 0, y: 1 }, { x: 1, y: 1 }, { x: 2, y: 1 }],
        point: { pointX: 0, pointY: 0 }
    },
    square: {
        type: 'square',
        coord: [{ x: 0, y: 0 }, { x: 0, y: 1 }, { x: 1, y: 1 }, { x: 1, y: 0 }],
        point: { pointX: 0, pointY: 0 }
    },
    fuck: {
        type: 'fuck',
        coord: [{ x: 0, y: 0 }, { x: 0, y: 1 }, { x: 1, y: 1 }, { x: 1, y: 0 }],
        point: { pointX: 0, pointY: 0 }
    },
    zigzag: {
        type: 'zigzag',
        coord: [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 1, y: 1 }, { x: 2, y: 1 }],
        point: { pointX: 0, pointY: 0 }
    }
});

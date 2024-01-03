import { BlockElementInterface } from "./block/blockElement.js";

export const MAP_WIDTH = 10;
export const MAP_HEIGHT = 20;

export type BlockElementCoordinateInfo = {
    x: number,
    y: number
}

type RotatePointCoordinate = {
    pointX: number,
    pointY: number
}

export type BlockBundleType = 'straight'|'shapeL'|'revShapeL'|'square'|'fuck'|'zigzag'|'revZigzag';
type PointSetter = (arg: BlockElementInterface[]) => RotatePointCoordinate

export type BlockBundleSetting = {
    type: BlockBundleType,
    coord: BlockElementCoordinateInfo[],
    point: PointSetter,
}


function normalPointSetter(index: number): PointSetter {
    return (arg: BlockElementInterface[]) =>{
        return {pointX: arg[index].x, pointY: arg[index].y}
    }
}

function squarePointSetter(xOf: number, yOf: number): PointSetter {
    return (arg: BlockElementInterface[]) => {
        const block = arg.reduce((a,b)=>{
            return [a.x, a.y] > [b.x, b.y] ? b:a
        })
        return {pointX: block.x + xOf, pointY: block.y + yOf}
    }
}

function LshapePointSetter(index: number, reverse=false): PointSetter {
    return (arg: BlockElementInterface[]) => {
        const [xOf, yOf] = [arg[index+1].x - arg[index].x, arg[index+1].y - arg[index].y]
        if(!reverse) return {pointX: arg[index].x - yOf, pointY: arg[index].y + xOf}
        return {pointX: arg[index].x + yOf, pointY: arg[index].y - xOf}
    }
}

export const INITIAL_BLOCK_SETTTING: Readonly<Record<BlockBundleType,BlockBundleSetting>> = Object.freeze({
    straight: {
        type: 'straight',
        coord: [{x: 0, y: 0}, {x: 1, y: 0}, {x: 2, y: 0}, {x: 3, y: 0}],
        point: normalPointSetter(1),
    },
    shapeL: {
        type: 'shapeL',
        coord: [{x: 2, y: 0}, {x: 2, y: 1}, {x: 1, y: 1}, {x: 0, y: 1}],
        point: LshapePointSetter(0)
    },
    revShapeL: {
        type: 'revShapeL',
        coord: [{x: 0, y: 0}, {x: 0, y: 1}, {x: 1, y: 1}, {x: 2, y: 1}],
        point: LshapePointSetter(0, true)
    },
    square: {
        type: 'square',
        coord: [{x: 0, y: 0}, {x: 0, y: 1}, {x: 1, y: 1}, {x: 1, y: 0}],
        point: squarePointSetter(0.5, 0.5)
    },
    fuck: {
        type: 'fuck',
        coord: [{x: 0, y: 1}, {x: 1, y: 1}, {x: 2, y: 1}, {x: 1, y:0}],
        point: normalPointSetter(1)
    },
    zigzag: {
        type:'zigzag',
        coord: [{x: 0, y: 0}, {x: 1, y: 0}, {x: 1, y: 1}, {x: 2, y: 1}],
        point: normalPointSetter(2)
    },
    revZigzag: {
        type: 'revZigzag',
        coord: [{x: 0, y: 1}, {x: 1, y: 1}, {x: 1, y: 0}, {x: 2, y: 0}],
        point: normalPointSetter(2)
    }
})

export const BUNDLE_TYPE_ARRAY: Array<BlockBundleType> = ['straight','zigzag','fuck','revShapeL','revZigzag','shapeL','square']
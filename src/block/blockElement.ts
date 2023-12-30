import { BlockElementCoordinateInfo } from "../constant.js";

export type BlockMoveDirection = 'up'|'down'|'left'|'right'

export interface BlockElementInterface {
    get x(): number,
    get y(): number,

    set x(x: number);
    set y(y: number)

    rotate(pointX: number, pointY: number, reverse?: boolean):void
    rotateResultData(pointX: number, pointY: number, reverse?:boolean): BlockElementCoordinateInfo
    renderFill(idPrefix: string, c: string, w: number):void
    erase(idPrefix: string, c: string, w: number): void;
    move(dir: BlockMoveDirection): void|never;
}
export type BlockElementConstructor = {
    new (x: number, y: number): BlockElementInterface
}

export class BlockElement implements BlockElementInterface{
    constructor(private _x: number, private _y: number) {}

    rotateResultData(pointX: number, pointY: number, reverse=false): BlockElementCoordinateInfo {
        const [xOffset, yOffset] = [this._x - pointX, this._y - pointY];
        if(reverse) return {x: pointX+yOffset, y: pointY - xOffset}
        return {x: pointX - yOffset, y: pointY + xOffset}
    }

    get x() {return this._x}
    get y() {return this._y}

    set x(x: number) {this._x = x};
    set y(y: number) {this._y = y};

    move(dir: BlockMoveDirection) {
        switch(dir) {
            case 'up':
                this._y--;
                break;
            case 'down':
                this._y++;
                break;
            case 'right':
                this._x++;
                break;
            case 'left':
                this._x--;
                
                break;
            default:
                throw new Error('unvalid direction');
        }
    }


    rotate(pointX:number, pointY:number, reverse=false) {
        const {x,y} = this.rotateResultData(pointX, pointY, reverse);
        this._x = x;
        this._y = y;
    }

    renderFill(idPrefix: string, c: string, w: number) {
        document.getElementById(`${idPrefix}_${this._y*w + this._x}`)?.classList.add(c)
    }

    erase(idPrefix: string, c: string, w: number) {
        document.getElementById(`${idPrefix}_${this._y*w + this._x}`)?.classList.remove(c)
    }
}
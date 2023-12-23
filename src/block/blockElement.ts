import { BlockElementCoordinateInfo } from "../constant.js";

export interface BlockElementInterface {
    get x(): number,
    get y(): number,
    rotate(pointX: number, pointY: number, reverse: boolean):void
}

export class BlockElement implements BlockElementInterface{
    constructor(private _x: number, private _y: number) {}

    private rotateResultData(pointX: number, pointY: number, reverse=false): BlockElementCoordinateInfo {
        const [xOffset, yOffset] = [this._x - pointX, this._y - pointY];
        if(reverse) return {x: pointX+yOffset, y: pointY - xOffset}
        return {x: pointX - yOffset, y: pointY + xOffset}
    }

    get x() {return this._x}
    get y() {return this._y}

    rotate(pointX:number, pointY:number, reverse=false) {
        const {x,y} = this.rotateResultData(pointX, pointY, reverse);
        this._x = x;
        this._y = y;
    }

    renderFill(idPrefix: string) {
        document.getElementById(`${idPrefix}_${this._y*10 + this._x}`)?.classList.add('fill-moving-block')
    }
}
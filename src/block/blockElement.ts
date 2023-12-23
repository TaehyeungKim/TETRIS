import { BlockElementCoordinateInfo } from "../constant.js";

export class BlockElement {
    constructor(private _x: number, private _y: number) {}

    rotateResultData(pointX: number, pointY: number, reverse=false): BlockElementCoordinateInfo {
        const [xOffset, yOffset] = [this._x - pointX, this._y - pointY];
        if(reverse) return {x: pointX+yOffset, y: pointY - xOffset}
        return {x: pointX - yOffset, y: pointY + xOffset}
    }

    rotate(pointX:number, pointY:number, reverse=false) {
        const {x,y} = this.rotateResultData(pointX, pointY, reverse);
        this._x = x;
        this._y = y;
    }
}
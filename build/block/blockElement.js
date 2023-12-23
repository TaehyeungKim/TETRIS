export class BlockElement {
    constructor(_x, _y) {
        this._x = _x;
        this._y = _y;
    }
    rotateResultData(pointX, pointY, reverse = false) {
        const [xOffset, yOffset] = [this._x - pointX, this._y - pointY];
        if (reverse)
            return { x: pointX + yOffset, y: pointY - xOffset };
        return { x: pointX - yOffset, y: pointY + xOffset };
    }
    rotate(pointX, pointY, reverse = false) {
        const { x, y } = this.rotateResultData(pointX, pointY, reverse);
        this._x = x;
        this._y = y;
    }
}

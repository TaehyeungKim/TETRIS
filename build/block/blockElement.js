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
    get x() { return this._x; }
    get y() { return this._y; }
    rotate(pointX, pointY, reverse = false) {
        const { x, y } = this.rotateResultData(pointX, pointY, reverse);
        this._x = x;
        this._y = y;
    }
    renderFill(idPrefix) {
        var _a;
        (_a = document.getElementById(`${idPrefix}_${this._y * 10 + this._x}`)) === null || _a === void 0 ? void 0 : _a.classList.add('fill-moving-block');
    }
}

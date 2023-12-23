import { BlockElement } from "./block/blockElement.js";
import { INITIAL_BLOCK_SETTTING } from "./constant.js";
export class Controller {
    constructor(blockBundle, map) {
        this._map = new map(10, 20);
        this._blockBundle = new blockBundle(INITIAL_BLOCK_SETTTING.straight, BlockElement);
    }
    validateRotateCondition(x, y) {
        return x >= 0 && x < this._map.width && y >= 0 && y < this._map.height && this._map.map[y][x] === 0;
    }
    blockRotate() {
        const { pointX, pointY } = this._blockBundle.blockBundleSetting.point(this._blockBundle.blockBundleArray);
        let valid = true;
        this._blockBundle.blockBundleArray.forEach(block => {
            const { x, y } = block.rotateResultData(pointX, pointY);
            if (!this.validateRotateCondition(x, y))
                valid = false;
        });
        if (!valid)
            return;
        this._blockBundle.blockBundleArray.forEach((block => block.rotate(pointX, pointY)));
    }
}

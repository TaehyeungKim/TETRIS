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
    renderMap(root) {
        this._map.renderMap(root);
    }
    renderMovingBlock(idPrefix, c) {
        this._blockBundle.render(idPrefix, c);
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
    blockCrashDown() {
        let crash = false;
        this._blockBundle.blockBundleArray.forEach(block => {
            if (block.y > this._map.height - 1 || (this._map.map[block.y][block.x]))
                crash = true;
        });
        if (crash) {
            this._blockBundle.move('up');
            this._blockBundle.blockBundleArray.forEach(block => this._map.fixBlock(block.x, block.y));
            this._blockBundle.refreshBundle();
        }
        this.checkIfFullLines();
        this.checkIfMapFull();
    }
    checkIfFullLines() {
        const fullLines = this._map.detectFullLine();
        if (fullLines.length === 0)
            return;
        this._map.destroyFullLine();
    }
    checkIfMapFull() {
        if (this._map.map[0].reduce((a, b) => a + b) === 10)
            console.log('fail');
    }
}

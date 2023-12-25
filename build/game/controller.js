import { BlockElement } from "../block/blockElement.js";
import { INITIAL_BLOCK_SETTTING } from "../constant.js";
export class Controller {
    constructor(blockBundle, map) {
        this._map = new map(10, 20);
        this._blockBundle = new blockBundle(INITIAL_BLOCK_SETTTING.straight, BlockElement);
        this._blockMoveTimer = 0;
    }
    validateRotateCondition(x, y) {
        return x >= 0 && x < this._map.width && y >= 0 && y < this._map.height && this._map.map[y][x] === 0;
    }
    validateMoveCondition(dir) {
        const coords = this._blockBundle.blockBundleArray.map(block => {
            return { x: block.x, y: block.y };
        });
        let valid = true;
        switch (dir) {
            case "left":
                coords.forEach(coord => {
                    if (coord.x - 1 < 0 || this._map.map[coord.y][coord.x - 1] === 1)
                        valid = false;
                });
                break;
            case "right":
                coords.forEach(coord => {
                    if (coord.x + 1 > this._map.width - 1 || this._map.map[coord.y][coord.x + 1] === 1)
                        valid = false;
                });
                break;
            case "down":
                break;
            default:
                throw new Error("do not check other directions");
        }
        return valid;
    }
    updateMovingBlockRenderAction(action, idPrefix, c) {
        this.eraseTrackOfMovingBlock(idPrefix, c);
        action();
        this.renderMovingBlock(idPrefix, c);
    }
    renderMap(root) {
        this._map.renderMap(root);
    }
    renderMovingBlock(idPrefix, c) {
        this._blockBundle.render(idPrefix, c);
    }
    eraseTrackOfMovingBlock(idPrefix, c) {
        this._blockBundle.erase(idPrefix, c);
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
    blockMove(dir) {
        if (this.validateMoveCondition(dir))
            this._blockBundle.move(dir);
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
        return crash;
    }
    blockMoveDown() {
        clearTimeout(this._blockMoveTimer);
        this.blockMove('down');
        return this.blockCrashDown();
    }
    blockMoveDownToEnd() {
        let crash = this.blockMoveDown();
        while (!crash)
            crash = this.blockMoveDown();
    }
    registerAutoBlockMove(idPrefix, c) {
        const timerPromise = () => new Promise((resolve) => {
            const validateMoveDown = this._map.detectFullLine().length > 0;
            this._blockMoveTimer = setTimeout(() => {
                if (!validateMoveDown) {
                    this.updateMovingBlockRenderAction(() => this.blockMoveDown(), idPrefix, c);
                }
                resolve(true);
                clearTimeout(this._blockMoveTimer);
            }, 1000);
        }).then(timerPromise);
        timerPromise();
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

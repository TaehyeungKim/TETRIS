import { BUNDLE_TYPE_ARRAY, INITIAL_BLOCK_SETTTING } from "../constant.js";
export class BlockBundle {
    constructor(setting, blockElement) {
        this.setting = setting;
        this._blockBundleArray = setting.coord.map(coord => new blockElement(coord.x, coord.y));
        this._moveFrozen = false;
        this._nextBlockBundle = this.setNextBlockBundle();
        this._crashed = false;
    }
    get crashed() {
        return this._crashed;
    }
    set crashed(c) {
        this._crashed = c;
    }
    get nextBlockBundleSetting() {
        return this._nextBlockBundle;
    }
    get blockBundleArray() {
        return this._blockBundleArray;
    }
    get blockBundleSetting() {
        return this.setting;
    }
    get isFrozen() {
        return this._moveFrozen;
    }
    controllMove(freeze) {
        this._moveFrozen = freeze;
    }
    render(idPrefix, c, w) {
        if (!this._crashed) {
            this._blockBundleArray.forEach(block => block.renderFill(idPrefix, c, w));
            this._blockBundleArray.forEach(block => block.renderFill(idPrefix, `${this.setting.type}-fill`, w));
        }
    }
    erase(idPrefix, c, w) {
        this._blockBundleArray.forEach(block => block.erase(idPrefix, c, w));
        this._blockBundleArray.forEach(block => block.erase(idPrefix, `${this.setting.type}-fill`, w));
    }
    rotateResultData() {
        const { pointX, pointY } = this.setting.point(this._blockBundleArray);
        return this._blockBundleArray.map(block => block.rotateResultData(pointX, pointY));
    }
    rotate() {
        if (!this._moveFrozen) {
            const { pointX, pointY } = this.setting.point(this._blockBundleArray);
            this._blockBundleArray.forEach(block => block.rotate(pointX, pointY));
        }
    }
    move(dir) {
        if (!this._moveFrozen)
            this._blockBundleArray.forEach(block => block.move(dir));
    }
    setNextBlockBundle() {
        const randomGen = () => Number.parseInt((Math.random() * 10).toString());
        let random = randomGen();
        while (random >= BUNDLE_TYPE_ARRAY.length)
            random = randomGen();
        const newType = BUNDLE_TYPE_ARRAY[random];
        return INITIAL_BLOCK_SETTTING[newType];
    }
    refreshBundle() {
        this._crashed = false;
        this.setting = this._nextBlockBundle;
        this._blockBundleArray.forEach((block, index) => {
            block.x = this.setting.coord[index].x;
            block.y = this.setting.coord[index].y;
        });
        this._nextBlockBundle = this.setNextBlockBundle();
    }
}

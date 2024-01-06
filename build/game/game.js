import { Controller } from "./controller.js";
import { BlockBundle } from "../block/blockBundle.js";
import { Map } from "../map/map.js";
import { PreviewMap } from "../map/preview.js";
export class Game extends Controller {
    constructor() {
        super(BlockBundle, Map);
        Game.previewMap.renderPreviewMap(document.getElementById('preview-next-container'));
    }
    pause() {
        this.pauseBlockMoving();
        this._player.endTimer();
    }
    play() {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j;
        const actionByKeySet = (key) => {
            var _a, _b, _c, _d, _e;
            switch (key) {
                case 'up':
                    this.updateMovingBlockRenderAction(() => this.blockRotate(), Game.movingBlockGridPrefix, Game.movingBlockFillClass);
                    (_a = document.getElementById('top-cont')) === null || _a === void 0 ? void 0 : _a.classList.add('top-cont-clicked');
                    break;
                case 'down':
                    this.updateMovingBlockRenderAction(() => this.blockMoveDown(Game.movingBlockGridPrefix, Game.movingBlockFillClass), Game.movingBlockGridPrefix, Game.movingBlockFillClass);
                    this.registerAutoBlockMove(Game.movingBlockGridPrefix, Game.movingBlockFillClass);
                    (_b = document.getElementById('down-cont')) === null || _b === void 0 ? void 0 : _b.classList.add('down-cont-clicked');
                    break;
                case 'left':
                    this.updateMovingBlockRenderAction(() => this.blockMove('left'), Game.movingBlockGridPrefix, Game.movingBlockFillClass);
                    (_c = document.getElementById('left-cont')) === null || _c === void 0 ? void 0 : _c.classList.add('left-cont-clicked');
                    break;
                case 'right':
                    this.updateMovingBlockRenderAction(() => this.blockMove('right'), Game.movingBlockGridPrefix, Game.movingBlockFillClass);
                    (_d = document.getElementById('right-cont')) === null || _d === void 0 ? void 0 : _d.classList.add('right-cont-clicked');
                    break;
                case 'spacebar':
                    this.updateMovingBlockRenderAction(() => this.blockMoveDownToEnd(Game.movingBlockGridPrefix, Game.movingBlockFillClass), Game.movingBlockGridPrefix, Game.movingBlockFillClass);
                    this.registerAutoBlockMove(Game.movingBlockGridPrefix, Game.movingBlockFillClass);
                    (_e = document.getElementById('down-cont')) === null || _e === void 0 ? void 0 : _e.classList.add('down-cont-clicked');
                    break;
                default:
                    throw new Error('invalid key');
            }
        };
        const backActionByKeySet = (key) => {
            var _a, _b, _c, _d;
            switch (key) {
                case 'up':
                    (_a = document.getElementById('top-cont')) === null || _a === void 0 ? void 0 : _a.classList.remove('top-cont-clicked');
                    break;
                case 'right':
                    (_b = document.getElementById('right-cont')) === null || _b === void 0 ? void 0 : _b.classList.remove('right-cont-clicked');
                    break;
                case 'left':
                    (_c = document.getElementById('left-cont')) === null || _c === void 0 ? void 0 : _c.classList.remove('left-cont-clicked');
                    break;
                case 'down':
                case 'spacebar':
                    (_d = document.getElementById('down-cont')) === null || _d === void 0 ? void 0 : _d.classList.remove('down-cont-clicked');
                    break;
                default:
                    throw new Error('invalid key');
            }
        };
        const moveByKey = (e) => {
            switch (e.key) {
                case 'ArrowUp':
                    actionByKeySet('up');
                    break;
                case 'ArrowDown':
                    actionByKeySet('down');
                    break;
                case 'ArrowLeft':
                    actionByKeySet('left');
                    break;
                case 'ArrowRight':
                    actionByKeySet('right');
                    break;
                case ' ':
                    actionByKeySet('spacebar');
                    break;
                default:
                    return;
            }
        };
        const buttonUp = (e) => {
            switch (e.key) {
                case 'ArrowUp':
                    backActionByKeySet('up');
                    break;
                case 'ArrowLeft':
                    backActionByKeySet('left');
                    break;
                case 'ArrowRight':
                    backActionByKeySet('right');
                    break;
                case 'ArrowDown':
                    backActionByKeySet('down');
                    break;
                case ' ':
                    backActionByKeySet('spacebar');
                    break;
            }
        };
        this.renderMap(document.getElementById('game-grid'));
        this.updateMovingBlockRenderAction(() => { }, Game.movingBlockGridPrefix, Game.movingBlockFillClass, true, true);
        this.registerAutoBlockMove(Game.movingBlockGridPrefix, Game.movingBlockFillClass);
        window.addEventListener('keydown', moveByKey);
        window.addEventListener('keyup', buttonUp);
        (_a = document.getElementById('top-cont')) === null || _a === void 0 ? void 0 : _a.addEventListener('mousedown', () => actionByKeySet('up'));
        (_b = document.getElementById('right-cont')) === null || _b === void 0 ? void 0 : _b.addEventListener('mousedown', () => actionByKeySet('right'));
        (_c = document.getElementById('left-cont')) === null || _c === void 0 ? void 0 : _c.addEventListener('mousedown', () => actionByKeySet('left'));
        (_d = document.getElementById('down-cont')) === null || _d === void 0 ? void 0 : _d.addEventListener('mousedown', () => actionByKeySet('down'));
        (_e = document.getElementById('top-cont')) === null || _e === void 0 ? void 0 : _e.addEventListener('mouseup', () => backActionByKeySet('up'));
        (_f = document.getElementById('right-cont')) === null || _f === void 0 ? void 0 : _f.addEventListener('mouseup', () => backActionByKeySet('right'));
        (_g = document.getElementById('left-cont')) === null || _g === void 0 ? void 0 : _g.addEventListener('mouseup', () => backActionByKeySet('left'));
        (_h = document.getElementById('down-cont')) === null || _h === void 0 ? void 0 : _h.addEventListener('mouseup', () => backActionByKeySet('down'));
        (_j = document.getElementById('down-cont')) === null || _j === void 0 ? void 0 : _j.addEventListener('dblclick', () => {
            actionByKeySet('spacebar');
            backActionByKeySet('spacebar');
        });
        this._player.startTimer(document.getElementById('time'));
    }
}
Game.movingBlockGridPrefix = 'moving-block-grid';
Game.movingBlockFillClass = 'fill-moving-block';
Game.previewMap = new PreviewMap();

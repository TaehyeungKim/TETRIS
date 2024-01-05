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
        const moveByKey = (e) => {
            var _a, _b, _c, _d, _e;
            switch (e.key) {
                case 'ArrowUp':
                    this.updateMovingBlockRenderAction(() => this.blockRotate(), Game.movingBlockGridPrefix, Game.movingBlockFillClass);
                    (_a = document.getElementById('top-cont')) === null || _a === void 0 ? void 0 : _a.classList.add('top-cont-clicked');
                    break;
                case 'ArrowDown':
                    this.updateMovingBlockRenderAction(() => this.blockMoveDown(Game.movingBlockGridPrefix, Game.movingBlockFillClass), Game.movingBlockGridPrefix, Game.movingBlockFillClass);
                    this.registerAutoBlockMove(Game.movingBlockGridPrefix, Game.movingBlockFillClass);
                    (_b = document.getElementById('down-cont')) === null || _b === void 0 ? void 0 : _b.classList.add('down-cont-clicked');
                    break;
                case 'ArrowLeft':
                    this.updateMovingBlockRenderAction(() => this.blockMove('left'), Game.movingBlockGridPrefix, Game.movingBlockFillClass);
                    (_c = document.getElementById('left-cont')) === null || _c === void 0 ? void 0 : _c.classList.add('left-cont-clicked');
                    break;
                case 'ArrowRight':
                    this.updateMovingBlockRenderAction(() => this.blockMove('right'), Game.movingBlockGridPrefix, Game.movingBlockFillClass);
                    (_d = document.getElementById('right-cont')) === null || _d === void 0 ? void 0 : _d.classList.add('right-cont-clicked');
                    break;
                case ' ':
                    this.updateMovingBlockRenderAction(() => this.blockMoveDownToEnd(Game.movingBlockGridPrefix, Game.movingBlockFillClass), Game.movingBlockGridPrefix, Game.movingBlockFillClass);
                    this.registerAutoBlockMove(Game.movingBlockGridPrefix, Game.movingBlockFillClass);
                    (_e = document.getElementById('down-cont')) === null || _e === void 0 ? void 0 : _e.classList.add('down-cont-clicked');
                    break;
                default:
                    return;
            }
        };
        const buttonUp = (e) => {
            var _a, _b, _c, _d;
            switch (e.key) {
                case 'ArrowUp':
                    (_a = document.getElementById('top-cont')) === null || _a === void 0 ? void 0 : _a.classList.remove('top-cont-clicked');
                    break;
                case 'ArrowLeft':
                    (_b = document.getElementById('left-cont')) === null || _b === void 0 ? void 0 : _b.classList.remove('left-cont-clicked');
                    break;
                case 'ArrowRight':
                    (_c = document.getElementById('right-cont')) === null || _c === void 0 ? void 0 : _c.classList.remove('right-cont-clicked');
                    break;
                case 'ArrowDown':
                case ' ':
                    (_d = document.getElementById('down-cont')) === null || _d === void 0 ? void 0 : _d.classList.remove('down-cont-clicked');
                    break;
                default:
                    throw new Error('invalid key');
            }
        };
        this.renderMap(document.getElementById('game-grid'));
        this.updateMovingBlockRenderAction(() => { }, Game.movingBlockGridPrefix, Game.movingBlockFillClass, true, true);
        this.registerAutoBlockMove(Game.movingBlockGridPrefix, Game.movingBlockFillClass);
        window.addEventListener('keydown', moveByKey);
        window.addEventListener('keyup', buttonUp);
        this._player.startTimer(document.getElementById('time'));
    }
}
Game.movingBlockGridPrefix = 'moving-block-grid';
Game.movingBlockFillClass = 'fill-moving-block';
Game.previewMap = new PreviewMap();

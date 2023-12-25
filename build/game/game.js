import { Controller } from "./controller.js";
import { BlockBundle } from "../block/blockBundle.js";
import { Map } from "../map/map.js";
export class Game extends Controller {
    constructor() {
        super(BlockBundle, Map);
    }
    pause() {
        this.pauseBlockMoving();
    }
    play() {
        const moveByKey = (e) => {
            switch (e.key) {
                case 'ArrowUp':
                    this.updateMovingBlockRenderAction(() => this.blockRotate(), Game.movingBlockGridPrefix, Game.movingBlockFillClass);
                    break;
                case 'ArrowDown':
                    this.updateMovingBlockRenderAction(() => this.blockMoveDown(), Game.movingBlockGridPrefix, Game.movingBlockFillClass);
                    this.registerAutoBlockMove(Game.movingBlockGridPrefix, Game.movingBlockFillClass);
                    break;
                case 'ArrowLeft':
                    this.updateMovingBlockRenderAction(() => this.blockMove('left'), Game.movingBlockGridPrefix, Game.movingBlockFillClass);
                    break;
                case 'ArrowRight':
                    this.updateMovingBlockRenderAction(() => this.blockMove('right'), Game.movingBlockGridPrefix, Game.movingBlockFillClass);
                    break;
                case ' ':
                    this.updateMovingBlockRenderAction(() => this.blockMoveDownToEnd(), Game.movingBlockGridPrefix, Game.movingBlockFillClass);
                    this.registerAutoBlockMove(Game.movingBlockGridPrefix, Game.movingBlockFillClass);
                    break;
                default:
                    return;
            }
        };
        this.renderMap(document.getElementById('root'));
        this.renderMovingBlock(Game.movingBlockGridPrefix, Game.movingBlockFillClass);
        this.registerAutoBlockMove(Game.movingBlockGridPrefix, Game.movingBlockFillClass);
        window.addEventListener('keydown', moveByKey);
    }
}
Game.movingBlockGridPrefix = 'moving-block-grid';
Game.movingBlockFillClass = 'fill-moving-block';

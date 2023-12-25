import { Controller } from "./controller.js";
import { BlockBundle } from "../block/blockBundle.js";
import { Map } from "../map/map.js";
export class Game extends Controller {
    constructor() {
        super(BlockBundle, Map);
    }
    play() {
        const moveByKey = (e) => {
            this.eraseTrackOfMovingBlock(Game.movingBlockGridPrefix, Game.movingBlockFillClass);
            switch (e.key) {
                case 'ArrowUp':
                    this.blockRotate();
                    break;
                case 'ArrowDown':
                    this.blockMoveDown();
                    break;
                case 'ArrowLeft':
                    this.blockMove('left');
                    break;
                case 'ArrowRight':
                    this.blockMove('right');
                    break;
                case ' ':
                    let crash = this.blockMoveDown();
                    while (!crash)
                        crash = this.blockMoveDown();
                    break;
                default:
                    throw new Error('unsupported key');
            }
            this.renderMovingBlock(Game.movingBlockGridPrefix, Game.movingBlockFillClass);
        };
        this.renderMap(document.getElementById('root'));
        this.renderMovingBlock(Game.movingBlockGridPrefix, Game.movingBlockFillClass);
        window.addEventListener('keydown', moveByKey);
    }
}
Game.movingBlockGridPrefix = 'moving-block-grid';
Game.movingBlockFillClass = 'fill-moving-block';
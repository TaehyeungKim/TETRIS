import { Controller } from "./controller.js";
import { BlockBundle } from "../block/blockBundle.js";
import { Map } from "../map/map.js";

export class Game extends Controller {

    private static movingBlockGridPrefix: string = 'moving-block-grid'
    private static movingBlockFillClass: string = 'fill-moving-block'

    constructor() {
        super(BlockBundle, Map)
    }


    play() {
        const moveByKey = (e: KeyboardEvent) => {
            this.eraseTrackOfMovingBlock(Game.movingBlockGridPrefix, Game.movingBlockFillClass)
            switch(e.key) {
                case 'ArrowUp': 
                    this.blockRotate();
                    break;
                case 'ArrowDown':
                    this.blockMove('down');
                    this.blockCrashDown();
                    break;
                case 'ArrowLeft':
                    this.blockMove('left');
                    break;
                case 'ArrowRight':
                    this.blockMove('right');
                    break;
                default:
                    throw new Error('unsupported key');
            }
            this.renderMovingBlock(Game.movingBlockGridPrefix, Game.movingBlockFillClass);
        }
        this.renderMap(document.getElementById('root') as HTMLElement)
        this.renderMovingBlock(Game.movingBlockGridPrefix, Game.movingBlockFillClass)
        window.addEventListener('keydown', moveByKey)
    }
}
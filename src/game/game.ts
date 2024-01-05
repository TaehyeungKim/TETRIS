import { Controller } from "./controller.js";
import { BlockBundle } from "../block/blockBundle.js";
import { Map } from "../map/map.js";
import { PreviewMap } from "../map/preview.js";

export interface GameInterface {
    play(): void;
    pause(): void
}

export class Game extends Controller implements GameInterface{

    private static movingBlockGridPrefix: string = 'moving-block-grid'
    private static movingBlockFillClass: string = 'fill-moving-block'

    private static previewMap: PreviewMap = new PreviewMap();

    constructor() {
        super(BlockBundle, Map)
        Game.previewMap.renderPreviewMap(document.getElementById('preview-next-container') as HTMLElement)
    }

    pause() {
        this.pauseBlockMoving()
        this._player.endTimer()
    }


    play() {
        const moveByKey = (e: KeyboardEvent) => {
            switch(e.key) {
                case 'ArrowUp': 
                    this.updateMovingBlockRenderAction(()=>this.blockRotate(), Game.movingBlockGridPrefix, Game.movingBlockFillClass)
                    document.getElementById('top-cont')?.classList.add('top-cont-clicked')
                    break;
                case 'ArrowDown':
                    this.updateMovingBlockRenderAction(()=>this.blockMoveDown(Game.movingBlockGridPrefix, Game.movingBlockFillClass), Game.movingBlockGridPrefix, Game.movingBlockFillClass)
                    this.registerAutoBlockMove(Game.movingBlockGridPrefix, Game.movingBlockFillClass)
                    document.getElementById('down-cont')?.classList.add('down-cont-clicked')
                    break;
                case 'ArrowLeft':
                    this.updateMovingBlockRenderAction(()=>this.blockMove('left'), Game.movingBlockGridPrefix, Game.movingBlockFillClass)
                    document.getElementById('left-cont')?.classList.add('left-cont-clicked')
                    break;
                case 'ArrowRight':
                    this.updateMovingBlockRenderAction(()=>this.blockMove('right'), Game.movingBlockGridPrefix, Game.movingBlockFillClass)
                    document.getElementById('right-cont')?.classList.add('right-cont-clicked')
                    break;
                case ' ':
                    this.updateMovingBlockRenderAction(()=>this.blockMoveDownToEnd(Game.movingBlockGridPrefix, Game.movingBlockFillClass), Game.movingBlockGridPrefix, Game.movingBlockFillClass)
                    this.registerAutoBlockMove(Game.movingBlockGridPrefix, Game.movingBlockFillClass)
                    document.getElementById('down-cont')?.classList.add('down-cont-clicked')
                    break;
                default:
                    return ;
            }
        }

        const buttonUp = (e:KeyboardEvent) => {
            switch(e.key) {
                case 'ArrowUp':
                    document.getElementById('top-cont')?.classList.remove('top-cont-clicked')
                    break;
                case 'ArrowLeft':
                    document.getElementById('left-cont')?.classList.remove('left-cont-clicked');
                    break;
                case 'ArrowRight':
                    document.getElementById('right-cont')?.classList.remove('right-cont-clicked');
                    break;
                case 'ArrowDown':
                case ' ':
                    document.getElementById('down-cont')?.classList.remove('down-cont-clicked');
                    break;
                
                default:
                    throw new Error('invalid key');
            }
        }

        this.renderMap(document.getElementById('game-grid') as HTMLElement)
        this.updateMovingBlockRenderAction(()=>{}, Game.movingBlockGridPrefix, Game.movingBlockFillClass, true, true)
        this.registerAutoBlockMove(Game.movingBlockGridPrefix, Game.movingBlockFillClass);
        window.addEventListener('keydown', moveByKey)
        window.addEventListener('keyup', buttonUp)

        this._player.startTimer(document.getElementById('time') as HTMLElement);
    }
}
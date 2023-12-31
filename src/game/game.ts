import { Controller } from "./controller.js";
import { BlockBundle } from "../block/blockBundle.js";
import { Map } from "../map/map.js";
import { PreviewMap } from "../map/preview.js";

type validKey = 'up'|'down'|'left'|'right'|'spacebar'

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

        const actionByKeySet = (key: validKey) =>  {
            switch(key) {
                case 'up':
                    this.updateMovingBlockRenderAction(()=>this.blockRotate(), Game.movingBlockGridPrefix, Game.movingBlockFillClass)
                    document.getElementById('top-cont')?.classList.add('top-cont-clicked')
                    break;
                case 'down':
                    this.updateMovingBlockRenderAction(()=>this.blockMoveDown(Game.movingBlockGridPrefix, Game.movingBlockFillClass), Game.movingBlockGridPrefix, Game.movingBlockFillClass)
                    this.registerAutoBlockMove(Game.movingBlockGridPrefix, Game.movingBlockFillClass)
                    document.getElementById('down-cont')?.classList.add('down-cont-clicked')
                    break;
                case 'left':
                    this.updateMovingBlockRenderAction(()=>this.blockMove('left'), Game.movingBlockGridPrefix, Game.movingBlockFillClass)
                    document.getElementById('left-cont')?.classList.add('left-cont-clicked')
                    break;
                case 'right':
                    this.updateMovingBlockRenderAction(()=>this.blockMove('right'), Game.movingBlockGridPrefix, Game.movingBlockFillClass)
                    document.getElementById('right-cont')?.classList.add('right-cont-clicked')
                    break;
                case 'spacebar':
                    this.updateMovingBlockRenderAction(()=>this.blockMoveDownToEnd(Game.movingBlockGridPrefix, Game.movingBlockFillClass), Game.movingBlockGridPrefix, Game.movingBlockFillClass)
                    this.registerAutoBlockMove(Game.movingBlockGridPrefix, Game.movingBlockFillClass)
                    document.getElementById('down-cont')?.classList.add('down-cont-clicked')
                    break;
                default:
                    throw new Error('invalid key')
            }
        }

        const backActionByKeySet = (key: validKey) => {
            switch(key) {
                case 'up':
                    document.getElementById('top-cont')?.classList.remove('top-cont-clicked')
                    break;
                case 'right':
                    document.getElementById('right-cont')?.classList.remove('right-cont-clicked');
                    break;
                case 'left':
                    document.getElementById('left-cont')?.classList.remove('left-cont-clicked');
                    break;
                case 'down':
                case 'spacebar':
                    document.getElementById('down-cont')?.classList.remove('down-cont-clicked');
                    break;
                default:
                    throw new Error('invalid key');
            }
        }

        const moveByKey = (e: KeyboardEvent) => {
            switch(e.key) {
                case 'ArrowUp': 
                    actionByKeySet('up')
                    break;
                case 'ArrowDown':
                    actionByKeySet('down')
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
                    return ;
            }
        }
        const buttonUp = (e:KeyboardEvent) => {
            switch(e.key) {
                case 'ArrowUp':
                    backActionByKeySet('up')
                    break;
                case 'ArrowLeft':
                    backActionByKeySet('left')
                    break;
                case 'ArrowRight':
                    backActionByKeySet('right')
                    break;
                case 'ArrowDown':
                    backActionByKeySet('down');
                    break;
                case ' ':
                    backActionByKeySet('spacebar');
                    break;
            }
        }

        this.renderMap(document.getElementById('game-grid') as HTMLElement)
        this.updateMovingBlockRenderAction(()=>{}, Game.movingBlockGridPrefix, Game.movingBlockFillClass, true, true)
        this.registerAutoBlockMove(Game.movingBlockGridPrefix, Game.movingBlockFillClass);
        window.addEventListener('keydown', moveByKey)
        window.addEventListener('keyup', buttonUp)

        

        document.getElementById('top-cont')?.addEventListener('mousedown', () => actionByKeySet('up'))
        document.getElementById('right-cont')?.addEventListener('mousedown', () => actionByKeySet('right'))
        document.getElementById('left-cont')?.addEventListener('mousedown', () => actionByKeySet('left'))
        document.getElementById('down-cont')?.addEventListener('mousedown', () => actionByKeySet('down'))

        document.getElementById('top-cont')?.addEventListener('mouseup', () => backActionByKeySet('up'))
        document.getElementById('right-cont')?.addEventListener('mouseup', () => backActionByKeySet('right'))
        document.getElementById('left-cont')?.addEventListener('mouseup', () => backActionByKeySet('left'))
        document.getElementById('down-cont')?.addEventListener('mouseup', () => backActionByKeySet('down'))

        document.getElementById('down-cont')?.addEventListener('dblclick',()=>{
            actionByKeySet('spacebar')
            backActionByKeySet('spacebar')
        })

        this._player.startTimer(document.getElementById('time') as HTMLElement);
    }
}
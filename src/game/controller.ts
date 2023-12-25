import {  BlockBundleInterface, BlockBundleConstructor } from "../block/blockBundle.js";
import { BlockElement, BlockMoveDirection } from "../block/blockElement.js";
import {  MapInterface, MapConstructor } from "../map/map.js";
import { INITIAL_BLOCK_SETTTING } from "../constant.js";

interface ControllerInterface {
    // renderMap(root: HTMLElement): void;
    // renderMovingBlock(idPrefix: string, c: string): void;
    // blockRotate(): void;
    // blockMove(dir: BlockMoveDirection): void;
    // eraseTrackOfMovingBlock(idPrefix: string, c: string): void;
    // blockMoveDown(idPrefix: string, c: string): void;
    
}

export class Controller implements ControllerInterface{

    private _map: MapInterface
    private _blockBundle: BlockBundleInterface;
    private _blockMoveTimer: number;

    constructor(blockBundle:BlockBundleConstructor, map: MapConstructor) {
        this._map = new map(10,20);
        this._blockBundle = new blockBundle(INITIAL_BLOCK_SETTTING.straight, BlockElement);
        this._blockMoveTimer = 0;
    }

    private validateRotateCondition(x:number, y:number) {
        return x >= 0 && x < this._map.width && y >= 0 && y < this._map.height && this._map.map[y][x] === 0;
    }

    private validateMoveCondition(dir: BlockMoveDirection) {
        const coords = this._blockBundle.blockBundleArray.map(block=>{
            return {x: block.x, y: block.y}
        })

        let valid = true
        switch(dir) {
            case "left":
                coords.forEach(coord=>{
                    if(coord.x-1 < 0 || this._map.map[coord.y][coord.x-1] === 1) valid = false;
                }) 
                break;
            case "right":
                coords.forEach(coord=>{
                    if(coord.x+1 > this._map.width-1 || this._map.map[coord.y][coord.x+1] === 1) valid = false;
                })
                break;
            case "down":
                break;
            default:
                throw new Error("do not check other directions");
        }
        return valid;
    }

    updateMovingBlockRenderAction(action:()=>unknown, idPrefix: string, c: string) {
        this.eraseTrackOfMovingBlock(idPrefix, c)
        action()
        this.renderMovingBlock(idPrefix, c)
    } 

    renderMap(root: HTMLElement) {
        this._map.renderMap(root);
    }

    renderMovingBlock(idPrefix: string, c: string) {
        this._blockBundle.render(idPrefix, c);
    }

    private eraseTrackOfMovingBlock(idPrefix: string, c: string) {
        this._blockBundle.erase(idPrefix, c)
    }

    protected blockRotate() {
        const {pointX, pointY} = this._blockBundle.blockBundleSetting.point(this._blockBundle.blockBundleArray)
        let valid = true;
        this._blockBundle.blockBundleArray.forEach(block=>{
            const {x, y} = block.rotateResultData(pointX, pointY)    
            if(!this.validateRotateCondition(x,y)) valid = false;
        })

        if(!valid) return;

        this._blockBundle.blockBundleArray.forEach((block=>block.rotate(pointX, pointY)));
    }

    protected blockMove(dir: BlockMoveDirection) {
        if(this.validateMoveCondition(dir)) this._blockBundle.move(dir);
    }

    private blockCrashDown():boolean {
        let crash = false;
        this._blockBundle.blockBundleArray.forEach(block=>{
            if(block.y > this._map.height - 1 || (this._map.map[block.y][block.x])) crash = true;
        })
        if(crash) {
            this._blockBundle.move('up');
            this._blockBundle.blockBundleArray.forEach(block=>this._map.fixBlock(block.x, block.y))
            this._blockBundle.refreshBundle();
        }

        this.checkIfFullLines();
        this.checkIfMapFull();

        return crash;
    }

    protected blockMoveDown(): boolean {
        clearTimeout(this._blockMoveTimer);
        this.blockMove('down');
        return this.blockCrashDown();
    }

    protected blockMoveDownToEnd() {
        let crash: boolean = this.blockMoveDown();
        while(!crash) crash = this.blockMoveDown();
    }

    protected registerAutoBlockMove(idPrefix: string, c: string) {
        const timerPromise:()=>Promise<boolean> = () => new Promise<boolean>((resolve)=>{
            const validateMoveDown = this._map.detectFullLine().length > 0;
            this._blockMoveTimer = setTimeout(()=>{
                if(!validateMoveDown) {
                    this.updateMovingBlockRenderAction(()=>this.blockMoveDown(), idPrefix, c)
                }
                resolve(true);
                clearTimeout(this._blockMoveTimer)
            },1000)
        }).then(timerPromise)

        timerPromise();
    }


    private checkIfFullLines() {
        const fullLines = this._map.detectFullLine();
        if(fullLines.length === 0 ) return ;

        this._map.destroyFullLine();
    }

    private checkIfMapFull() {
       if(this._map.map[0].reduce((a,b)=>a+b)===10) console.log('fail')
    }
}
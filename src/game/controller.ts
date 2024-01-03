import {  BlockBundleInterface, BlockBundleConstructor } from "../block/blockBundle.js";
import { BlockElement, BlockMoveDirection } from "../block/blockElement.js";
import {  MapInterface, MapConstructor } from "../map/map.js";
import { INITIAL_BLOCK_SETTTING, MAP_WIDTH } from "../constant.js";
import { Player, PlayerInterface } from "./player.js";

export class Controller {

    private _map: MapInterface 
    private _blockBundle: BlockBundleInterface;
    private _blockMoveTimer: number;

    protected _player: PlayerInterface = new Player();


    constructor(blockBundle:BlockBundleConstructor, map: MapConstructor) {
        this._map = new map(10,20);
        this._blockBundle = new blockBundle(INITIAL_BLOCK_SETTTING.straight, BlockElement);
        this._blockMoveTimer = 0;
    }

    private validateRotateCondition(x:number, y:number) {
        return x >= 0 && x < this._map.width && y >= 0 && y < this._map.height && this._map.map[y][x].filled === 0;
    }

    private validateMoveCondition(dir: BlockMoveDirection) {
        const coords = this._blockBundle.blockBundleArray.map(block=>{
            return {x: block.x, y: block.y}
        })

        let valid = true
        switch(dir) {
            case "left":
                coords.forEach(coord=>{
                    if(coord.x-1 < 0 || this._map.map[coord.y][coord.x-1].filled === 1) valid = false;
                }) 
                break;
            case "right":
                coords.forEach(coord=>{
                    if(coord.x+1 > this._map.width-1 || this._map.map[coord.y][coord.x+1].filled === 1) valid = false;
                })
                break;
            case "down":
                break;
            default:
                throw new Error("do not check other directions");
        }
        return valid;
    }

    private renderPreviewNext() {
        this._blockBundle.nextBlockBundleSetting.coord.forEach((coord)=>{
            document.getElementById(`preview-grid_${coord.y*4+coord.x}`)?.classList.add('preview-fill')
        })
    }

    private erasePreviewNext() {
        this._blockBundle.blockBundleSetting.coord.forEach(coord=>{
            document.getElementById(`preview-grid_${coord.y*4+coord.x}`)?.classList.remove('preview-fill')
        })
    }

    updateMovingBlockRenderAction(action:()=>unknown, idPrefix: string, c: string, prev:boolean=false) {
        this.eraseTrackOfMovingBlock(idPrefix, c)
        action()
        this.renderMovingBlock(idPrefix, c, prev)
    } 

    renderMap(root: HTMLElement) {
        this._map.renderMap(root);
    }

    renderMovingBlock(idPrefix: string, c: string, prev:boolean=false) {
        this._blockBundle.render(idPrefix, c, MAP_WIDTH);
        if(prev) {
            this.erasePreviewNext();
            this.renderPreviewNext();
        }
    }

    private eraseTrackOfMovingBlock(idPrefix: string, c: string) {
        this._blockBundle.erase(idPrefix, c, MAP_WIDTH)
    }

    protected pauseBlockMoving() {
        clearTimeout(this._blockMoveTimer)
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

    private checkBlockCrashDown(idPrefix: string, c: string):boolean {
        let crash = false;
        this._blockBundle.blockBundleArray.forEach(block=>{
            if(block.y > this._map.height - 1 || (this._map.map[block.y][block.x].filled===1)) crash = true;
        })
        if(crash) {
            this._blockBundle.crashed = true;
            this._blockBundle.move('up');
            this._blockBundle.blockBundleArray.forEach(block=>{
                this._map.fixBlock(block.x, block.y, this._blockBundle.blockBundleSetting.type)
            })
            this.checkIfFullLines().then(()=>{
                
                this.updateMovingBlockRenderAction(()=>this._blockBundle.refreshBundle(), idPrefix, c, true)
            })
        }

        
        this.checkIfMapFull();

        return crash;
    }

    protected blockMoveDown(idPrefix: string, c: string): boolean {

        if(this._blockBundle.isFrozen) return false; 
        this.blockMove('down');
        clearTimeout(this._blockMoveTimer);
        
        return this.checkBlockCrashDown(idPrefix, c);
    }

    protected blockMoveDownToEnd(idPrefix: string, c: string) {
        let crash: boolean = this.blockMoveDown(idPrefix, c);
        while(!crash) crash = this.blockMoveDown(idPrefix, c);
    }

    protected registerAutoBlockMove(idPrefix: string, c: string) {
        const timerPromise:()=>Promise<boolean> = () => new Promise<boolean>((resolve)=>{
            const validateMoveDown = this._map.detectFullLine().length > 0;
            this._blockMoveTimer = setTimeout(()=>{
                if(!validateMoveDown) {
                    this.updateMovingBlockRenderAction(()=>this.blockMoveDown(idPrefix, c), idPrefix, c)
                }
                resolve(true);
                clearTimeout(this._blockMoveTimer)
            },1000)
        }).then(timerPromise)

        timerPromise();
        
    }


    private async checkIfFullLines() {
        const fullLines = this._map.detectFullLine();
        if(fullLines.length === 0 ) return ;
        this._blockBundle.controllMove(true);
        return new Promise((resolve)=>{
            this._map.fullLineBlink(fullLines, 1000).then(()=>{
                this._map.destroyFullLine(fullLines)
                this._blockBundle.controllMove(false)
                this._player.updateScore(fullLines.length * 50, document.getElementById('score') as HTMLElement);
                
                resolve(true)
            })
        })
            
    }

    private checkIfMapFull() {
       if(this._map.map[0].reduce((a,b)=>a+b.filled,0)===10) console.log('fail')
    }

}
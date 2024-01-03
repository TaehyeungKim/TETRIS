import { BlockBundleSetting, BlockElementCoordinateInfo, BUNDLE_TYPE_ARRAY, INITIAL_BLOCK_SETTTING} from "../constant.js";
import { BlockMoveDirection, BlockElementConstructor, BlockElementInterface } from "./blockElement.js";


export interface BlockBundleInterface {
    get blockBundleArray(): BlockElementInterface[]
    get blockBundleSetting(): BlockBundleSetting
    get isFrozen(): boolean
    get nextBlockBundleSetting(): BlockBundleSetting
    get crashed(): boolean
    set crashed(c: boolean)

    render(idPrefix: string, c: string, w: number): void;
    erase(idPrefix: string, c: string, w: number): void;
    rotateResultData(): BlockElementCoordinateInfo[];
    rotate(): void;
    move(dir: BlockMoveDirection): void;
    refreshBundle(): void;    
    controllMove(freeze: boolean): void;
}

export type BlockBundleConstructor = {
    new(setting: BlockBundleSetting, blockElement: BlockElementConstructor):BlockBundleInterface
}

export class BlockBundle implements BlockBundleInterface{

    private _blockBundleArray: Array<BlockElementInterface>
    private _moveFrozen: boolean
    private _nextBlockBundle: BlockBundleSetting
    private _crashed: boolean

    constructor(private setting: BlockBundleSetting, blockElement: BlockElementConstructor) {
        this._blockBundleArray = setting.coord.map(coord=>new blockElement(coord.x, coord.y))
        this._moveFrozen = false;
        this._nextBlockBundle = this.setNextBlockBundle();
        this._crashed = false;
    }

    get crashed() {
        return this._crashed
    }

    set crashed(c: boolean) {
        this._crashed = c
    }

    get nextBlockBundleSetting() {
        return this._nextBlockBundle;
    }

    get blockBundleArray() {
        return this._blockBundleArray
    }

    get blockBundleSetting() {
        return this.setting
    }

    get isFrozen() {
        return this._moveFrozen
    }

    controllMove(freeze: boolean) {
        this._moveFrozen = freeze;
    }

    render(idPrefix: string, c: string, w: number) {
        if(!this._crashed){
            this._blockBundleArray.forEach(block=>block.renderFill(idPrefix, c, w))
            this._blockBundleArray.forEach(block=>block.renderFill(idPrefix, `${this.setting.type}-fill`, w));
        }
        
    }

    erase(idPrefix: string, c: string, w: number) {
        this._blockBundleArray.forEach(block=>block.erase(idPrefix, c, w))
        this._blockBundleArray.forEach(block=>block.erase(idPrefix, `${this.setting.type}-fill`, w));
    }


    

    rotateResultData() {
        const {pointX, pointY} = this.setting.point(this._blockBundleArray);
        return this._blockBundleArray.map(block=>block.rotateResultData(pointX, pointY)) 
    }

    rotate() {
        if(!this._moveFrozen) {
            const {pointX, pointY} = this.setting.point(this._blockBundleArray);
            this._blockBundleArray.forEach(block=>block.rotate(pointX, pointY))                
        }
        
    }

    move(dir: BlockMoveDirection) {
        if(!this._moveFrozen) this._blockBundleArray.forEach(block=>block.move(dir));
    }

    private setNextBlockBundle():BlockBundleSetting {
        const randomGen = () => Number.parseInt((Math.random()*10).toString());
        let random = randomGen();
        while(random >= BUNDLE_TYPE_ARRAY.length) random = randomGen();

        const newType = BUNDLE_TYPE_ARRAY[random];
        return INITIAL_BLOCK_SETTTING[newType]
    }

    refreshBundle() {
        this._crashed = false;
        this.setting = this._nextBlockBundle;

        this._blockBundleArray.forEach((block: BlockElementInterface, index: number)=>{
            block.x = this.setting.coord[index].x; 
            block.y = this.setting.coord[index].y;
        })

        this._nextBlockBundle = this.setNextBlockBundle();
    }
}
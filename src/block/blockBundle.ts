import { BlockElementInterface } from "./blockElement.js";
import { BlockBundleSetting, BlockElementCoordinateInfo, BUNDLE_TYPE_ARRAY, INITIAL_BLOCK_SETTTING} from "../constant.js";
import { BlockMoveDirection } from "./blockElement.js";

interface BlockBundleInterface {
    render(idPrefix: string, c: string): void;
    erase(idPrefix: string, c: string): void;
    rotateResultData(): BlockElementCoordinateInfo[];
    rotate(): void;
    move(dir: BlockMoveDirection): void;
    refreshBundle(): void;    
}

type BlockElementConstructor = {
    new (x: number, y: number): BlockElementInterface
}

export class BlockBundle implements BlockBundleInterface{

    private _blockBundleArray: Array<BlockElementInterface>

    constructor(private setting: BlockBundleSetting, blockElement: BlockElementConstructor) {
        this._blockBundleArray = setting.coord.map(coord=>new blockElement(coord.x, coord.y))
    }

    render(idPrefix: string, c: string) {
        this._blockBundleArray.forEach(block=>block.renderFill(idPrefix, c))
    }

    erase(idPrefix: string, c: string) {
        this._blockBundleArray.forEach(block=>block.erase(idPrefix, c))
    }

    rotateResultData() {
        const {pointX, pointY} = this.setting.point(this._blockBundleArray);
        return this._blockBundleArray.map(block=>block.rotateResultData(pointX, pointY)) 
    }

    rotate() {
        const {pointX, pointY} = this.setting.point(this._blockBundleArray);
        this._blockBundleArray.forEach(block=>block.rotate(pointX, pointY))                
    }

    move(dir: BlockMoveDirection) {
        this._blockBundleArray.forEach(block=>block.move(dir));
    }

    refreshBundle() {
        const randomGen = () => Number.parseInt((Math.random()*10).toString());
        let random = randomGen();
        while(random >= BUNDLE_TYPE_ARRAY.length) random = randomGen();

        const newType = BUNDLE_TYPE_ARRAY[random];
        this.setting = INITIAL_BLOCK_SETTTING[newType];
        this._blockBundleArray.forEach((block: BlockElementInterface, index: number)=>{
            block.x = this.setting.coord[index].x; 
            block.y = this.setting.coord[index].y;
        })
    }
}
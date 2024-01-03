
import { BlockBundleType } from "../constant.js";
import { MapRenderer, MapRendererInterface } from "./renderer.js";

export interface MapInterface extends MapRendererInterface {
    get map(): MapGridInfo[][];
    get width(): number;
    get height(): number;

    detectFullLine(): MapGridInfo[][];
    fixBlock(x: number, y: number, type: BlockBundleType): void;
    eraseBlock(x:number, y:number): void;
    destroyFullLine(fullLines: MapGridInfo[][]): void;
    fullLineBlink(fullLines: MapGridInfo[][], blinkTime: number): Promise<boolean>
}

export type MapConstructor = {
    new(_w: number, _h: number): MapInterface
}

export type MapGridInfo = {
    type: BlockBundleType|null,
    filled: 0|1
}

export class Map extends MapRenderer implements MapInterface {

    private _map: Array<Array<MapGridInfo>>;
    private static gridBlinkClass: string = 'fullLine-grid-blink'

    constructor(private _w: number, private _h: number) {
        super();
        this._map = [];
        for(let i = 0; i < this._h; i++) this._map.push([]);
        this._map.forEach(row=>{for(let k = 0; k < this._w; k++) row.push({type: null, filled: 0});})
    }

    get map() {
        return this._map
    }

    get width() {
        return this._w
    }

    get height() {
        return this._h
    }

    detectFullLine() {
        const fullLines = this._map.filter(line=>line.reduce((a,b)=> a + b.filled,0)===10)
        return fullLines;
    }

    fixBlock(x: number, y: number, type: BlockBundleType) {
        this._map[y][x].filled = 1;
        this._map[y][x].type = type
        this.modifyGridByClass(`block-grid_${y*10 + x}`, `${type}-fill`, 'add')
        this.modifyGridByClass(`block-grid_${y*10 + x}`, 'fill-fixed-block', 'add')
    }

    eraseBlock(x:number, y:number) {
        const prevInfo = this._map[y][x]
        this.modifyGridByClass(`block-grid_${y*10 + x}`, `${prevInfo.type}-fill`,'remove')
        this.modifyGridByClass(`block-grid_${y*10 + x}`, 'fill-fixed-block','remove')
        prevInfo.filled = 0;
        prevInfo.type = null
    }

    async fullLineBlink(fullLines: MapGridInfo[][], blinkTime: number): Promise<boolean> {

        let walk = fullLines.length - 1

        for(let k = this._h - 1; k >=0; k--) {
            if(this._map[k] === fullLines[walk]) {
                for(let j = 0; j < this._w; j++) this.modifyGridByClass(`block-grid_${k*10 + j}`, Map.gridBlinkClass, 'add')
                walk--
            }
            if(walk < 0) break;
        }


        return new Promise((resolve)=>{
            setTimeout(()=>resolve(true), blinkTime)
        }).then(()=>{

            let walk = fullLines.length - 1

            for(let k = this._h - 1; k >=0; k--) {
                if(this._map[k] === fullLines[walk]) {
                    for(let j = 0; j < this._w; j++) this.modifyGridByClass(`block-grid_${k*10 + j}`, Map.gridBlinkClass, 'remove')
                    walk--
                }
                if(walk < 0) break;
            }
            return true
        })
    }

    destroyFullLine(fullLines: MapGridInfo[][]) {
    
        if(fullLines.length === 0) return ;

        let walk = fullLines.length - 1;

        for(let k = this._h - 1; k >= 0; k--) {
            if(this._map[k] === fullLines[walk]) {
                this._map[k].forEach((_: MapGridInfo, i: number)=>this.eraseBlock(i, k));
                walk--
            }
            else {
                this._map[k].forEach((v: MapGridInfo, i: number)=>{
                    if(walk < fullLines.length - 1 && v.filled===1 && v.type) {
                        this.fixBlock(i, k+fullLines.length-1-walk, v.type);
                        this.eraseBlock(i, k)
                    }
                })
            }
        }
    }
 
}
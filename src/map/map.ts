
import { MapRenderer, MapRendererInterface } from "./renderer.js";

export interface MapInterface extends MapRendererInterface {
    get map(): number[][];
    get width(): number;
    get height(): number;

    detectFullLine(): number[][];
    fixBlock(x: number, y: number): void;
    eraseBlock(x:number, y:number): void;
    destroyFullLine(): void;
}

export type MapConstructor = {
    new(_w: number, _h: number): MapInterface
}

export class Map extends MapRenderer implements MapInterface {

    private _map: Array<Array<number>>;

    constructor(private _w: number, private _h: number) {
        super();
        this._map = [];
        for(let i = 0; i < this._h; i++) this._map.push([]);
        this._map.forEach(row=>{for(let k = 0; k < this._w; k++) row.push(0);})
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
        const fullLines = this._map.filter(line=>line.reduce((a,b)=>a+b)===10)
        return fullLines;
    }

    fixBlock(x: number, y: number) {
        this._map[y][x] = 1;
        this.modifyGridByClass(`block-grid_${y*10 + x}`, 'fill-fixed-block', 'add')
    }

    eraseBlock(x:number, y:number) {
        this._map[y][x] = 0;
        this.modifyGridByClass(`block-grid_${y*10 + x}`, 'fill-fixed-block','remove')
    }

    destroyFullLine() {
        const fullLines = this.detectFullLine();
        if(fullLines.length === 0) return ;

        let walk = fullLines.length - 1;

        for(let k = this._h - 1; k >= 0; k--) {
            if(this._map[k] === fullLines[walk]) {
                this._map[k].forEach((_: number, i: number)=>this.eraseBlock(i, k));
                walk--
            }
            else {
                this._map[k].forEach((v: number, i: number)=>{
                    if(walk < fullLines.length - 1 && v===1) {
                        this.fixBlock(i, k+fullLines.length-1-walk);
                        this.eraseBlock(i, k)
                    }
                })
            }
        }
    }
 
}
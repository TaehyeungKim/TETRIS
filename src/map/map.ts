
import { MapRenderer } from "./renderer.js";

export interface MapInterface {
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
        this.modifyGridByClass(`block-grid_${y*10 + x}`, 'fill', 'add')
    }

    eraseBlock(x:number, y:number) {
        this._map[y][x] = 0;
        this.modifyGridByClass(`block-grid_${y*10 + x}`, 'fill','remove')
    }

    destroyFullLine() {
        const fullLines = this.detectFullLine().reverse();
        if(fullLines.length === 0) return ;

        let walk = 0;
        this._map.reverse().forEach((row: number[], index:number)=>{
            if(row === fullLines[walk]) {
                row.forEach((_:number, i: number)=>this.eraseBlock(i, index))
                walk++;
            }
            else if(index < this._map.length - 1) row.forEach((v:number, i: number)=>{
                if(v === 1) {
                    this.fixBlock(i, index-walk);
                    this.eraseBlock(i, index);
                }
            })
            this._map.reverse();
        })
    }
 
}
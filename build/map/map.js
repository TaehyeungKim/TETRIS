import { MapRenderer } from "./renderer.js";
export class Map extends MapRenderer {
    constructor(_w, _h) {
        super();
        this._w = _w;
        this._h = _h;
        this._map = [];
        for (let i = 0; i < this._h; i++)
            this._map.push([]);
        this._map.forEach(row => { for (let k = 0; k < this._w; k++)
            row.push(0); });
    }
    get map() {
        return this._map;
    }
    get width() {
        return this._w;
    }
    get height() {
        return this._h;
    }
    detectFullLine() {
        const fullLines = this._map.filter(line => line.reduce((a, b) => a + b) === 10);
        return fullLines;
    }
    fixBlock(x, y) {
        this._map[y][x] = 1;
        this.modifyGridByClass(`block-grid_${y * 10 + x}`, 'fill-fixed-block', 'add');
    }
    eraseBlock(x, y) {
        this._map[y][x] = 0;
        this.modifyGridByClass(`block-grid_${y * 10 + x}`, 'fill-fixed-block', 'remove');
    }
    destroyFullLine() {
        const fullLines = this.detectFullLine();
        if (fullLines.length === 0)
            return;
        let walk = fullLines.length - 1;
        for (let k = this._h - 1; k >= 0; k--) {
            if (this._map[k] === fullLines[walk]) {
                this._map[k].forEach((_, i) => this.eraseBlock(i, k));
                walk--;
            }
            else {
                this._map[k].forEach((v, i) => {
                    if (v === 1) {
                        this.fixBlock(i, k + fullLines.length - 1 - walk);
                        this.eraseBlock(i, k);
                    }
                });
            }
        }
        // const fullLines = this.detectFullLine().reverse();
        // if(fullLines.length === 0) return ;
        // let walk = 0;
        // this._map.reverse().forEach((row: number[], index:number)=>{
        //     if(row === fullLines[walk]) {
        //         row.forEach((_:number, i: number)=>this.eraseBlock(i, this._h-1 - index))
        //         walk++;
        //     }
        //     else if(index < this._map.length - 1) row.forEach((v:number, i: number)=>{
        //         if(v === 1) {
        //             this.fixBlock(i, this._h - 1 - (index-walk));
        //             this.eraseBlock(i, this._h - 1 - index);
        //         }
        //     })
        // })
        // this._map.reverse();
    }
}

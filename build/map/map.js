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
    detectFullLine() {
        const fullLines = this._map.filter(line => line.reduce((a, b) => a + b) === 10);
        return fullLines;
    }
}

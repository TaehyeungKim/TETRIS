var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
            row.push({ type: null, filled: 0 }); });
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
        const fullLines = this._map.filter(line => line.reduce((a, b) => a + b.filled, 0) === 10);
        return fullLines;
    }
    fixBlock(x, y, type) {
        this._map[y][x].filled = 1;
        this._map[y][x].type = type;
        this.modifyGridByClass(`block-grid_${y * 10 + x}`, `${type}-fill`, 'add');
        this.modifyGridByClass(`block-grid_${y * 10 + x}`, 'fill-fixed-block', 'add');
    }
    eraseBlock(x, y) {
        const prevInfo = this._map[y][x];
        this.modifyGridByClass(`block-grid_${y * 10 + x}`, `${prevInfo.type}-fill`, 'remove');
        this.modifyGridByClass(`block-grid_${y * 10 + x}`, 'fill-fixed-block', 'remove');
        prevInfo.filled = 0;
        prevInfo.type = null;
    }
    fullLineBlink(fullLines, blinkTime) {
        return __awaiter(this, void 0, void 0, function* () {
            let walk = fullLines.length - 1;
            for (let k = this._h - 1; k >= 0; k--) {
                if (this._map[k] === fullLines[walk]) {
                    for (let j = 0; j < this._w; j++)
                        this.modifyGridByClass(`block-grid_${k * 10 + j}`, Map.gridBlinkClass, 'add');
                    walk--;
                }
                if (walk < 0)
                    break;
            }
            return new Promise((resolve) => {
                setTimeout(() => resolve(true), blinkTime);
            }).then(() => {
                let walk = fullLines.length - 1;
                for (let k = this._h - 1; k >= 0; k--) {
                    if (this._map[k] === fullLines[walk]) {
                        for (let j = 0; j < this._w; j++)
                            this.modifyGridByClass(`block-grid_${k * 10 + j}`, Map.gridBlinkClass, 'remove');
                        walk--;
                    }
                    if (walk < 0)
                        break;
                }
                return true;
            });
        });
    }
    destroyFullLine(fullLines) {
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
                    if (walk < fullLines.length - 1 && v.filled === 1 && v.type) {
                        this.fixBlock(i, k + fullLines.length - 1 - walk, v.type);
                        this.eraseBlock(i, k);
                    }
                });
            }
        }
    }
}
Map.gridBlinkClass = 'fullLine-grid-blink';

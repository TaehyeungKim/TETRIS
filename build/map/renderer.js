import { MAP_WIDTH, MAP_HEIGHT } from "../constant.js";
export class Renderer {
    makeElement(htmlTag, id, c) {
        const element = document.createElement(`${htmlTag}`);
        element.setAttribute('id', id);
        if (c)
            element.setAttribute('class', c);
        return element;
    }
    render(parent, target, inlineStyle) {
        if (!parent)
            throw new Error(`${parent} is not in the document`);
        if (inlineStyle)
            target.setAttribute('style', inlineStyle);
        parent.appendChild(target);
    }
    generateGrid(w, h, container, childId) {
        for (let i = 0; i < h; i++) {
            for (let j = 0; j < w; j++) {
                const blockGrid = this.makeElement('div', `${childId}_${i * w + j}`, childId);
                this.render(container, blockGrid);
            }
        }
    }
}
export class MapRenderer extends Renderer {
    renderMap(root) {
        const mapGrid = this.makeElement('div', 'map-grid');
        const mapOverlapGrid = this.makeElement('div', 'map-overlap-grid');
        this.generateGrid(MAP_WIDTH, MAP_HEIGHT, mapGrid, 'block-grid');
        this.generateGrid(MAP_WIDTH, MAP_HEIGHT, mapOverlapGrid, 'moving-block-grid');
        this.render(root, mapGrid, MapRenderer.mapGridTemplate);
        this.render(root, mapOverlapGrid, MapRenderer.mapOverlapGridTemplate);
    }
    modifyGridByClass(targetId, c, action) {
        var _a, _b;
        switch (action) {
            case 'add':
                (_a = document.getElementById(targetId)) === null || _a === void 0 ? void 0 : _a.classList.add(c);
                break;
            case 'remove':
                (_b = document.getElementById(targetId)) === null || _b === void 0 ? void 0 : _b.classList.remove(c);
                break;
            default:
                throw new Error('unvaild action');
        }
    }
}
MapRenderer.mapGridTemplate = `
    display: grid; grid-template-rows: repeat(${MAP_HEIGHT}, 1fr);
    grid-template-columns: repeat(${MAP_WIDTH}, 1fr);
    position: absolute; left: 0; top: 0; right: 0; bottom: 0;
    `;
MapRenderer.mapOverlapGridTemplate = MapRenderer.mapGridTemplate + `
    z-index: 10;
    `;

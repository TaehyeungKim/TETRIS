import { MAP_WIDTH, MAP_HEIGHT } from "../constant.js";

class Renderer {

    protected makeElement(htmlTag: keyof HTMLElementTagNameMap, id: string, c?: string):HTMLElement {
        const element =  document.createElement(`${htmlTag}`);
        element.setAttribute('id', id);
        if(c) element.setAttribute('class', c);
        return element
    }


    protected render(parent: HTMLElement, target: HTMLElement, inlineStyle?: string) {
        if(!parent) throw new Error(`${parent} is not in the document`)
        if(inlineStyle) target.setAttribute('style', inlineStyle)
        parent.appendChild(target)
    }
}

export class MapRenderer extends Renderer{

       
    private static mapGridTemplate: string = `
    display: grid; grid-template-rows: repeat(${MAP_HEIGHT}, 1fr);
    grid-template-columns: repeat(${MAP_WIDTH}, 1fr);
    position: absolute; left: 0; top: 0; right: 0; bottom: 0;
    `

    private static mapOverlapGridTemplate: string = MapRenderer.mapGridTemplate + `
    z-index: 10;
    `

    private generateGrid(container: HTMLElement, childId: string) {
        for(let i = 0; i < MAP_HEIGHT; i++) {
            for(let j = 0; j < MAP_WIDTH; j++) {
                const blockGrid = this.makeElement('div', `${childId}_${i*10 + j}`, childId)
                this.render(container,blockGrid);
            }
        }
    }

    renderMap(root: HTMLElement) {
        const mapGrid = this.makeElement('div', 'map-grid');
        const mapOverlapGrid = this.makeElement('div', 'map-overlap-grid')

        this.generateGrid(mapGrid, 'block-grid');
        this.generateGrid(mapOverlapGrid, 'moving-block-grid');

        this.render(root, mapGrid, MapRenderer.mapGridTemplate);
        this.render(root, mapOverlapGrid, MapRenderer.mapOverlapGridTemplate);

    }
}
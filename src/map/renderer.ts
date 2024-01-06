import { MAP_WIDTH, MAP_HEIGHT } from "../constant.js";

export class Renderer {

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

    protected generateGrid(w: number, h: number, container: HTMLElement, childId: string) {
        for(let i = 0; i < h; i++) {
            for(let j = 0; j < w; j++) {
                const blockGrid = this.makeElement('div', `${childId}_${i*w + j}`, childId)
                this.render(container,blockGrid);
            }
        }
    }
}

export interface MapRendererInterface {
    renderMap(root: HTMLElement): void;
}

export class MapRenderer extends Renderer implements MapRendererInterface{

       
    private static mapGridTemplate: string = `
    display: grid; grid-template-rows: repeat(${MAP_HEIGHT}, 1fr);
    grid-template-columns: repeat(${MAP_WIDTH}, 1fr);
    position: absolute; left: 0; top: 0; right: 0; bottom: 0;
    `

    private static mapOverlapGridTemplate: string = MapRenderer.mapGridTemplate + `
    z-index: 10;
    `

    

    renderMap(root: HTMLElement) {
        const mapGrid = this.makeElement('div', 'map-grid');
        const mapOverlapGrid = this.makeElement('div', 'map-overlap-grid')

        this.generateGrid(MAP_WIDTH, MAP_HEIGHT, mapGrid, 'block-grid');
        this.generateGrid(MAP_WIDTH, MAP_HEIGHT, mapOverlapGrid, 'moving-block-grid');

        this.render(root, mapGrid, MapRenderer.mapGridTemplate);
        this.render(root, mapOverlapGrid, MapRenderer.mapOverlapGridTemplate);

    }

    protected modifyGridByClass(targetId: string, c: string, action: 'add'|'remove') {
        switch(action) {
            case 'add':
                document.getElementById(targetId)?.classList.add(c);
                break;
            case 'remove':
                document.getElementById(targetId)?.classList.remove(c);
                break;
            default:
                throw new Error('unvaild action')
        }
        
    }
}
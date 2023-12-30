import { Renderer } from "./renderer.js";
export class PreviewMap extends Renderer {
    renderPreviewMap(root) {
        const grid = this.makeElement('div', 'preview-next', 'preview-next');
        this.generateGrid(4, 4, grid, 'preview-grid');
        this.render(root, grid);
    }
}

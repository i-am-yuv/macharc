import { ArrowElement } from './ArrowElement';
import { Block } from './Block';


export class BlockElement extends Block {
    override id: number;
    node: HTMLElement;
    window: Window;

    static find = (id: any, { window }: any) => {
        const { document } = window;
        const node = document.querySelector(`.blockid[value='${id}']`);

        return node ? new BlockElement(id.toString(), node.parentNode, { window }) : null;
    }

    static fromElement = (node: any, { window }: { window: Window; }) => {
        const input = node.querySelector(`.blockid`);
        return input ? new BlockElement(parseInt(input.value, 10), node, { window }) : null;
    }

    constructor(id: any, node: HTMLElement, { window }: { window: any; }) {
        super();
        this.id = parseInt(id, 10);
        this.node = node;
        this.window = window;
    }

    position = () => {
        const { top, left } = this.node.getBoundingClientRect();
        const { height, width } = this.window.getComputedStyle(this.node);

        return {
            top: top + this.window.scrollY,
            left: left + this.window.scrollX,
            height: parseInt(height, 10),
            width: parseInt(width, 10)
        };
    }

    styles = (styles: { left: string; top?: string; }) => {
        return Object.assign(this.node.style, styles);
    }

    arrow = () => {
        return ArrowElement.find(this);
    }
}

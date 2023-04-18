import * as uuid from 'uuid';

export class Item {
    name: string;
    uId: string;
    label: string;
    type: string;
    thumb: string;
    children: Item[];

    constructor(options: {
        name: string,
        label?: string,
        thumb?: string,
        type?: string;
        children?: Item[]
    }) {
        this.name = options.name;
        this.uId = uuid.v4();
        this.label = options.label!;
        this.thumb = options.thumb!;
        this.type = options.type!;
        this.children = options.children || [];
    }
}

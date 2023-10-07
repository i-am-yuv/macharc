export class Grid {
    draw: any;
    main: any;

    constructor(main: any) {
        this.main = main;
        this.draw = main.draw;
    }
    loadGrid() {
        var pattern = this.draw.pattern(50, 50, function (add: any) {
            add.rect(50, 50).fill('none').stroke({ width: 0.1, color: '#888' })
            add.rect(10, 10).fill('none').stroke({ width: 0.1, color: '#ddd' })
            add.rect(10, 10).fill('none').stroke({ width: 0.1, color: '#ddd' }).move(10, 0)
            add.rect(10, 10).fill('none').stroke({ width: 0.1, color: '#ddd' }).move(20, 0)
            add.rect(10, 10).fill('none').stroke({ width: 0.1, color: '#ddd' }).move(30, 0)
            add.rect(10, 10).fill('none').stroke({ width: 0.1, color: '#ddd' }).move(40, 0)
            add.rect(10, 10).fill('none').stroke({ width: 0.1, color: '#ddd' }).move(0, 10)
            add.rect(10, 10).fill('none').stroke({ width: 0.1, color: '#ddd' }).move(10, 10)
            add.rect(10, 10).fill('none').stroke({ width: 0.1, color: '#ddd' }).move(20, 10)
            add.rect(10, 10).fill('none').stroke({ width: 0.1, color: '#ddd' }).move(30, 10)
            add.rect(10, 10).fill('none').stroke({ width: 0.1, color: '#ddd' }).move(40, 10)
            add.rect(10, 10).fill('none').stroke({ width: 0.1, color: '#ddd' }).move(0, 20)
            add.rect(10, 10).fill('none').stroke({ width: 0.1, color: '#ddd' }).move(10, 20)
            add.rect(10, 10).fill('none').stroke({ width: 0.1, color: '#ddd' }).move(20, 20)
            add.rect(10, 10).fill('none').stroke({ width: 0.1, color: '#ddd' }).move(30, 20)
            add.rect(10, 10).fill('none').stroke({ width: 0.1, color: '#ddd' }).move(40, 20)
            add.rect(10, 10).fill('none').stroke({ width: 0.1, color: '#ddd' }).move(0, 30)
            add.rect(10, 10).fill('none').stroke({ width: 0.1, color: '#ddd' }).move(10, 30)
            add.rect(10, 10).fill('none').stroke({ width: 0.1, color: '#ddd' }).move(20, 30)
            add.rect(10, 10).fill('none').stroke({ width: 0.1, color: '#ddd' }).move(30, 30)
            add.rect(10, 10).fill('none').stroke({ width: 0.1, color: '#ddd' }).move(40, 30)
            add.rect(10, 10).fill('none').stroke({ width: 0.1, color: '#ddd' }).move(0, 40)
            add.rect(10, 10).fill('none').stroke({ width: 0.1, color: '#ddd' }).move(10, 40)
            add.rect(10, 10).fill('none').stroke({ width: 0.1, color: '#ddd' }).move(20, 40)
            add.rect(10, 10).fill('none').stroke({ width: 0.1, color: '#ddd' }).move(30, 40)
            add.rect(10, 10).fill('none').stroke({ width: 0.1, color: '#ddd' }).move(40, 40)
        });

        const hw = this.draw.attr().width - 110;
        const holder = this.draw.rect(hw, 700).fill('none').stroke({ color: '#888', width: 1 }).move(100, 20);
        holder.attr({ fill: pattern, name: "Grid", id: "grid" });

        this.main.activeElement = holder.attr();
        holder.on('click', (e: any) => {
            this.main.makeActive(holder);
            this.main.activeElement = holder.attr();
        });
    }
}

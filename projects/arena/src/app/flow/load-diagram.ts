export class LoadDiagram {
    draw: any;
    main: any;

    constructor(main: any) {
        this.main = main;
        this.draw = main.draw;
    }
    loadDia() {
        // replace this from load from saved diagram
        var _app = this;

        const rect = this.draw.rect(100, 80).radius(10).fill('#f2f2f2').stroke({ color: '#888', width: 1 }).move(350, 185);
        rect.attr({ id: "task_1" });

        // this.drawData.push(rect.attr());

        rect.draggable();



        var circle = this.draw.circle(50).fill('#91db22').attr({ id: "startEvent" }).move(200, 200);
        // this.drawData.push(circle.attr());
        circle.draggable();



        var polyline = this.draw.polyline('0,0 100,0');
        polyline.attr({ id: "connector" });
        polyline.fill('none').move(250, 225);
        polyline.stroke({ color: '#ccc', width: 2, linecap: 'round', linejoin: 'round' });

        // this.drawData.push(polyline.attr());

        var polygon = this.draw.polygon('0,0 0,10 10,5');
        polygon.attr({ id: "arrowright" });
        polygon.fill('#333').move(340, 220);

        // this.drawData.push(polygon.attr());

        circle.on('dragmove', e => {
            this.main.moveConnector('startEvent');
        });

        rect.on('dragmove', e => {
            this.main.moveConnector('task_1');
        });

    }
}

import { Utils } from "./utils";

export class Gateway {
    draw: any;
    main: any;

    constructor(main: any) {
        this.main = main;
        this.draw = main.draw;
    }
    createGateWay() {

        const _gatewayRect = this.draw.rect(26, 26).fill('#fff').stroke({ color: '#888', width: 1 });
        _gatewayRect.rotate(45);

        const _hl = this.draw.line(0, 0, 20, 0).move(3, 13);
        _hl.stroke({ color: '#333', width: 3 });

        const _vl = this.draw.line(0, 0, 20, 0).move(3, 13);
        _vl.stroke({ color: '#333', width: 3 });
        _vl.rotate(90);

        const _gw = this.draw.group();
        _gw.add(_gatewayRect);
        _gw.add(_hl);
        _gw.add(_vl);

        _gw.move(32, 230);



        _gw.on('mousedown', (e: any) => {
            const gw_id = Utils.uniqueID();

            const gatewayRect = this.draw.rect(26, 26).fill('#fff').stroke({ color: '#888', width: 1 });
            gatewayRect.rotate(45);
            gatewayRect.attr({ id: "gateway" + gw_id, name: "Gateway" });

            const hl = this.draw.line(0, 0, 20, 0).move(3, 13);
            hl.stroke({ color: '#333', width: 3 });

            const vl = this.draw.line(0, 0, 20, 0).move(3, 13);
            vl.stroke({ color: '#333', width: 3 });
            vl.rotate(90);

            var gwBoundary = this.draw.rect(gatewayRect.bbox().w + 20, gatewayRect.bbox().h + 20)
                .fill('none').stroke({ color: '#3DA7F1', width: 1 })
                .attr({ id: "gwBoundary" + gw_id, 'stroke-dasharray': '5,5', class: 'boundary' })
                .move(gatewayRect.bbox().x - 10, gatewayRect.bbox().y - 10);


            const gw = this.draw.group();
            gw.attr({ id: 'gateway' + gw_id });
            gw.add(gatewayRect);
            gw.add(hl);
            gw.add(vl);
            gw.add(gwBoundary);
            gw.size(60);
            gw.move(32, 230);

            gw.draggable();

            this.main.makeActive(gwBoundary);

            this.main.activeElement = gw.attr();

            this.draw.on('mousemove', (e: any) => {
                gw.move(e.offsetX - 25, e.offsetY - 25);
            });

            gw.on('click', (e: any) => {
                this.main.activeElement = gatewayRect.attr();
                if (e.shiftKey || e.ctrlKey || e.metaKey) {
                    this.main.selectElement(gwBoundary);
                    this.main.selectedElements.push(gw.attr('id'));
                } else {
                    this.main.makeActive(gwBoundary);
                }
            });
            gw.on('dragmove', (e: any) => {
                this.main.moveConnector(gatewayRect.attr('id'));
            });
        });
    }
}

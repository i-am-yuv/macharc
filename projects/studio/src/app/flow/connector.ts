import { SVG } from "@svgdotjs/svg.js";
import { Utils } from "./utils";

export class Connector {
    draw: any;
    main: any;

    constructor(main: any) {
        this.main = main;
        this.draw = main.draw;
    }
    createConnector() {
        var polyline = this.draw.polyline('0,0 30,0');
        polyline.fill('none').move(30, 660);
        polyline.stroke({ color: '#ccc', width: 2, linecap: 'round', linejoin: 'round' });


        var polygon = this.draw.polygon('0,0 0,10 10,5');
        polygon.attr({ id: "arrowright" });
        polygon.fill('#333').move(60, 655);

        var box = this.draw.rect(50, 40).stroke({ color: '#ddd', width: 1 }).fill('#fff').move(25, 640);
        var connectorGroup = this.draw.group();
        connectorGroup.add(box);
        connectorGroup.add(polyline);
        connectorGroup.add(polygon);

        // connectorGroup.rotate(-45);
        connectorGroup.on('click', (e: any) => {
            console.log(this.main.selectedElements);
            if (this.main.selectedElements.length > 1) {
                var o = this.main.selectedElements[0];
                var d = this.main.selectedElements[1];
                var ox = SVG('#' + o).bbox().x;
                var dx = SVG('#' + d).bbox().x;
                if (dx > ox) {
                    this.makeConnector(o, d);
                } else {
                    this.makeConnector(d, o);
                }
            } else {
                console.error('ctrl or cmd click to select the elements');
            }
        })
    }
    makeConnector(oid: any, did: any) {
        // Do not create if already exists
        var connectors = this.main.connectors.filter((t: any) => (t.originId === oid && t.destId === did));
        if (connectors.length < 1) {
            var id = Utils.uniqueID();
            var polyline = this.draw.polyline('0,0 100,0');
            polyline.attr({ id: "connector" + id });
            polyline.fill('none');
            polyline.stroke({ color: '#ccc', width: 2, linecap: 'round', linejoin: 'round' });

            // this.drawData.push(polyline.attr());

            var polygon = this.draw.polygon('0,0 0,10 10,5');
            polygon.attr({ id: "arrowright" + id });
            polygon.fill('#333');



            var connGroup = this.draw.group();
            connGroup.attr({ id: 'connectorGroup' + id });
            connGroup.add(polyline);
            connGroup.add(polygon);
            // connGroup.add(conBoundary);

            console.log(connGroup.children())

            this.main.activeElement = connGroup.attr();


            connGroup.on('click', (e: any) => {
                polyline.stroke({ color: '#3DA7F1', width: 2 });
                polygon.fill('#3DA7F1');
                this.main.activeElement = connGroup.attr();
            });

            this.main.connectors.push({ originId: oid, destId: did, lineId: 'connector' + id, arrowId: 'arrowright' + id });

            this.resizeConnector(oid, did, 'connector' + id, 'arrowright' + id);

            this.main.unSelectAll();
        }
    }
    // send the element id which is being dragged
    moveConnector(elId: string) {
        var connectors = this.main.connectors.filter((t: any) => (t.originId === elId || t.destId === elId));
        connectors.forEach((el: any) => {
            this.resizeConnector(el.originId, el.destId, el.lineId, el.arrowId);
        });
    }

    resizeConnector(oid: any, did: any, lid: any, aid: any) {
        // console.log(oid, did, lid, aid);
        // TODO: change the origin and dest based on value of x as above
        var origin_el = SVG('#' + oid);
        var dest_el = SVG('#' + did);
        var line = SVG('#' + lid);
        var arrow = SVG('#' + aid);

        var nx1 = origin_el.bbox().x + origin_el.bbox().w;
        var ny1 = origin_el.bbox().y + (origin_el.bbox().h / 2);
        var nx2 = dest_el.bbox().x;
        var ny2 = dest_el.bbox().y + (dest_el.bbox().h / 2);

        // TODO: Make the line break at middle
        var nmx1 = nx1 + ((nx2 - nx1) / 2);
        var nmy1 = ny1;
        var nmx2 = nx1 + ((nx2 - nx1) / 2);
        var nmy2 = ny2;


        line.attr({ points: nx1 + ',' + ny1 + ' ' + nmx1 + ',' + nmy1 + ' ' + nmx2 + ',' + nmy2 + ' ' + nx2 + ',' + ny2 });
        arrow.move(nx2 - 10, ny2 - 5);

    }
}

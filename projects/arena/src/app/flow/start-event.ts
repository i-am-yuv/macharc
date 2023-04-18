import { SVG } from "@svgdotjs/svg.js";
import { Utils } from "./utils";

export class StartEvent {
    draw: any;
    main: any;
    onArrow: boolean = false;

    constructor(main: any) {
        this.main = main;
        this.draw = main.draw;
    }
    createStartEvent() {
        var _app = this;
        const startEvent = this.draw.circle(30).fill('#91db22').stroke({ color: '#888', width: 1 }).attr({ id: "startEventIcon" }).move(35, 35);

        startEvent.on('mousedown', (e: any) => {

            const se_id = Utils.uniqueID();
            var startEvent1 = startEvent.clone();
            startEvent1.size(50);
            startEvent1.attr({ id: "startEvent" + se_id, name: "Start Event" });
            // startEvent1.addTo(_app.draw);

            var seBoundary1 = SVG().rect(startEvent1.bbox().w + 20, startEvent1.bbox().h + 20)
                .fill('none').stroke({ color: '#3DA7F1', width: 1 })
                .attr({ id: "seBoundary" + se_id, 'stroke-dasharray': '5,5' })
                .move(startEvent1.bbox().x - 10, startEvent1.bbox().y - 10);
            var tc = SVG().circle(8).fill('#3DA7F1').move(seBoundary1.bbox().x + (seBoundary1.bbox().w / 2) - 4, seBoundary1.bbox().y - 4);
            var rc = SVG().circle(8).fill('#3DA7F1').move(seBoundary1.bbox().x2 - 4, seBoundary1.bbox().y2 - (seBoundary1.bbox().h / 2) - 4);
            var bc = SVG().circle(8).fill('#3DA7F1').move(seBoundary1.bbox().x + (seBoundary1.bbox().w / 2) - 4, seBoundary1.bbox().y2 - 4);
            var lc = SVG().circle(8).fill('#3DA7F1').move(seBoundary1.bbox().x - 4, seBoundary1.bbox().y2 - (seBoundary1.bbox().h / 2) - 4);

            var arrow = '0,5 20,5 20,0 30,10 20,20 20,15 0,15 0,5';


            var ta = SVG().polyline(arrow).fill('#3DA7F1').attr({ class: 'arrowHead' }).move(seBoundary1.bbox().x + (seBoundary1.bbox().w / 2) - 15, seBoundary1.bbox().y - 40).transform({ relative: [0, 0], rotate: 270 }).opacity(0.5);
            var ra = SVG().polyline(arrow).fill('#3DA7F1').attr({ class: 'arrowHead' }).move(seBoundary1.bbox().x2 + 15, seBoundary1.bbox().y2 - (seBoundary1.bbox().h / 2) - 10).opacity(0.5);
            var ba = SVG().polyline(arrow).fill('#3DA7F1').attr({ class: 'arrowHead' }).move(seBoundary1.bbox().x + (seBoundary1.bbox().w / 2) - 15, seBoundary1.bbox().y2 + 15).transform({ relative: [0, 0], rotate: 90 }).opacity(0.5);
            var la = SVG().polyline(arrow).fill('#3DA7F1').attr({ class: 'arrowHead' }).move(seBoundary1.bbox().x - 45, seBoundary1.bbox().y2 - (seBoundary1.bbox().h / 2) - 10).transform({ relative: [0, 0], rotate: 180 }).opacity(0.5);

            var seBoundaryGroup = SVG().group();
            seBoundaryGroup.add(seBoundary1);
            seBoundaryGroup.add(tc);
            seBoundaryGroup.add(rc);
            seBoundaryGroup.add(bc);
            seBoundaryGroup.add(lc);
            seBoundaryGroup.add(ta);
            seBoundaryGroup.add(ra);
            seBoundaryGroup.add(ba);
            seBoundaryGroup.add(la);

            seBoundaryGroup.attr({ class: 'boundary' });


            var segroup = SVG().group();
            segroup.attr({ id: 'segroup' + se_id, class: 'draggable' });
            segroup.add(startEvent1);
            segroup.add(seBoundaryGroup);

            segroup.draggable();

            segroup.addTo(this.draw);
            segroup.move(150, 100);
            // seBoundaryGroup.addTo(this.draw);



            this.main.activeElement = segroup.attr();
            // Compensate for mouse position
            this.draw.on('mousemove', (e: any) => {
                // segroup.move(e.offsetX - 25, e.offsetY - 25);
            });
            segroup.on('click', (e: any) => {
                this.main.activeElement = segroup.attr();
                if (e.shiftKey || e.ctrlKey || e.metaKey) {
                    this.main.selectElement(seBoundaryGroup);
                    this.main.selectedElements.push(startEvent1.attr('id'));
                } else {
                    this.main.makeActive(seBoundaryGroup);
                }
            });
            segroup.on('dragend', e => {
                if (this.onArrow) {
                    this.createLink(startEvent1, e);
                }

            })
            segroup.on('dragmove', e => {
                // console.log(e.detail.event.clientX, e.detail.event.clientY);
                // seBoundaryGroup.opacity(0);
                if (this.onArrow) {
                    e.preventDefault();


                }
                this.main.moveConnector(startEvent1.attr('id'));
            });

            ta.on('mousedown', (e: any) => {
                this.onArrow = true;
                console.log('ta on');
            })




        });
    }
    createLink(orig: any, dest: any) {
        var origx = orig.bbox().x + (orig.bbox().width / 2);
        var origy = orig.bbox().y;
        var destx = dest.detail.event.clientX;
        var desty = dest.detail.event.clientY;
        console.log('' + origx + ',' + origy + ' ' + destx + ',' + desty + '');
        var polyline = SVG().polyline('' + origx + ',' + origy + ' ' + origx + ',' + desty + ' ' + destx + ',' + desty + '');
        polyline.fill('none');
        polyline.stroke({ color: '#333', width: 2, linecap: 'round', linejoin: 'round' });

        var polygon = SVG().polygon('0,0 0,10 10,5');
        polygon.attr({ id: "arrowright" });
        polygon.fill('#333').move(destx, desty - 5);
        if (origx > destx) {
            polygon.rotate(180);
        }

        var connectorGroup = SVG().group();

        connectorGroup.add(polyline);
        connectorGroup.add(polygon);
        connectorGroup.addTo(this.draw);

        this.onArrow = false;
    }
}

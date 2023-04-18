import { Utils } from "./utils";

export class EndEvent {
    draw: any;
    main: any;

    constructor(main: any) {
        this.main = main;
        this.draw = main.draw;
    }
    createEndEvent() {
        const endEvent = this.draw.circle(30).fill('#EF7DB1').attr({ id: "endEventIcon" }).move(35, 135);
        var ee_id = Utils.uniqueID();
        endEvent.on('mousedown', (e: any) => {
            var endEvent1 = endEvent.clone();
            endEvent1.size(50);
            endEvent1.attr({ id: "endEvent" + ee_id, name: 'End Event' });
            // endEvent1.addTo(_app.draw);

            var eeBoundary1 = this.draw.rect(endEvent1.bbox().w + 10, endEvent1.bbox().h + 10)
                .fill('none').stroke({ color: '#3DA7F1', width: 1 })
                .attr({ id: "eeBoundary" + ee_id, 'stroke-dasharray': '5,5', class: 'boundary' })
                .move(endEvent1.bbox().x - 5, endEvent1.bbox().y - 5);
            this.main.makeActive(eeBoundary1);


            var eegroup = this.draw.group();
            eegroup.attr({ id: 'eegroup' + ee_id });
            eegroup.add(endEvent1);
            eegroup.add(eeBoundary1);

            eegroup.draggable();

            this.main.activeElement = eegroup.attr();
            this.draw.on('mousemove', (e: any) => {
                eegroup.move(e.offsetX - 25, e.offsetY - 25);
            });
            eegroup.on('click', (e: any) => {
                this.main.activeElement = eegroup.attr();
                if (e.shiftKey || e.ctrlKey || e.metaKey) {
                    this.main.selectElement(eeBoundary1);
                    this.main.selectedElements.push(endEvent1.attr('id'));
                } else {
                    this.main.makeActive(eeBoundary1);
                }
            });
            eegroup.on('dragmove', (e: any) => {
                this.main.moveConnector(endEvent1.attr('id'));
            });
        });
    }
}

import { SVG } from "@svgdotjs/svg.js";
import { Utils } from "./utils";

export class Task {
    draw: any;
    main: any;
    constructor(main: any) {
        this.main = main;
        this.draw = main.draw;
    }
    createTask() {
        var _app = this;
        const rect = this.draw.rect(30, 25).fill('#f2f2f2').radius(5).stroke({ color: '#888', width: 1 }).attr({ id: "rectIcon" }).move(35, 85);
        rect.on('mousedown', (e: any) => {
            const re_id = Utils.uniqueID();
            var rect1 = rect.clone();
            rect1.attr({ id: "task" + re_id, name: "Task" });
            rect1.size(100, 80);
            rect1.addTo(_app.draw);


            var reBoundary1 = this.draw.rect(rect1.bbox().w + 20, rect1.bbox().h + 20)
                .fill('none').stroke({ color: '#3DA7F1', width: 1 })
                .attr({ id: "reBoundary" + re_id, 'stroke-dasharray': '5,5', class: 'boundary' })
                .move(rect1.bbox().x - 10, rect1.bbox().y - 10);

            this.main.makeActive(reBoundary1);

            var regroup = this.draw.group();
            regroup.attr({ id: 'regroup' + re_id });
            regroup.add(rect1);
            regroup.add(reBoundary1);

            regroup.draggable();



            this.main.activeElement = regroup.attr();
            this.draw.on('mousemove', (e: any) => {
                regroup.move(e.offsetX - 40, e.offsetY - 40);
            });
            regroup.on('click', (e: any) => {
                this.main.activeElement = regroup.attr();
                if (e.shiftKey || e.ctrlKey || e.metaKey) {
                    this.main.selectElement(reBoundary1);
                    this.main.selectedElements.push(rect1.attr('id'));
                } else {
                    this.main.makeActive(reBoundary1);
                }

            });

            regroup.on('dragmove', (e: any) => {
                this.main.moveConnector(rect1.attr('id'));
            });
        });



    }


}

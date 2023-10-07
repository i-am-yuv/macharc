import { Utils } from './utils';

export class SwimLane {

    draw: any;
    main: any;
    constructor(main: any) {
        this.main = main;
        this.draw = main.draw;
    }

    createSwimLane() {
        var _app = this;

        const rect1 = this.draw.rect(10, 25).fill('#f2f2f2')
            .stroke({ color: '#888', width: 1 })
            .attr({ id: "rectIcon" })
            .move(35, 185);
        const rect2 = this.draw.rect(20, 25).fill('#f2f2f2')
            .stroke({ color: '#888', width: 1 })
            .attr({ id: "rectIcon" })
            .move(45, 185);
        const swmlane = this.draw.group();
        swmlane.add(rect1);
        swmlane.add(rect2);

        swmlane.on('mousedown', (e: any) => {
            const sl_id = Utils.uniqueID();
            const rectn1 = this.draw.rect(50, 250).fill('#fff')
                .stroke({ color: '#888', width: 1 })
                .attr({ id: "slRightBox" + sl_id })
                .move(35, 185);
            const rectn2 = this.draw.rect(700, 250).fill('#fff')
                .stroke({ color: '#888', width: 1 })
                .attr({ id: "slLeftBox" + sl_id })
                .move(85, 185);

            const sl = this.draw.group();
            sl.add(rectn1);
            sl.add(rectn2);

            var slBoundary1 = this.draw.rect(sl.bbox().w + 20, sl.bbox().h + 20)
                .fill('none').stroke({ color: '#3DA7F1', width: 1 })
                .attr({ id: "reBoundary" + sl_id, 'stroke-dasharray': '5,5', class: 'boundary' })
                .move(sl.bbox().x - 10, sl.bbox().y - 10);
            this.main.makeActive(slBoundary1);


            var slgroup = this.draw.group();
            slgroup.attr({ id: 'swimlanegroup' + sl_id, name: 'Swim Lane' });
            // slgroup.add(sl);
            slgroup.add(rectn1);
            slgroup.add(rectn2);
            slgroup.add(slBoundary1);

            slgroup.draggable();

            this.draw.on('mousemove', (e: any) => {
                slgroup.move(e.offsetX - 40, e.offsetY - 40);
            });
            // console.log(slgroup.children())
            this.main.activeElement = slgroup.attr();

            slgroup.on('click', (e: any) => {
                this.main.activeElement = slgroup.attr();
                if (e.shiftKey || e.ctrlKey || e.metaKey) {
                    // Select element
                    this.main.selectElement(slBoundary1);

                } else {
                    this.main.makeActive(slBoundary1);
                }
            });
        });
    }

}
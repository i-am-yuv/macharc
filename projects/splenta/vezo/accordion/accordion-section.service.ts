import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

@Injectable({
    providedIn: 'root',
})
export class AccordionSectionService {

    isAccordionSectionVisible: boolean = false;

    AccordionSectionVisibilityChange: Subject<boolean> = new Subject<boolean>();

    constructor() {
        this.AccordionSectionVisibilityChange.subscribe((value) => {
            this.isAccordionSectionVisible = value
        });
    }

    toggleAccordionSectionVisibility() {
        this.AccordionSectionVisibilityChange.next(!this.isAccordionSectionVisible);
    }

    hideAllAccordionSections() {
        this.AccordionSectionVisibilityChange.next(false);
    }
}
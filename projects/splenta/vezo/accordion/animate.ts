import {
    animate,
    query,
    sequence,
    stagger,
    style,
    transition,
    trigger
} from "@angular/animations";

export const AccordionSectionAnimation = trigger("accordionSection", [
    transition(":enter", [
        style({ height: 0, overflow: "hidden" }),
        query(".accordion-section", [
            style({ opacity: 0, transform: "translateY(-50px)" })
        ]),
        sequence([
            animate("200ms", style({ height: "*" })),
            query(".accordion-section", [
                stagger(-50, [
                    animate("400ms ease", style({ opacity: 1, transform: "none" }))
                ])
            ])
        ])
    ]),

    transition(":leave", [
        style({ height: "*", overflow: "hidden" }),
        query(".accordion-section", [style({ opacity: 1, transform: "none" })]),
        sequence([
            query(".accordion-section", [
                stagger(50, [
                    animate(
                        "400ms ease",
                        style({ opacity: 0, transform: "translateY(-50px)" })
                    )
                ])
            ]),
            animate("200ms", style({ height: 0 }))
        ])
    ])
]);

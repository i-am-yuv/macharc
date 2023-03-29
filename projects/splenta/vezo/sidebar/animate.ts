import {
    animate,
    animateChild,
    query,
    state,
    style,
    transition,
    trigger
} from "@angular/animations";

export const SideBarAnimationEnterLeave = trigger("insertRemoveTrigger", [
    transition(':enter', [
        style({ opacity: 0 }),
        animate('100ms', style({ opacity: 1 })),
        query('@flyInOut', [
            animateChild()
        ])
    ]),
    transition(':leave', [
        query('@flyInOut', [
            animateChild()
        ]),
        animate('100ms', style({ opacity: 0 })),
    ])
]);
export const SideBarAnimationInOut = trigger('flyInOut', [
    state('in', style({ transform: 'translateX(0)' })),
    transition('void => *', [
        style({ transform: 'translateX(-100%)' }),
        animate(100)
    ]),
    transition('* => void', [
        animate(100, style({ transform: 'translateX(-100%)' }))
    ])
]);
import { Directive, Input, ElementRef, OnInit, OnDestroy, NgZone } from '@angular/core';
import { DataTable, KeyboardAction } from '../base';

@Directive({
    selector: '[appBodyKeydown]'
})
export class BodyKeydownDirective implements OnInit, OnDestroy {

    @Input() public table: DataTable;

    element: HTMLElement;
    private keyboardAction: KeyboardAction;

    constructor(element: ElementRef, private ngZone: NgZone) {
        this.element = element.nativeElement;
    }

    ngOnInit(): void {
        this.keyboardAction = new KeyboardAction(this.table);
        this.ngZone.runOutsideAngular(() => {
            this.element.addEventListener('keydown', this.onKeydown.bind(this));
        });
    }

    ngOnDestroy(): void {
        this.element.removeEventListener('keydown', this.onKeydown.bind(this));
    }

    onKeydown(event: any): void {
        let target = event.target;
        if (target === null) { return; }
        while (target !== this.element) {
            if (target.classList.contains('datatable-body-cell')) {
                break;
            }
            target = target.parentNode;
        }
        if (target === this.element) {
            return;
        }

        this.ngZone.run(() => {
            this.keyboardAction.handleEvent(event, target);
        });
    }

}

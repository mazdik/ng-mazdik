import { Directive, Input, ElementRef, OnInit, OnDestroy, NgZone } from '@angular/core';
import { DataTable, EventHelper } from '../base';

@Directive({
    selector: '[appBodyMouseover]'
})
export class BodyMouseoverDirective implements OnInit, OnDestroy {

    @Input() table: DataTable;

    element: HTMLElement;
    currentElem: any;

    constructor(element: ElementRef, private ngZone: NgZone) {
        this.element = element.nativeElement;
    }

    ngOnInit(): void {
        if (this.table.settings.hoverEvents) {
            this.ngZone.runOutsideAngular(() => {
                this.element.addEventListener('mouseover', this.onMouseover.bind(this));
                this.element.addEventListener('mouseout', this.onMouseout.bind(this));
            });
        }
    }

    ngOnDestroy(): void {
        this.element.removeEventListener('mouseover', this.onMouseover.bind(this));
        this.element.removeEventListener('mouseout', this.onMouseout.bind(this));
    }

    onMouseover(event: any): void {
        if (this.currentElem) {
            return;
        }
        const target = EventHelper.findCellEventTarget(event, this.element);
        if (!target) { return; }
        this.currentElem = target;

        const cellEventArgs = EventHelper.findCellEvent(event, this.element);
        if (cellEventArgs) {
            this.table.events.onMouseover(cellEventArgs);
        }
    }

    onMouseout(event: any): void {
        if (!this.currentElem) {
            return;
        }
        let relatedTarget = event.relatedTarget;
        if (relatedTarget) {
            while (relatedTarget) {
                if (relatedTarget === this.currentElem) {
                    return;
                }
                relatedTarget = relatedTarget.parentNode;
            }
        }
        this.currentElem = null;
        this.table.events.onMouseout(true);
    }

}

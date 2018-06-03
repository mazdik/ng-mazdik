import { Directive, Input, ElementRef, OnInit, OnDestroy, NgZone } from '@angular/core';
import { DataTable } from '../base/data-table';
import { Row, HoverEventArgs } from '../types';
import { isBlank } from '../base/util';

@Directive({
    selector: '[appBodyMouseover]'
})
export class BodyMouseoverDirective implements OnInit, OnDestroy {

    @Input() public table: DataTable;

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
        let target = event.target;
        while (target !== this.element) {
            if (target.closest('.datatable-body-cell')) {
                break;
            }
            target = target.parentNode;
        }
        if (target === this.element) {
            return;
        }
        this.currentElem = target;

        const columnIndex = target.dataset.columnIndex;
        const rowIndex = target.dataset.rowIndex;
        if (!isBlank(columnIndex) && !isBlank(rowIndex)) {
            const ev = <HoverEventArgs>{
                columnName: this.table.columns[columnIndex].name,
                row: this.table.rows[rowIndex],
                event: event
            };
            this.table.events.onMouseover(ev);
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

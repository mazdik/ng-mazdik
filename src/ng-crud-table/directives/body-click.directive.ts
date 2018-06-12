import { Directive, Input, ElementRef, OnInit, OnDestroy, NgZone } from '@angular/core';
import { DataTable } from '../base';
import { CellEventArgs } from '../types';
import { isBlank } from '../base/util';

@Directive({
    selector: '[appBodyClick]'
})
export class BodyClickDirective implements OnInit, OnDestroy {

    @Input() public table: DataTable;

    element: HTMLElement;

    constructor(element: ElementRef, private ngZone: NgZone) {
        this.element = element.nativeElement;
    }

    ngOnInit(): void {
        const editable = this.table.columns.some(x => x.editable);
        if (editable) {
            this.ngZone.runOutsideAngular(() => {
                this.element.addEventListener('dblclick', this.onClick.bind(this));
            });
        }
    }

    ngOnDestroy(): void {
        this.element.removeEventListener('dblclick', this.onClick.bind(this));
    }

    onClick(event: any): void {
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
        event.preventDefault();
        event.stopPropagation();

        let columnIndex = target.dataset.columnIndex;
        let rowIndex = target.dataset.rowIndex;
        if (!isBlank(columnIndex) && !isBlank(rowIndex)) {
            columnIndex = parseInt(columnIndex, 10);
            rowIndex = parseInt(rowIndex, 10);

            const ev = <CellEventArgs>{ columnIndex, rowIndex, event };
            this.ngZone.run(() => {
                this.table.events.onClickCell(ev);
            });
        }
    }

}

import { Directive, Input, ElementRef, OnInit, OnDestroy, NgZone } from '@angular/core';
import { DataTable, EventHelper } from '../base';

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
                this.element.addEventListener('dblclick', this.onDblclick.bind(this));
            });
        }
        this.ngZone.runOutsideAngular(() => {
            this.element.addEventListener('click', this.onClick.bind(this));
        });
    }

    ngOnDestroy(): void {
        this.element.removeEventListener('dblclick', this.onDblclick.bind(this));
        this.element.removeEventListener('click', this.onClick.bind(this));
    }

    onDblclick(event: any): void {
        const cellEventArgs = EventHelper.findCellEvent(event, this.element);
        if (cellEventArgs) {
            event.preventDefault();
            event.stopPropagation();
            this.ngZone.run(() => {
                this.table.events.onClickCell(cellEventArgs);
            });
        }
    }

    onClick(event: any): void {
        const cellEventArgs = EventHelper.findCellEvent(event, this.element);
        if (cellEventArgs) {
            event.preventDefault();
            event.stopPropagation();
            this.ngZone.run(() => {
                this.table.selectRow(cellEventArgs.rowIndex);
            });
        }
    }

}

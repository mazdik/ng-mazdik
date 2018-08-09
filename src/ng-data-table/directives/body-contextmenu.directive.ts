import { Directive, Input, ElementRef, OnInit, OnDestroy, NgZone } from '@angular/core';
import { DataTable, EventHelper } from '../base';

@Directive({
    selector: '[appBodyContextMenu]'
})
export class BodyContextMenuDirective implements OnInit, OnDestroy {

    @Input() table: DataTable;

    element: HTMLElement;

    constructor(element: ElementRef, private ngZone: NgZone) {
        this.element = element.nativeElement;
    }

    ngOnInit(): void {
        if (this.table.settings.contextMenu) {
            this.ngZone.runOutsideAngular(() => {
                this.element.addEventListener('contextmenu', this.onContextMenu.bind(this));
            });
        }
    }

    ngOnDestroy(): void {
        this.element.removeEventListener('contextmenu', this.onContextMenu.bind(this));
    }

    onContextMenu(event: any): void {
        const cellEventArgs = EventHelper.findCellEvent(event, this.element);
        if (cellEventArgs) {
            this.ngZone.run(() => {
                this.table.events.onContextMenu(cellEventArgs);
            });
        }
    }

}

import { Directive, Input, ElementRef, OnInit, OnDestroy, NgZone } from '@angular/core';
import { DataTable, EventHelper } from '../base';

@Directive({
  selector: '[appBodyContextMenu]'
})
export class BodyContextMenuDirective implements OnInit, OnDestroy {

  @Input() table: DataTable;

  element: HTMLElement;
  private contextMenuListener: any;

  constructor(element: ElementRef, private ngZone: NgZone) {
    this.element = element.nativeElement;
  }

  ngOnInit(): void {
    if (this.table.settings.contextMenu) {
      this.ngZone.runOutsideAngular(() => {
        this.contextMenuListener = this.onContextMenu.bind(this);
        this.element.addEventListener('contextmenu', this.contextMenuListener);
      });
    }
  }

  ngOnDestroy(): void {
    this.element.removeEventListener('contextmenu', this.contextMenuListener);
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

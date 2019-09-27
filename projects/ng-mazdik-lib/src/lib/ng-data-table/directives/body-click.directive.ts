import { Directive, Input, ElementRef, OnInit, OnDestroy, NgZone } from '@angular/core';
import { DataTable, EventHelper } from '../base';

@Directive({
  selector: '[appBodyClick]'
})
export class BodyClickDirective implements OnInit, OnDestroy {

  @Input() table: DataTable;

  element: HTMLElement;
  private clickListener: any;

  constructor(element: ElementRef, private ngZone: NgZone) {
    this.element = element.nativeElement;
  }

  ngOnInit(): void {
    this.ngZone.runOutsideAngular(() => {
      this.clickListener = this.onClick.bind(this);
      this.element.addEventListener('click', this.clickListener);
    });
  }

  ngOnDestroy(): void {
    this.element.removeEventListener('click', this.clickListener);
  }

  onClick(event: any): void {
    const cellEventArgs = EventHelper.findCellEvent(event, this.element);
    if (cellEventArgs) {
      this.ngZone.run(() => {
        this.table.events.onClickCell(cellEventArgs);
        if (!this.table.settings.selectionMode) {
          this.table.selectRow(cellEventArgs.rowIndex);
        }
      });
    }
  }

}

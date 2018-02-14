import {Component, Input, Output, EventEmitter, HostBinding, OnInit, ChangeDetectionStrategy} from '@angular/core';
import {DataTable} from '../base/data-table';

@Component({
  selector: 'app-datatable-body',
  templateUrl: './body.component.html',
  // changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BodyComponent implements OnInit {

  @Input() public table: DataTable;
  @Input() public offsetX: number;
  @Input() public loading: boolean;

  @Output() scroll: EventEmitter<any> = new EventEmitter();

  @HostBinding('class') cssClass = 'datatable-body';

  offsetY: number = 0;
  rowTrackingFn: any;

  constructor() {
    // declare fn here so we can get access to the `this` property
    this.rowTrackingFn = function (index: number, row: any): any {
      if (this.table.settings.trackByProp) {
        return `${index}-${this.table.settings.trackByProp}`;
      } else {
        return index;
      }
    }.bind(this);
  }

  @HostBinding('style.height')
  get bodyHeight() {
    if (this.table.scrollHeight) {
      return this.table.scrollHeight + 'px';
    } else {
      return 'auto';
    }
  }

  ngOnInit(): void {
  }

  onBodyScroll(event: any): void {
    const scrollYPos: number = event.scrollYPos;
    const scrollXPos: number = event.scrollXPos;

    if (this.offsetY !== scrollYPos || this.offsetX !== scrollXPos) {
      this.scroll.emit({
        offsetY: scrollYPos,
        offsetX: scrollXPos
      });
    }
    this.offsetY = scrollYPos;
    this.offsetX = scrollXPos;
  }

}

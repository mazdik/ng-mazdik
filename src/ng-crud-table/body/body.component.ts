import {
  Component, Input, Output, EventEmitter, HostBinding, OnInit, ChangeDetectionStrategy
} from '@angular/core';
import {MenuItem} from '../types';
import {DataTable} from '../models/data-table';

@Component({
  selector: 'datatable-body',
  templateUrl: './body.component.html',
  host: {
    class: 'datatable-body'
  },
  //changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BodyComponent implements OnInit {

  @Input() public table: DataTable;
  @Input() public actionMenu: MenuItem[];
  @Input() public offsetX: number;
  @Input() public selectedRowIndex: number;
  @Input() public trackByProp: string;
  @Input() public loading: boolean = false;

  @Input()
  set rows(val: any) {
    this._rows = val;
  }

  get rows(): any {
    return this._rows;
  }

  @Output() editComplete: EventEmitter<any> = new EventEmitter();
  @Output() scroll: EventEmitter<any> = new EventEmitter();
  @Output() selectedRowIndexChange: EventEmitter<number> = new EventEmitter();

  offsetY: number = 0;
  rowTrackingFn: any;
  _rows: any[];

  constructor() {
    // declare fn here so we can get access to the `this` property
    this.rowTrackingFn = function (index: number, row: any): any {
      if (this.trackByProp) {
        return `${index}-${this.trackByProp}`;
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

    // if scroll change, trigger update
    // this is mainly used for header cell positions
    if (this.offsetY !== scrollYPos || this.offsetX !== scrollXPos) {
      this.scroll.emit({
        offsetY: scrollYPos,
        offsetX: scrollXPos
      });
    }

    this.offsetY = scrollYPos;
    this.offsetX = scrollXPos;

  }

  onEditComplete(event) {
    this.editComplete.emit(event);
  }

}

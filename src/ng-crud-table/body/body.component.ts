import {
  Component, Input, Output, EventEmitter, HostBinding, OnInit,
  ChangeDetectionStrategy, DoCheck, KeyValueDiffers, KeyValueDiffer, ChangeDetectorRef
} from '@angular/core';
import {Column, MenuItem} from '../types/interfaces';
import {ColumnUtils} from '../utils/column-utils';

@Component({
  selector: 'datatable-body',
  templateUrl: './body.component.html',
  host: {
    class: 'datatable-body'
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BodyComponent implements OnInit, DoCheck {

  @Input() public columns: Column[];
  @Input() public actionColumnWidth: number;
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

  @Input()
  @HostBinding('style.height')
  set bodyHeight(val) {
    if (val) {
      this._bodyHeight = val + 'px';
    } else {
      this._bodyHeight = 'auto';
    }
  }

  get bodyHeight() {
    return this._bodyHeight;
  }

  @Output() editComplete: EventEmitter<any> = new EventEmitter();
  @Output() scroll: EventEmitter<any> = new EventEmitter();
  @Output() selectedRowIndexChange: EventEmitter<number> = new EventEmitter();

  private rowDiffer: KeyValueDiffer<{}, {}>;
  offsetY: number = 0;
  rowTrackingFn: any;
  _rows: any[];
  _bodyHeight: any;
  columnsTotalWidth: number;

  constructor(private differs: KeyValueDiffers, private cd: ChangeDetectorRef) {
    this.rowDiffer = this.differs.find({}).create();
    // declare fn here so we can get access to the `this` property
    this.rowTrackingFn = function (index: number, row: any): any {
      if (this.trackByProp) {
        return row[this.trackByProp];
      } else {
        return index;
      }
    }.bind(this);
  }

  ngOnInit(): void {
    this.columnsTotalWidth = ColumnUtils.getColumnsTotalWidth(this.columns) + this.actionColumnWidth;
  }

  ngDoCheck(): void {
    if (this.rowDiffer.diff(this.rows)) {
      this.cd.markForCheck();
    }
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

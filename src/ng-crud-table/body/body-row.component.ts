import {
  Component, OnInit, Input, Output, EventEmitter, HostBinding, HostListener,
  ChangeDetectionStrategy, DoCheck, KeyValueDiffers, KeyValueDiffer, ChangeDetectorRef
} from '@angular/core';
import {MenuItem} from '../types';
import {DataTable} from '../models/data-table';

@Component({
  selector: 'datatable-body-row',
  templateUrl: './body-row.component.html',
  //changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BodyRowComponent implements OnInit, DoCheck {

  @Input() public table: DataTable;
  @Input() public row: any;
  @Input() public actionMenu: MenuItem[];
  @Input() public offsetX: number;
  @Input() public selectedRowIndex: number;
  @Input() public rowIndex: number;

  @Output() selectedRowIndexChange: EventEmitter<number> = new EventEmitter();
  @Output() editComplete: EventEmitter<any> = new EventEmitter();

  public enableAction: boolean = false;
  private rowDiffer: KeyValueDiffer<{}, {}>;

  @HostBinding('class')
  get cssClass() {
    let cls = 'datatable-body-row';
    if (this.rowIndex === this.selectedRowIndex) {
      cls += ' row-selected';
    }
    return cls;
  }

  constructor(private differs: KeyValueDiffers, private cd: ChangeDetectorRef) {
    this.rowDiffer = this.differs.find({}).create();
  }

  ngOnInit() {
    if (this.actionMenu) {
      this.enableAction = true;
    }
  }

  ngDoCheck(): void {
    if (this.rowDiffer.diff(this.row)) {
      this.cd.markForCheck();
    }
  }

  @HostListener('click', ['$event'])
  onClick(event: MouseEvent): void {
    this.rowClick(this.rowIndex);
  }

  rowClick(rowIndex: number) {
    this.selectedRowIndex = rowIndex;
    this.selectedRowIndexChange.emit(this.selectedRowIndex);
  }

  actionClick(event, item: MenuItem, rowIndex: number) {
    this.selectedRowIndex = rowIndex;
    this.selectedRowIndexChange.emit(this.selectedRowIndex);

    if (!item.url) {
      event.preventDefault();
    }

    if (item.command) {
      if (!item.eventEmitter) {
        item.eventEmitter = new EventEmitter();
        item.eventEmitter.subscribe(item.command);
      }

      item.eventEmitter.emit({
        originalEvent: event,
        item: item
      });
    }
  }

  stylesByGroup() {
    const styles: any = {};
    styles.left = `${this.offsetX}px`;
    return styles;
  }

  columnTrackingFn(index: number, column: any): any {
    return column.name;
  }

  onCellEditComplete(event) {
    this.editComplete.emit(event);
  }

}

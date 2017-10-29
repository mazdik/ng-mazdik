import {Component, OnInit, Input, Output, EventEmitter, ChangeDetectionStrategy} from '@angular/core';
import {Column, MenuItem} from '../types/interfaces';

@Component({
  selector: 'datatable-body-row',
  templateUrl: './body-row.component.html',
})
export class BodyRowComponent implements OnInit {

  @Input() public columns: Column[];
  @Input() public row: any;
  @Input() public actionColumnWidth: number;
  @Input() public actionMenu: MenuItem[];
  @Input() public offsetX: number;
  @Input() public selectedRowIndex: number;
  @Input() public rowIndex: number;

  @Output() selectedRowIndexChange: EventEmitter<number> = new EventEmitter();
  @Output() editComplete: EventEmitter<any> = new EventEmitter();

  public frozenColumns: Column[] = [];
  public scrollableColumns: Column[] = [];
  public enableAction: boolean = false;

  constructor() {
  }

  ngOnInit() {
    if (this.actionMenu) {
      this.enableAction = true;
    }
    if (this.columns) {
      this.columns.forEach((column) => {
        if (column.frozen) {
          this.frozenColumns.push(column);
        } else {
          this.scrollableColumns.push(column);
        }
      });
    }
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

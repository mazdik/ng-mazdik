import {
  Component, Input, HostBinding, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef,
  ViewChild, ViewContainerRef
} from '@angular/core';
import {DataTable, Row} from '../../base';
import {Subscription} from 'rxjs';

@Component({
  selector: 'dt-body-cell-action',
  templateUrl: 'body-cell-action.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BodyCellActionComponent implements OnInit, OnDestroy {

  @Input() table: DataTable;

  @Input()
  set row(row: Row) {
    this._row = row;
    this.cellContext.row = row;
  }

  get row(): Row {
    return this._row;
  }

  @HostBinding('class') cssClass = 'datatable-body-cell action-cell';
  @HostBinding('attr.role') role = 'gridcell';

  @HostBinding('style.width.px')
  get width(): number {
    return this.table.dimensions.actionColumnWidth;
  }

  @ViewChild('rowActionTemplate', {read: ViewContainerRef}) rowActionTemplate: ViewContainerRef;

  checked: boolean;
  cellContext: any = {row: this.row};
  private _row: Row;
  private subscriptions: Subscription[] = [];

  constructor(private cd: ChangeDetectorRef) {
  }

  ngOnInit() {
    const subSelection = this.table.events.selectionSource$.subscribe(() => {
      this.checked = this.table.selection.isRowSelected(this.row.$$index);
      this.cd.markForCheck();
    });
    this.subscriptions.push(subSelection);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
    if (this.rowActionTemplate) {
      this.rowActionTemplate.clear();
    }
  }

  onCheckboxClick(event) {
    this.table.selection.toggle(this.row.$$index);
    this.table.events.onCheckbox(this.row);
  }

}

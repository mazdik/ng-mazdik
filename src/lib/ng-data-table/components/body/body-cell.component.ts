import {
  Component, Input, HostBinding, ViewContainerRef, ViewChild, OnInit, OnDestroy, ElementRef,
  ChangeDetectionStrategy, ChangeDetectorRef
} from '@angular/core';
import {DataTable, Cell, CellEventArgs} from '../../base';
import {Subscription} from 'rxjs';

@Component({
  selector: 'dt-body-cell',
  templateUrl: 'body-cell.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BodyCellComponent implements OnInit, OnDestroy {

  @Input() table: DataTable;

  @Input()
  get cell(): Cell { return this._cell; }
  set cell(val: Cell) {
    this._cell = val;
    this.updateValue();
  }
  private _cell: Cell;

  @HostBinding('class.datatable-body-cell') cssClass = true;
  @HostBinding('class.cell-editing') get cssEditing(): boolean {
    return this.editing;
  }
  @HostBinding('class.cell-changed') get cssChanged(): boolean {
    return this.cell.isChanged;
  }
  @HostBinding('class.cell-error') get cssError(): boolean {
    return this.cell.hasError;
  }

  @HostBinding('attr.role') role = 'gridcell';

  @HostBinding('style.width.px')
  get width(): number {
    return this.cell.column.width;
  }

  @HostBinding('attr.data-column-index')
  get attrColumnIndex(): number {
    return this.cell.column.index;
  }

  @HostBinding('attr.data-row-index')
  get attrRowIndex(): number {
    return this.cell.rowIndex;
  }

  @ViewChild('cellTemplate', {read: ViewContainerRef}) cellTemplate: ViewContainerRef;

  editing: boolean;
  subscriptions: Subscription[] = [];

  constructor(public cd: ChangeDetectorRef, public element: ElementRef) {}

  ngOnInit(): void {
    const subRows = this.table.events.rowsChanged$.subscribe(() => {
      this.updateValue();
    });
    const subActivateCell = this.table.events.activateCellSource$.subscribe((ev: CellEventArgs) => {
      if (this.cell.exist(ev.rowIndex, ev.columnIndex)) {
        this.element.nativeElement.focus();
      }
    });
    this.subscriptions.push(subRows);
    this.subscriptions.push(subActivateCell);
  }

  ngOnDestroy(): void {
    if (this.cellTemplate) {
      this.cellTemplate.clear();
    }
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  updateValue(): void {
    this.cell.updateViewValue();
    this.cell.validate();
    this.cd.markForCheck();
  }

}

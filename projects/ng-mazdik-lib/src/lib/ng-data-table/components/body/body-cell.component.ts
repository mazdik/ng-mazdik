import {
  Component, Input, HostBinding, OnInit, OnDestroy, ElementRef,
  ChangeDetectionStrategy, ChangeDetectorRef
} from '@angular/core';
import {DataTable, Cell, CellEventArgs, CellEventType} from '../../base';
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

  @HostBinding('class.dt-sticky') get cssSticky() {
    return this.cell.column.frozen;
  }
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

  @HostBinding('style.left.px')
  get left() {
    return (this.cell.column.frozen) ? this.cell.column.left : null;
  }

  @HostBinding('attr.data-column-index')
  get attrColumnIndex(): number {
    return this.cell.column.index;
  }

  @HostBinding('attr.data-row-index')
  get attrRowIndex(): number {
    return this.cell.rowIndex;
  }

  editing: boolean;
  subscriptions: Subscription[] = [];

  constructor(protected cd: ChangeDetectorRef, protected element: ElementRef) {}

  ngOnInit(): void {
    const subRows = this.table.events.rowsChanged$.subscribe(() => {
      this.updateValue();
    });
    const subCell = this.table.events.cellSource$.subscribe((ev: CellEventArgs) => {
      if (this.cell.exist(ev.rowIndex, ev.columnIndex) && ev.type === CellEventType.Activate) {
        this.element.nativeElement.focus();
      }
    });
    const subSelection = this.table.events.selectionSource$.subscribe(() => {
      this.cd.markForCheck();
    });
    this.subscriptions.push(subRows);
    this.subscriptions.push(subCell);
    this.subscriptions.push(subSelection);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  updateValue(): void {
    this.cell.updateViewValue();
    this.cell.validate();
    this.cd.markForCheck();
  }

}

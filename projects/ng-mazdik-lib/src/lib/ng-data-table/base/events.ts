import { Subject, BehaviorSubject } from 'rxjs';
import { ColumnMenuEventArgs, CellEventArgs, CellEventType } from './types';

export class Events {

  readonly selectionSource = new Subject();
  private readonly sortSource = new Subject();
  private readonly filterSource = new Subject();
  private readonly pageSource = new Subject();
  private readonly columnMenuSource = new Subject<ColumnMenuEventArgs>();
  private readonly resizeBeginSource = new Subject();
  private readonly resizeSource = new Subject<any>();
  private readonly resizeEndSource = new Subject();
  private readonly rowsChanged = new Subject();
  private readonly scrollSource = new Subject<any>();
  private readonly loadingSource = new BehaviorSubject<boolean>(false);
  private readonly checkboxSource = new Subject<any>();
  private readonly cellSource = new Subject<CellEventArgs>();

  readonly sortSource$ = this.sortSource.asObservable();
  readonly filterSource$ = this.filterSource.asObservable();
  readonly selectionSource$ = this.selectionSource.asObservable();
  readonly pageSource$ = this.pageSource.asObservable();
  readonly columnMenuSource$ = this.columnMenuSource.asObservable();
  readonly resizeBeginSource$ = this.resizeBeginSource.asObservable();
  readonly resizeSource$ = this.resizeSource.asObservable();
  readonly resizeEndSource$ = this.resizeEndSource.asObservable();
  readonly rowsChanged$ = this.rowsChanged.asObservable();
  readonly scrollSource$ = this.scrollSource.asObservable();
  readonly loadingSource$ = this.loadingSource.asObservable();
  readonly checkboxSource$ = this.checkboxSource.asObservable();
  readonly cellSource$ = this.cellSource.asObservable();

  onSort(): void {
    this.sortSource.next();
  }

  onFilter(): void {
    this.filterSource.next();
  }

  onSelectionChange(): void {
    this.selectionSource.next();
  }

  onPage(): void {
    this.pageSource.next();
  }

  onColumnMenuClick(data: ColumnMenuEventArgs): void {
    this.columnMenuSource.next(data);
  }

  onResizeBegin(): void {
    this.resizeBeginSource.next();
  }

  onResize(data: any): void {
    this.resizeSource.next(data);
  }

  onResizeEnd(): void {
    this.resizeEndSource.next();
  }

  onRowsChanged(): void {
    this.rowsChanged.next();
  }

  onScroll(data: any): void {
    this.scrollSource.next(data);
  }

  onLoading(data: boolean): void {
    this.loadingSource.next(data);
  }

  onCheckbox(data: any): void {
    this.checkboxSource.next(data);
  }

  onCell(data: CellEventArgs): void {
    this.cellSource.next(data);
  }

  onMouseover(data: CellEventArgs): void {
    data.type = CellEventType.Mouseover;
    this.onCell(data);
  }

  onMouseout(data: CellEventArgs): void {
    data.type = CellEventType.Mouseout;
    this.onCell(data);
  }

  onActivateCell(data: CellEventArgs): void {
    data.type = CellEventType.Activate;
    this.onCell(data);
  }

  onClickCell(data: CellEventArgs): void {
    data.type = CellEventType.Click;
    this.onCell(data);
  }

  onDblClickCell(data: CellEventArgs): void {
    data.type = CellEventType.DblClick;
    this.onCell(data);
  }

  onKeydownCell(data: CellEventArgs): void {
    data.type = CellEventType.Keydown;
    this.onCell(data);
  }

  onContextMenu(data: CellEventArgs): void {
    data.type = CellEventType.ContextMenu;
    this.onCell(data);
  }

  onCellEditMode(data: CellEventArgs): void {
    data.type = CellEventType.EditMode;
    this.onCell(data);
  }

  onCellValueChanged(data: CellEventArgs): void {
    data.type = CellEventType.ValueChanged;
    this.onCell(data);
  }

}

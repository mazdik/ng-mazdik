import { Subject, BehaviorSubject } from 'rxjs';
import { ColumnMenuEventArgs, CellEventArgs, CellEventType } from './types';

export class Events {

  selectionSource = new Subject();
  private sortSource = new Subject();
  private filterSource = new Subject();
  private pageSource = new Subject();
  private columnMenuSource = new Subject<ColumnMenuEventArgs>();
  private resizeBeginSource = new Subject();
  private resizeSource = new Subject<any>();
  private resizeEndSource = new Subject();
  private rowsChanged = new Subject();
  private scrollSource = new Subject<any>();
  private loadingSource = new BehaviorSubject<boolean>(false);
  private checkboxSource = new Subject<any>();
  private cellSource = new Subject<CellEventArgs>();

  sortSource$ = this.sortSource.asObservable();
  filterSource$ = this.filterSource.asObservable();
  selectionSource$ = this.selectionSource.asObservable();
  pageSource$ = this.pageSource.asObservable();
  columnMenuSource$ = this.columnMenuSource.asObservable();
  resizeBeginSource$ = this.resizeBeginSource.asObservable();
  resizeSource$ = this.resizeSource.asObservable();
  resizeEndSource$ = this.resizeEndSource.asObservable();
  rowsChanged$ = this.rowsChanged.asObservable();
  scrollSource$ = this.scrollSource.asObservable();
  loadingSource$ = this.loadingSource.asObservable();
  checkboxSource$ = this.checkboxSource.asObservable();
  cellSource$ = this.cellSource.asObservable();

  onSort() {
    this.sortSource.next();
  }

  onFilter() {
    this.filterSource.next();
  }

  onSelectionChange() {
    this.selectionSource.next();
  }

  onPage() {
    this.pageSource.next();
  }

  onColumnMenuClick(data: ColumnMenuEventArgs) {
    this.columnMenuSource.next(data);
  }

  onResizeBegin() {
    this.resizeBeginSource.next();
  }

  onResize(data: any) {
    this.resizeSource.next(data);
  }

  onResizeEnd() {
    this.resizeEndSource.next();
  }

  onRowsChanged() {
    this.rowsChanged.next();
  }

  onScroll(data: any) {
    this.scrollSource.next(data);
  }

  onLoading(data: boolean) {
    this.loadingSource.next(data);
  }

  onCheckbox(data: any) {
    this.checkboxSource.next(data);
  }

  onCell(data: CellEventArgs) {
    this.cellSource.next(data);
  }

  onMouseover(data: CellEventArgs) {
    data.type = CellEventType.Mouseover;
    this.onCell(data);
  }

  onMouseout(data: CellEventArgs) {
    data.type = CellEventType.Mouseout;
    this.onCell(data);
  }

  onActivateCell(data: CellEventArgs) {
    data.type = CellEventType.Activate;
    this.onCell(data);
  }

  onClickCell(data: CellEventArgs) {
    data.type = CellEventType.Click;
    this.onCell(data);
  }

  onDblClickCell(data: CellEventArgs) {
    data.type = CellEventType.DblClick;
    this.onCell(data);
  }

  onKeydownCell(data: CellEventArgs) {
    data.type = CellEventType.Keydown;
    this.onCell(data);
  }

  onContextMenu(data: CellEventArgs) {
    data.type = CellEventType.ContextMenu;
    this.onCell(data);
  }

  onCellEditMode(data: CellEventArgs) {
    data.type = CellEventType.EditMode;
    this.onCell(data);
  }

  onCellValueChanged(data: CellEventArgs) {
    data.type = CellEventType.ValueChanged;
    this.onCell(data);
  }

}

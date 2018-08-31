import { Subject, BehaviorSubject } from 'rxjs';
import { ColumnMenuEventArgs, CellEventArgs } from './types';

export class Events {

  private sortSource = new Subject();
  private filterSource = new Subject();
  private selectionSource = new Subject();
  private pageSource = new Subject();
  private cellValueChangedSource = new Subject<any>();
  private columnMenuSource = new Subject<ColumnMenuEventArgs>();
  private resizeBeginSource = new Subject();
  private resizeSource = new Subject<any>();
  private resizeEndSource = new Subject();
  private rowsChanged = new Subject();
  private scrollSource = new Subject<any>();
  private mouseoverSource = new Subject<CellEventArgs>();
  private mouseoutSource = new Subject<boolean>();
  private activateCellSource = new Subject<CellEventArgs>();
  private clickCellSource = new Subject<CellEventArgs>();
  private dblClickCellSource = new Subject<CellEventArgs>();
  private keydownCellSource = new Subject<CellEventArgs>();
  private contextMenuSource = new Subject<CellEventArgs>();
  private loadingSource = new BehaviorSubject<boolean>(false);
  private cellEditModeSource = new Subject<CellEventArgs>();
  private checkboxSource = new Subject<any>();

  sortSource$ = this.sortSource.asObservable();
  filterSource$ = this.filterSource.asObservable();
  selectionSource$ = this.selectionSource.asObservable();
  pageSource$ = this.pageSource.asObservable();
  cellValueChangedSource$ = this.cellValueChangedSource.asObservable();
  columnMenuSource$ = this.columnMenuSource.asObservable();
  resizeBeginSource$ = this.resizeBeginSource.asObservable();
  resizeSource$ = this.resizeSource.asObservable();
  resizeEndSource$ = this.resizeEndSource.asObservable();
  rowsChanged$ = this.rowsChanged.asObservable();
  scrollSource$ = this.scrollSource.asObservable();
  mouseoverSource$ = this.mouseoverSource.asObservable();
  mouseoutSource$ = this.mouseoutSource.asObservable();
  activateCellSource$ = this.activateCellSource.asObservable();
  clickCellSource$ = this.clickCellSource.asObservable();
  dblClickCellSource$ = this.dblClickCellSource.asObservable();
  keydownCellSource$ = this.keydownCellSource.asObservable();
  contextMenuSource$ = this.contextMenuSource.asObservable();
  loadingSource$ = this.loadingSource.asObservable();
  cellEditModeSource$ = this.cellEditModeSource.asObservable();
  checkboxSource$ = this.checkboxSource.asObservable();

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

  onCellValueChanged(data: any) {
    this.cellValueChangedSource.next(data);
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

  onMouseover(data: CellEventArgs) {
    this.mouseoverSource.next(data);
  }

  onMouseout(data: boolean) {
    this.mouseoutSource.next(data);
  }

  onActivateCell(data: CellEventArgs) {
    this.activateCellSource.next(data);
  }

  onClickCell(data: CellEventArgs) {
    this.clickCellSource.next(data);
  }

  onDblClickCell(data: CellEventArgs) {
    this.dblClickCellSource.next(data);
  }

  onKeydownCell(data: CellEventArgs) {
    this.keydownCellSource.next(data);
  }

  onContextMenu(data: CellEventArgs) {
    this.contextMenuSource.next(data);
  }

  onLoading(data: boolean) {
    this.loadingSource.next(data);
  }

  onCellEditMode(data: CellEventArgs) {
    this.cellEditModeSource.next(data);
  }

  onCheckbox(data: any) {
    this.checkboxSource.next(data);
  }

}

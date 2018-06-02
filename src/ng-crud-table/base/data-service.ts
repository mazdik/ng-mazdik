import {Subject} from 'rxjs';
import {ColumnMenuEventArgs} from '../types';

export class DataService {

  private sortSource = new Subject();
  private filterSource = new Subject();
  private selectionSource = new Subject();
  private pageSource = new Subject();
  private editSource = new Subject<any>();
  private rowMenuSource = new Subject<any>();
  private columnMenuSource = new Subject<ColumnMenuEventArgs>();
  private resizeBeginSource = new Subject();
  private resizeSource = new Subject<any>();
  private resizeEndSource = new Subject();
  private rowsChanged = new Subject();
  private scrollSource = new Subject<any>();

  sortSource$ = this.sortSource.asObservable();
  filterSource$ = this.filterSource.asObservable();
  selectionSource$ = this.selectionSource.asObservable();
  pageSource$ = this.pageSource.asObservable();
  editSource$ = this.editSource.asObservable();
  rowMenuSource$ = this.rowMenuSource.asObservable();
  columnMenuSource$ = this.columnMenuSource.asObservable();
  resizeBeginSource$ = this.resizeBeginSource.asObservable();
  resizeSource$ = this.resizeSource.asObservable();
  resizeEndSource$ = this.resizeEndSource.asObservable();
  rowsChanged$ = this.rowsChanged.asObservable();
  scrollSource$ = this.scrollSource.asObservable();

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

  onEdit(row: any) {
    this.editSource.next(row);
  }

  onRowMenuClick(data: any) {
    this.rowMenuSource.next(data);
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

}

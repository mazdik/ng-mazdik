import {Subject} from 'rxjs/Subject';

export class DataService {

  private sortSource = new Subject();
  private filterSource = new Subject();
  private selectionSource = new Subject();
  private pageSource = new Subject();
  private editSource = new Subject<any>();
  private rowMenuSource = new Subject<any>();
  private columnMenuSource = new Subject<any>();
  private resizeSource = new Subject();
  private rowsSource = new Subject();

  sortSource$ = this.sortSource.asObservable();
  filterSource$ = this.filterSource.asObservable();
  selectionSource$ = this.selectionSource.asObservable();
  pageSource$ = this.pageSource.asObservable();
  editSource$ = this.editSource.asObservable();
  rowMenuSource$ = this.rowMenuSource.asObservable();
  columnMenuSource$ = this.columnMenuSource.asObservable();
  resizeSource$ = this.resizeSource.asObservable();
  rowsSource$ = this.rowsSource.asObservable();

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

  onColumnMenuClick(data: any) {
    this.columnMenuSource.next(data);
  }

  onResize() {
    this.resizeSource.next();
  }

  onRows() {
    this.rowsSource.next();
  }

}

import {Subject} from 'rxjs/Subject';

export class DataService {

  private sortSource = new Subject();
  private filterSource = new Subject();
  private selectionSource = new Subject();
  private pageSource = new Subject();
  private editSource = new Subject<any>();

  sortSource$ = this.sortSource.asObservable();
  filterSource$ = this.filterSource.asObservable();
  selectionSource$ = this.selectionSource.asObservable();
  pageSource$ = this.pageSource.asObservable();
  editSource$ = this.editSource.asObservable();

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

}

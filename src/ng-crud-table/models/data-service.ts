import {Subject} from 'rxjs/Subject';

export class DataService {

  private sortSource = new Subject();
  private filterSource = new Subject();
  private selectionSource = new Subject();

  sortSource$ = this.sortSource.asObservable();
  filterSource$ = this.filterSource.asObservable();
  selectionSource$ = this.selectionSource.asObservable();

  onSort() {
    this.sortSource.next();
  }

  onFilter() {
    this.filterSource.next();
  }

  onSelectionChange() {
    this.selectionSource.next();
  }

}

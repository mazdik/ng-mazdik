import {Subject} from 'rxjs/Subject';

export class DataService {

  private selectionSource = new Subject();

  selectionSource$ = this.selectionSource.asObservable();

  onSelectionChange() {
    this.selectionSource.next();
  }

}

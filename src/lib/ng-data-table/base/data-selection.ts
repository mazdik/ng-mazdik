import {Subject} from 'rxjs';

export class DataSelection<T> {

  get multiple(): boolean {
    return this._multiple;
  }

  private selection: T[] = [];

  constructor(private _multiple = false, private selectionSource: Subject<any>) {
  }

  selectValue(value: T) {
    if (!this.isSelected(value)) {
      this._markSelected(value);
      this.selectionSource.next();
    }
  }

  selectAll(values: T[]): void {
    if (values && values.length) {
      this._unmarkAll();
      this.select(...values);
    }
  }

  clearSelection(): void {
    this._unmarkAll();
    this.selectionSource.next();
  }

  isSelected(value: T): boolean {
    return this.selection.indexOf(value) !== -1;
  }

  getSelection(): T[] {
    return this.selection;
  }

  allSelected(values: T[]): boolean {
    return(values &&
      this.selection &&
      this.selection.length === values.length &&
      values.length !== 0);
  }

  select(...values: T[]): void {
    values.forEach(value => this._markSelected(value));
    this.selectionSource.next();
  }

  deselect(...values: T[]): void {
    values.forEach(value => this._unmarkSelected(value));
    this.selectionSource.next();
  }

  toggle(value: T): void {
    this.isSelected(value) ? this._unmarkSelected(value) : this._markSelected(value);
    this.selectionSource.next();
  }

  isEmpty(): boolean {
    return this.selection.length === 0;
  }

  private _markSelected(value: T) {
    if (!this.isSelected(value)) {
      if (!this.multiple) {
        this._unmarkAll();
      }
      this.selection.push(value);
    }
  }

  private _unmarkSelected(value: T) {
    const index = this.selection.indexOf(value);
    if (index !== -1) {
      this.selection.splice(index, 1);
    }
  }

  private _unmarkAll() {
    this.selection = [];
  }

}

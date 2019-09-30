import {Subject} from 'rxjs';

export class DataSelection<T> {

  get multiple(): boolean {
    return this._multiple;
  }

  private selection = new Set<T>();

  constructor(private readonly _multiple = false, private readonly selectionSource: Subject<any>) {
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
    return this.selection.has(value);
  }

  getSelection(): T[] {
    return Array.from(this.selection.values());
  }

  allSelected(values: T[]): boolean {
    return(values &&
      this.selection &&
      this.selection.size === values.length &&
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
    return this.selection.size === 0;
  }

  private _markSelected(value: T) {
    if (!this.isSelected(value)) {
      if (!this.multiple) {
        this._unmarkAll();
      }
      this.selection.add(value);
    }
  }

  private _unmarkSelected(value: T) {
    if (this.isSelected(value)) {
      this.selection.delete(value);
    }
  }

  private _unmarkAll() {
    if (!this.isEmpty()) {
      this.selection.forEach(value => this._unmarkSelected(value));
    }
  }

}

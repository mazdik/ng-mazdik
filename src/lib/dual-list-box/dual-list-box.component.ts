import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, ViewEncapsulation, HostBinding } from '@angular/core';
import { SelectItem } from '../common';
import { isBlank } from '../common/utils';

@Component({
  selector: 'app-dual-list-box',
  templateUrl: 'dual-list-box.component.html',
  styleUrls: [
    'dual-list-box.component.css',
    '../styles/input.css',
    '../styles/buttons.css',
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class DualListBoxComponent {

  @Input() sourceTitle: string;
  @Input() targetTitle: string;
  @Input() disabled: boolean;

  @Input()
  get source(): SelectItem[] { return this._source; }
  set source(value: SelectItem[]) {
    this._source = value;
    this.filterSource();
  }
  private _source: SelectItem[];

  @Input()
  get target(): SelectItem[] { return this._target; }
  set target(value: SelectItem[]) {
    this._target = value;
    this.filterSource();
  }
  private _target: SelectItem[];

  @Output() targetChange: EventEmitter<any> = new EventEmitter();

  @HostBinding('class.dt-listbox') cssClass = true;

  sourceModel: any;
  targetModel: any;

  constructor() { }

  moveRight() {
    if (!isBlank(this.sourceModel) && !isBlank(this.source)) {
      const selectedItemIndex = this.source.findIndex(x => x.id === this.sourceModel);
      const selectedItem = this.source[selectedItemIndex];

      this.source.splice(selectedItemIndex, 1);
      this.target.push(selectedItem);
      this.sourceModel = null;

      this.targetChange.emit(this.target);
    }
  }

  moveRightAll() {
    if (!isBlank(this.source)) {
      this.target = [...this.target, ... this.source];
      this.source = [];
      this.sourceModel = null;

      this.targetChange.emit(this.target);
    }
  }

  moveLeft() {
    if (!isBlank(this.targetModel) && !isBlank(this.target)) {
      const selectedItemIndex = this.target.findIndex(x => x.id === this.targetModel);
      const selectedItem = this.target[selectedItemIndex];

      this.target.splice(selectedItemIndex, 1);
      this.source.push(selectedItem);
      this.targetModel = null;

      this.targetChange.emit(this.target);
    }
  }

  moveLeftAll() {
    if (!isBlank(this.target)) {
      this.target.forEach(item => this.source.push(item));
      this.target = [];
      this.targetModel = null;

      this.targetChange.emit(this.target);
    }
  }

  moveUp() {
    if (!isBlank(this.targetModel) && this.target.length > 1) {
      const selectedItemIndex = this.target.findIndex(x => x.id === this.targetModel);
      if (selectedItemIndex !== 0) {
        const movedItem = this.target[selectedItemIndex];
        const temp = this.target[selectedItemIndex - 1];
        this.target[selectedItemIndex - 1] = movedItem;
        this.target[selectedItemIndex] = temp;

        this.targetChange.emit(this.target);
      }
    }
  }

  moveTop() {
    if (!isBlank(this.targetModel) && this.target.length > 1) {
      const selectedItemIndex = this.target.findIndex(x => x.id === this.targetModel);
      if (selectedItemIndex !== 0) {
        const movedItem = this.target[selectedItemIndex];
        this.target.splice(selectedItemIndex, 1);
        this.target.unshift(movedItem);

        this.targetChange.emit(this.target);
      }
    }
  }

  moveDown() {
    if (!isBlank(this.targetModel) && this.target.length > 1) {
      const selectedItemIndex = this.target.findIndex(x => x.id === this.targetModel);
      if (selectedItemIndex !== (this.target.length - 1)) {
        const movedItem = this.target[selectedItemIndex];
        const temp = this.target[selectedItemIndex + 1];
        this.target[selectedItemIndex + 1] = movedItem;
        this.target[selectedItemIndex] = temp;

        this.targetChange.emit(this.target);
      }
    }
  }

  moveBottom() {
    if (!isBlank(this.targetModel) && this.target.length > 1) {
      const selectedItemIndex = this.target.findIndex(x => x.id === this.targetModel);
      if (selectedItemIndex !== (this.target.length - 1)) {
        const movedItem = this.target[selectedItemIndex];
        this.target.splice(selectedItemIndex, 1);
        this.target.push(movedItem);

        this.targetChange.emit(this.target);
      }
    }
  }

  filterSource() {
    if (this.source && this.source.length && this.target && this.target.length) {
      this._source = this.source.filter(x => this.target.every(t => t.id !== x.id));
    }
  }

  get isBlankSourceModel() {
    return isBlank(this.sourceModel);
  }

  get isBlankTargetModel() {
    return isBlank(this.targetModel);
  }

}

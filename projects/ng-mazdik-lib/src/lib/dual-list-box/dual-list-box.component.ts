import {
  Component, Input, Output, EventEmitter, ChangeDetectionStrategy, HostBinding, ViewChild, ElementRef
} from '@angular/core';
import { SelectItem } from '../common';
import { isBlank, arrayMove, arrayTransfer } from '../common/utils';
import { DragElementEvent, DropElementEvent } from '../drag-drop/types';

@Component({
  selector: 'app-dual-list-box',
  templateUrl: 'dual-list-box.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
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
  @ViewChild('sourceList', {static: false}) sourceList: ElementRef;
  @ViewChild('targetList', {static: false}) targetList: ElementRef;

  sourceModel: any;
  targetModel: any;
  dragElementEvent: DragElementEvent;

  constructor() { }

  moveRight() {
    if (!isBlank(this.sourceModel) && !isBlank(this.source)) {
      const selectedItemIndex = this.source.findIndex(x => x.id === this.sourceModel);
      arrayTransfer(this.source, this.target, selectedItemIndex, this.target.length);
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
      arrayTransfer(this.target, this.source, selectedItemIndex, this.source.length);
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
        arrayMove(this.target, selectedItemIndex, selectedItemIndex - 1);
        if (this.targetList.nativeElement.children[selectedItemIndex]) {
          this.targetList.nativeElement.children[selectedItemIndex].scrollIntoView({block: 'center', behavior: 'smooth'});
        }

        this.targetChange.emit(this.target);
      }
    }
  }

  moveTop() {
    if (!isBlank(this.targetModel) && this.target.length > 1) {
      const selectedItemIndex = this.target.findIndex(x => x.id === this.targetModel);
      if (selectedItemIndex !== 0) {
        arrayMove(this.target, selectedItemIndex, 0);
        this.targetList.nativeElement.scrollTop = 0;

        this.targetChange.emit(this.target);
      }
    }
  }

  moveDown() {
    if (!isBlank(this.targetModel) && this.target.length > 1) {
      const selectedItemIndex = this.target.findIndex(x => x.id === this.targetModel);
      if (selectedItemIndex !== (this.target.length - 1)) {
        arrayMove(this.target, selectedItemIndex, selectedItemIndex + 1);
        if (this.targetList.nativeElement.children[selectedItemIndex]) {
          this.targetList.nativeElement.children[selectedItemIndex].scrollIntoView({block: 'center', behavior: 'smooth'});
        }

        this.targetChange.emit(this.target);
      }
    }
  }

  moveBottom() {
    if (!isBlank(this.targetModel) && this.target.length > 1) {
      const selectedItemIndex = this.target.findIndex(x => x.id === this.targetModel);
      if (selectedItemIndex !== (this.target.length - 1)) {
        arrayMove(this.target, selectedItemIndex, this.target.length);
        this.targetList.nativeElement.scrollTop = this.targetList.nativeElement.scrollHeight;

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

  onDragStart(event: DragEvent, index: number) {
    event.dataTransfer.setData('text', index.toString());
    event.dataTransfer.effectAllowed = 'move';
    this.dragElementEvent = { event, index };
  }

  onDropSource(event: DropElementEvent) {
    if (event.type === 'reorder') {
      arrayMove(this.source, event.previousIndex, event.currentIndex);
    } else {
      arrayTransfer(this.target, this.source, event.previousIndex, event.currentIndex);
    }
    this.targetModel = null;

    this.targetChange.emit(this.target);
  }

  onDropTarget(event: DropElementEvent) {
    if (event.type === 'reorder') {
      arrayMove(this.target, event.previousIndex, event.currentIndex);
    } else {
      arrayTransfer(this.source, this.target, event.previousIndex, event.currentIndex);
    }
    this.sourceModel = null;

    this.targetChange.emit(this.target);
  }

}

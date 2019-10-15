import {
  Component, Input, Output, EventEmitter, ViewEncapsulation, ChangeDetectionStrategy, ViewChild, AfterViewInit
} from '@angular/core';
import {SelectItem} from '../common';

@Component({
  selector: 'app-select-list',
  templateUrl: 'select-list.component.html',
  styleUrls: [
    '../styles/checkbox.css',
    '../styles/checkbox.css',
    '../styles/list-menu.css',
    '../styles/input.css',
  ],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectListComponent implements AfterViewInit {

  @Input() options: SelectItem[];
  @Input() multiple: boolean;
  @Input() selectAllMessage: string = 'Select all';
  @Input() cancelMessage: string = 'Cancel';
  @Input() clearMessage: string = 'Clear';
  @Input() searchMessage: string = 'Search...';

  @Input('selected')
  get model(): any[] { return this._model; }
  set model(val: any[]) {
    this._model = val;
    this.selectedOptions = (val && val.length) ? val.slice(0) : [];
  }
  private _model: any[] = [];

  @Input()
  get isOpen(): boolean { return this._isOpen; }
  set isOpen(val: boolean) {
    this._isOpen = val;
    if (val === true) {
      this.setFocus();
      this.searchFilterText = null;
    }
  }
  private _isOpen: boolean;

  @Output() selectionChange: EventEmitter<any> = new EventEmitter();
  @Output() selectionCancel: EventEmitter<boolean> = new EventEmitter();

  @ViewChild('filterInput', {static: false}) filterInput: any;
  searchFilterText: string = null;
  private selectedOptions: any[] = [];

  constructor() {}

  ngAfterViewInit() {
    this.setFocus();
  }

  setSelectedOptions(value: any) {
    const index = this.selectedOptions.indexOf(value);
    if (index > -1) {
      this.selectedOptions.splice(index, 1);
    } else {
      if (this.multiple) {
        this.selectedOptions.push(value);
      } else {
        this.selectedOptions = [];
        this.selectedOptions.push(value);
      }
    }
  }

  setSelected(event: MouseEvent, value: any) {
    event.stopPropagation();
    this.setSelectedOptions(value);
    if (!this.multiple) {
      this.selectionChangeEmit();
    }
  }

  checkAll() {
    this.selectedOptions = this.options.map(option => option.id);
    if (!this.multiple) {
      this.selectionChangeEmit();
    }
  }

  isSelected(value: any): boolean {
    return this.selectedOptions.indexOf(value) > -1;
  }

  setFocus() {
    if (this.filterInput) {
      setTimeout(() => {
        this.filterInput.nativeElement.focus();
      }, 1);
    }
  }

  onClickOk(event: MouseEvent) {
    event.stopPropagation();
    this.selectionChangeEmit();
  }

  onClickCancel(event: MouseEvent) {
    event.stopPropagation();
    this.selectedOptions = this.model.slice(0);
    this.selectionCancel.emit(true);
  }

  onClickClear(event: MouseEvent) {
    event.stopPropagation();
    if (this.selectedOptions.length > 0) {
      this.selectedOptions = [];
    }
    this.selectionChangeEmit();
  }

  get allSelected(): boolean {
    return(this.options &&
      this.options.length !== 0 &&
      this.selectedOptions &&
      this.selectedOptions.length === this.options.length);
  }

  get partiallySelected(): boolean {
    return this.selectedOptions.length !== 0 && !this.allSelected;
  }

  onCheckboxAllClick(event: MouseEvent) {
    event.stopPropagation();
    if (this.allSelected) {
      this.selectedOptions = [];
    } else {
      this.checkAll();
    }
  }

  selectionChangeEmit() {
    if (this.model.length === this.selectedOptions.length
      && this.model.every((value, index) => value === this.selectedOptions[index])) {
        this.selectionCancel.emit(true);
    } else {
      this.model = this.selectedOptions.slice(0);
      this.selectionChange.emit(this.model);
    }
  }

}

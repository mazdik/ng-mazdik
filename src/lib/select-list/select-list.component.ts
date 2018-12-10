import {
  Component, Input, Output, EventEmitter, OnInit, ViewEncapsulation, ChangeDetectionStrategy, ViewChild, AfterViewInit
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
export class SelectListComponent implements OnInit, AfterViewInit {

  @Input() options: SelectItem[];
  @Input() multiple: boolean;
  @Input() selectAllMessage: string;
  @Input() cancelMessage: string;
  @Input() clearMessage: string;
  @Input() searchMessage: string;

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

  @ViewChild('filterInput') filterInput: any;
  searchFilterText: string;
  private selectedOptions: any[] = [];

  constructor() {
  }

  ngOnInit() {
    this.selectAllMessage = this.selectAllMessage || 'Select all';
    this.cancelMessage = this.cancelMessage || 'Cancel';
    this.clearMessage = this.clearMessage || 'Clear';
    this.searchMessage = this.searchMessage || 'Search...';
  }

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

  setSelected(value: any) {
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

  onClickOk() {
    this.selectionChangeEmit();
  }

  onClickCancel() {
    this.selectedOptions = this.model.slice(0);
    this.selectionCancel.emit(true);
  }

  onClickClear() {
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

  onCheckboxAllClick() {
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

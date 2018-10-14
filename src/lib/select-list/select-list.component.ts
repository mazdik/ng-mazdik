import {
  Component, Input, Output, EventEmitter, AfterViewInit, ViewEncapsulation, ChangeDetectionStrategy,
  OnChanges, ViewChild, SimpleChanges
} from '@angular/core';

@Component({
  selector: 'app-select-list',
  templateUrl: 'select-list.component.html',
  styleUrls: ['select-list.component.css', '../styles/checkbox.css'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectListComponent implements AfterViewInit, OnChanges {

  @Input() options: any[];
  @Input() selectedOptions: any[] = [];
  @Input() multiple: boolean;
  @Input() isOpen: boolean;
  @Input() selectAllMessage: string = 'Select all';
  @Input() cancelMessage: string = 'Cancel';
  @Input() clearMessage: string = 'Clear';
  @Input() searchMessage: string = 'Search...';

  @Output() selectionChange: EventEmitter<any[]> = new EventEmitter();
  @Output() selectionCancel: EventEmitter<boolean> = new EventEmitter();

  @ViewChild('filterInput') filterInput: any;
  searchFilterText: string;
  private selectedOptionsOld: any[] = [];

  constructor() {
  }

  ngAfterViewInit() {
    this.setFocus();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.selectedOptions) {
      this.selectedOptionsOld = this.selectedOptions.slice(0);
    }
    if (changes.isOpen && this.isOpen) {
      this.setFocus();
      this.searchFilterText = null;
    }
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
    this.selectedOptions = this.selectedOptionsOld.slice(0);
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
    if (this.selectedOptionsOld.length === this.selectedOptions.length
      && this.selectedOptionsOld.every((value, index) => value === this.selectedOptions[index])) {
        this.selectionCancel.emit(true);
    } else {
      this.selectedOptionsOld = this.selectedOptions.slice(0);
      this.selectionChange.emit(this.selectedOptions);
    }
  }

}

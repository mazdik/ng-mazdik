import {
  Component, Input, Output, EventEmitter, ViewChild, ViewEncapsulation, ChangeDetectionStrategy, HostBinding,
  ChangeDetectorRef
} from '@angular/core';
import {PageEvent} from '../../lib/pagination/types';
import {SelectItem} from '../common';

@Component({
  selector: 'app-modal-select',
  templateUrl: './modal-select.component.html',
  styleUrls: [
    'modal-select.component.css',
    '../styles/input-group.css',
    '../styles/clearable-input.css',
    '../styles/list-menu.css',
    '../styles/input.css',
    '../styles/buttons.css',
    '../styles/icons.css',
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})

export class ModalSelectComponent {

  @Input()
  get options(): SelectItem[] { return this._options; }
  set options(val: SelectItem[]) {
    this._options = val;
    if (this._options) {
      this.optionsCopy = [...val];
      this.selectedName = this.getName();
      this.nameChanged.emit(this.selectedName);
    }
  }
  private _options: SelectItem[];

  @Input('value')
  get model() { return this._model; }
  set model(value) {
    if (this._model !== value) {
      this._model = value;
      this.valueChange.emit(this._model);
      this.selectedName = this.getName();
      this.nameChanged.emit(this.selectedName);
    }
  }
  private _model: any;

  @Input() zIndex: number;
  @Input() filterDelay: number = 300;
  @Input() disabled: boolean;
  @Input() modalTitle: string = 'Search Dialog';
  @Input() itemsPerPage: number = 10;
  @Input() placeholder: string = 'Select';
  @Input() searchInputPlaceholder: string = 'Search...';

  @Output() valueChange: EventEmitter<any> = new EventEmitter();
  @Output() nameChanged: EventEmitter<any> = new EventEmitter();

  @HostBinding('class.dt-modal-select') cssClass = true;
  @ViewChild('modal', {static: false}) modal: any;
  searchFilterText: string = null;
  currentPage: number = 1;
  sortOrder: number = 1;
  totalItems: number;
  filterTimeout: any;
  selectedName: string;

  private optionsCopy: SelectItem[] = [];

  constructor(private cd: ChangeDetectorRef) {}

  open() {
    if (!this.disabled) {
      this.searchFilterText = '';
      this.modal.show();
      this._options = this.getOptions();
    }
  }

  onFilterKeyup() {
    if (this.filterTimeout) {
      clearTimeout(this.filterTimeout);
    }
    this.filterTimeout = setTimeout(() => {
      this._options = this.getOptions();
      this.filterTimeout = null;
      this.cd.markForCheck();
    }, this.filterDelay);
  }

  getOptions() {
    if (this.optionsCopy && this.optionsCopy.length && this.searchFilterText) {
      const data = this.optionsCopy.filter(x => x.name.toLocaleLowerCase().indexOf(this.searchFilterText.toLocaleLowerCase()) > -1);
      this.totalItems = data.length;
      return data;
    }
    this.totalItems = this.optionsCopy.length;
    return this.optionsCopy;
  }

  onPageChanged(event: PageEvent) {
    this.currentPage = event.currentPage;
    this.itemsPerPage = event.perPage;
    this._options = this.getOptions();
  }

  setSelected(option: SelectItem) {
    this.model = option.id;
    this.modal.hide();
  }

  isSelected(option: SelectItem): boolean {
    return option.id === this.model;
  }

  getName() {
    if (this.optionsCopy) {
      const option = this.optionsCopy.find((x) => {
        return x.id === this.model;
      });
      return (option) ? option.name : '';
    }
  }

  onClickClearSearch() {
    this.searchFilterText = '';
    this.onFilterKeyup();
  }

}

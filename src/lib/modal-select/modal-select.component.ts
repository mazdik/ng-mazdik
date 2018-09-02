import {
  Component, OnInit, Input, Output, EventEmitter, ViewChild, ViewEncapsulation, ChangeDetectionStrategy,
  ChangeDetectorRef
} from '@angular/core';

export interface SelectItem {
  id: any;
  name: string;
}

@Component({
  selector: 'app-modal-select',
  templateUrl: './modal-select.component.html',
  styleUrls: ['modal-select.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})

export class ModalSelectComponent implements OnInit {

  @Input()
  set options(val: SelectItem[]) {
    this._options = val;
    if (this._options) {
      this.optionsCopy = [...val];
      this.selectedName = this.getName();
      if (this.selectedName) {
        this.nameChanged.emit(this.selectedName);
      }
    }
  }

  get options(): SelectItem[] {
    return this._options;
  }

  @Input('value')
  set model(value) {
    if (this._model !== value) {
      this._model = value;
      this.valueChange.emit(this._model);
      this.selectedName = this.getName();
      if (this.selectedName) {
        this.nameChanged.emit(this.selectedName);
      }
    }
  }

  get model() {
    return this._model;
  }

  @Input() zIndex: number;
  @Input() filterDelay: number = 300;
  @Input() disabled: boolean;
  @Input() modalTitle: string = 'Search Dialog';
  @Input() itemsPerPage: number = 10;

  @Output() valueChange: EventEmitter<any> = new EventEmitter();
  @Output() nameChanged: EventEmitter<any> = new EventEmitter();

  @ViewChild('modal') readonly modal: any;
  searchFilterText: any;
  currentPage: number = 1;
  sortOrder: number = 1;
  totalItems: number;
  pageCount: number;
  filterTimeout: any;
  selectedName: string;

  private _options: SelectItem[];
  private optionsCopy: SelectItem[];
  private _model: any;

  constructor(private cd: ChangeDetectorRef) {
  }

  ngOnInit() {
  }

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
    if (this.optionsCopy && this.optionsCopy.length) {
      let data: any[] = this.optionsCopy;
      if (this.searchFilterText) {
        const filters = [];
        filters['name'] = {'value': this.searchFilterText};
        data = this.filter(data, filters);
      }
      const sortedData = this.sort(data, 'name', this.sortOrder);
      const pageData = this.pager(sortedData, this.currentPage);
      this.totalItems = sortedData.length;
      this.pageCount = pageData.length;
      return pageData;
    } else {
      return [];
    }
  }

  filter(data: any[], filters: any[]) {
    let filteredData: Array<any> = data;
    for (const key in filters) {
      if (filters[key]['value']) {
        filteredData = filteredData.filter((item: any) => {
          if (item[key]) {
            return item[key].toString().match(filters[key]['value']);
          } else {
            return false;
          }
        });
      }
    }
    return filteredData;
  }

  sort(data: any, sortField ?: string, sortOrder ?: number) {
    return data.sort((previous: any, current: any) => {
      if (previous[sortField] > current[sortField]) {
        return sortOrder === -1 ? -1 : 1;
      } else if (previous[sortField] < current[sortField]) {
        return sortOrder === 1 ? -1 : 1;
      }
      return 0;
    });
  }

  pager(data: any, page: any): Array<any> {
    const start = (page - 1) * this.itemsPerPage;
    const end = this.itemsPerPage > -1 ? (start + this.itemsPerPage) : data.length;
    return data.slice(start, end);
  }

  onPageChanged(event) {
    this.currentPage = event;
    this._options = this.getOptions();
  }

  rowCount() {
    const count = this.itemsPerPage * this.currentPage;
    return (count < this.totalItems) ? count : this.totalItems;
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

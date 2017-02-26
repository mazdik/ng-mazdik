import { Component, Input, Output, OnInit, DoCheck, EventEmitter, ElementRef, Pipe, ViewChild, IterableDiffers } from '@angular/core';
import { ISelectOption, Column, Filter } from '../types/interfaces';

@Pipe({
    name: 'searchFilter'
})
export class SelectSearchFilter {
    transform(options: Array < ISelectOption > , args: string): Array < ISelectOption > {
        options = options || [];
        return options.filter((option: ISelectOption) =>
            option.name
            .toLowerCase()
            .indexOf((args || '').toLowerCase()) > -1);
    }
}

@Component({
    selector: 'ng-filter',
    templateUrl: './filter.component.html',
    styleUrls: ['./filter.css'],
})
export class FilterComponent implements OnInit, DoCheck {

    @Input() column: Column;
    @Input() activeColumn: string;
    @Input() filters: Filter = {};
	@Output() onFilter: EventEmitter<any> = new EventEmitter();

    @ViewChild('selectionSpan') selectionSpan: any;
    @ViewChild('searchFilterInput') searchFilterInput: any;
    @ViewChild('filterInput') filterInput: any;

    // Width and position for the dropdown container.
    left: number;
    top: number;
    width: number;

    selectionLimit: number = 1;
    selectedOptions: any[];
    differ: any;
    numSelected: number = 0;
    isVisible: boolean = false;
    searchFilterText: string = '';

    selectContainerClicked: boolean = false;
    filterTimeout: any;

    constructor(private elementRef: ElementRef, private differs: IterableDiffers) {
        this.differ = differs.find([]).create(null);
    }

    ngOnInit() {}

    ngDoCheck() {
        let changes = this.differ.diff(this.selectedOptions);
        if (changes) {
            this.updateNumSelected();
        }
    }

    clearSearch() {
        this.searchFilterText = '';
    }

    toggleDropdown() {
        this.isVisible ? this.closeDropdown() : this.openDropdown();
    }

    openDropdown() {
        if (!this.isVisible) {
            this.isVisible = true;
            if(this.column.options) {
                setTimeout(() => {this.searchFilterInput.nativeElement.focus()});
            } else {
                setTimeout(() => {this.filterInput.nativeElement.focus()});
            }
        }
    }

    closeDropdown() {
        if (this.isVisible) {
            this.clearSearch();
            this.isVisible = false;
        }
    }

    setSelected(event: Event, option: ISelectOption) {
        if (!this.selectedOptions) {
            this.selectedOptions = [];
        }
        let index = this.selectedOptions.indexOf(option.id);
        if (index > -1) {
            this.selectedOptions.splice(index, 1);
        } else {
            if (this.selectionLimit === 0 || this.selectedOptions.length < this.selectionLimit) {
                this.selectedOptions.push(option.id);
            } else {
              this.selectedOptions.push(option.id);
              this.selectedOptions.shift();
            }
        }
        this.filter(this.selectedOptions[0], this.column.name, null); // [0] todo multi
        this.toggleDropdown();
    }

    checkAll() {
        this.selectedOptions = this.column.options.map(option => option.id);
        this.filter(this.selectedOptions[0], this.column.name, null); // [0] todo multi
        this.toggleDropdown();
    }

    uncheckAll() {
        this.selectedOptions = [];
        this.filter(this.selectedOptions[0], this.column.name, null); // [0] todo multi
        this.toggleDropdown();
    }

    isSelected(option: ISelectOption): boolean {
        return this.selectedOptions && this.selectedOptions.indexOf(option.id) > -1;
    }

    updateNumSelected() {
        this.numSelected = this.selectedOptions && this.selectedOptions.length || 0;
    }

    onSelectContainerClick(event: any) {
        this.selectContainerClicked = true;
    }

    onWindowClick() {
        if (!this.selectContainerClicked) {
            this.closeDropdown();
        }
        this.selectContainerClicked = false;
    }

    show(width: number, top: number, left: number) {
        this.selectContainerClicked = true;
        this.width = width;
        if (this.top === top && this.left === left) {
            this.toggleDropdown();
        } else {
            this.top = top;
            this.left = left;
            this.closeDropdown();
            this.openDropdown();
        }
    }

    showColumnMenu(event, column) {
        let el = event.target.parentNode.parentNode.parentNode;
        this.show(200, this.getHeight(el), 0);
    }

    getHeight(el): number {
        let height = el.offsetHeight;
        let style = getComputedStyle(el);

        height -= parseFloat(style.paddingTop) + parseFloat(style.paddingBottom) + parseFloat(style.borderTopWidth) + parseFloat(style.borderBottomWidth);

        return height;
    }

    onFilterInputClick(event) {
        event.stopPropagation();
    }

    onFilterKeyup(value, field, matchMode) {
        if (this.filterTimeout) {
            clearTimeout(this.filterTimeout);
        }

        this.filterTimeout = setTimeout(() => {
            this.filter(value, field, matchMode);
            this.filterTimeout = null;
        }, 300);
    }

    filter(value, field, matchMode) {
        if (!this.isFilterBlank(value))
            this.filters[field] = { value: value, matchMode: matchMode };
        else if (this.filters[field])
            delete this.filters[field];

        this.onFilter.emit(this.filters);
    }

    isFilterBlank(filter: any): boolean {
        if (filter !== null && filter !== undefined) {
            if ((typeof filter === 'string' && filter.trim().length == 0) || (filter instanceof Array && filter.length == 0))
                return true;
            else
                return false;
        }
        return true;
    }

}

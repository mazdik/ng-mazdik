import { Component, Input, Output, OnInit, DoCheck, EventEmitter, ElementRef, Pipe, ViewChild, IterableDiffers } from '@angular/core';

export interface ISelectOption {
    id: any;
    name: string;
}

@Pipe({
    name: 'searchFilter'
})
export class SelectSearchFilter {
    transform(options: Array < ISelectOption > , args: string): Array < ISelectOption > {
        return options.filter((option: ISelectOption) =>
            option.name
            .toLowerCase()
            .indexOf((args || '').toLowerCase()) > -1);
    }
}

@Component({
    selector: 'ng-select',
    templateUrl: './select.component.html',
    styleUrls: ['./select.css'],
})
export class SelectComponent implements OnInit, DoCheck {

    @Input() options: Array < ISelectOption > = [];
    @Output() onChange = new EventEmitter();
    @Output() dropdownClosed = new EventEmitter();

    @Input()
    get selectedOptions() {
        return this.model;
    }
    set selectedOptions(value) {
        this.model = value;
        this.onChange.emit(this.model);
    }

    @ViewChild('selectionSpan') selectionSpan: any;
    @ViewChild('filterInput') filterInput: any;

    // Width and position for the dropdown container.
    left: number;
    top: number;
    width: number;

    model: any[];
    title: string;
    differ: any;
    numSelected: number = 0;
    isVisible: boolean = false;
    searchFilterText: string = '';

    selectContainerClicked: boolean = false;

    constructor(private elementRef: ElementRef, private differs: IterableDiffers) {
        this.differ = differs.find([]).create(null);
    }

    ngOnInit() {}

    ngDoCheck() {
        let changes = this.differ.diff(this.selectedOptions);
        if (changes) {
            this.updateNumSelected();
            this.updateTitle();
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
            this.filterInput.nativeElement.focus();
        }
    }

    closeDropdown() {
        if (this.isVisible) {
            this.clearSearch();
            this.isVisible = false;
            this.dropdownClosed.emit(this.selectedOptions);
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
            this.selectedOptions.push(option.id);
        }
        this.toggleDropdown();
    }

    checkAll() {
        this.selectedOptions = this.options.map(option => option.id);
        this.toggleDropdown();
    }

    uncheckAll() {
        this.selectedOptions = [];
        this.toggleDropdown();
    }

    isSelected(option: ISelectOption): boolean {
        return this.selectedOptions && this.selectedOptions.indexOf(option.id) > -1;
    }

    updateNumSelected() {
        this.numSelected = this.selectedOptions && this.selectedOptions.length || 0;
    }

    updateTitle() {
        this.numSelected = this.selectedOptions && this.selectedOptions.length || 0;
        if (this.numSelected === 0) {
            this.title = '';
        } else if (this.numSelected <= 3) {
            this.title = this.options
                .filter((option) =>
                    this.selectedOptions && this.selectedOptions.indexOf(option.id) > -1
                )
                .map((option) => option.name)
                .join(', ');
        } else {
            this.title = this.numSelected + 'checked';
        }
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

    onWindowResize() {
        this.updateWidth();
    }

    updateWidth() {
        this.width = this.selectionSpan.nativeElement.offsetWidth;
    }

    updatePosition() {
        let e = this.selectionSpan.nativeElement;
        this.left = e.offsetLeft;
        this.top = e.offsetTop + e.offsetHeight;
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
}

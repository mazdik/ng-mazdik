import {
  Component, Input, Output, EventEmitter, ViewEncapsulation, ChangeDetectionStrategy, ChangeDetectorRef,
  HostBinding, ElementRef, OnInit, OnDestroy
} from '@angular/core';
import {DropDown} from '../dropdown/drop-down';
import {SelectItem} from '../common';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-dropdown-select',
  templateUrl: 'dropdown-select.component.html',
  styleUrls: [
    'dropdown-select.component.css',
    '../styles/input-group.css',
    '../styles/input.css',
    '../styles/buttons.css',
    '../styles/icons.css'
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})

export class DropdownSelectComponent implements OnInit, OnDestroy {

  @Input() multiple: boolean;
  @Input() disabled: boolean;
  @Input() selectAllMessage: string = 'Select all';
  @Input() cancelMessage: string = 'Cancel';
  @Input() clearMessage: string = 'Clear';
  @Input() placeholder: string = 'Select';
  @Input() searchInputPlaceholder: string = 'Search...';

  @Input()
  get options(): SelectItem[] { return this._options; }
  set options(val: SelectItem[]) {
    this._options = val;
    this.selectedName = this.getName(this.selectedOptions);
  }
  private _options: SelectItem[];

  @Input()
  set value(val: any) {
    if (Array.isArray(val)) {
      this.selectedOptions = [...val];
    } else {
      this.selectedOptions = [];
      if (val) {
        this.selectedOptions.push(val);
      }
    }
    this.selectedName = this.getName(this.selectedOptions);
  }

  @Output() valueChange: EventEmitter<string> = new EventEmitter<string>();

  @HostBinding('class.dt-dropdown-select') cssClass = true;

  selectedOptions: SelectItem[] = [];
  selectedName: string;
  dropdown: DropDown;
  private subscriptions: Subscription[] = [];

  constructor(private element: ElementRef, private cd: ChangeDetectorRef) {
    this.dropdown = new DropDown(this.element.nativeElement);
  }

  ngOnInit() {
    const subDropdown = this.dropdown.isOpenSource$.subscribe(() => {
      this.cd.markForCheck();
    });
    this.subscriptions.push(subDropdown);
  }

  ngOnDestroy() {
    this.dropdown.removeEventListeners();
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  open(event: MouseEvent) {
    event.stopPropagation();
    if (!this.disabled) {
      this.dropdown.toggleDropdown();
    }
  }

  onSelectionChange(event) {
    this.selectedName = this.getName(event);
    this.selectionChangeEmit(event);
    this.dropdown.isOpen = false;
  }

  onSelectionCancel() {
    this.dropdown.isOpen = false;
  }

  getName(items: any) {
    if (items && items.length && this.options && this.options.length) {
      if (this.multiple && items.length > 1) {
        return items.length + ' items selected';
      } else {
        const option = this.options.find((x) => {
          return x.id === items[0];
        });
        return (option) ? option.name : '';
      }
    }
  }

  selectionChangeEmit(items: any) {
    if (!this.multiple) {
      const value = (items && items.length) ? items[0] : null;
      this.valueChange.emit(value);
    } else {
      this.valueChange.emit(items);
    }
  }

}

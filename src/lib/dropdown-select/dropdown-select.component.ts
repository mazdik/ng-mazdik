import {
  Component, Input, Output, EventEmitter, ViewEncapsulation, ChangeDetectionStrategy, ChangeDetectorRef, HostBinding
} from '@angular/core';
import {Dropdown} from './dropdown';

export interface SelectItem {
  id: any;
  name: string;
}

@Component({
  selector: 'app-dropdown-select',
  templateUrl: 'dropdown-select.component.html',
  styleUrls: [
    'dropdown-select.component.css',
    '../styles/input-group.css',
    '../styles/input.css',
    '../styles/buttons.css'
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})

export class DropdownSelectComponent extends Dropdown {

  @Input() multiple: boolean;
  @Input() selectAllMessage: string;
  @Input() cancelMessage: string;
  @Input() clearMessage: string;
  @Input() searchMessage: string;
  @Input() placeholder: string = 'Select';

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

  @HostBinding('class.dropdown-select') cssClass = true;

  selectedOptions: SelectItem[] = [];
  selectedName: string;

  constructor(cd: ChangeDetectorRef) {
    super(cd);
  }

  onSelectionChange(event) {
    this.selectedName = this.getName(event);
    this.selectionChangeEmit(event);
    this.isOpen = false;
  }

  onSelectionCancel() {
    this.isOpen = false;
  }

  getName(items: any) {
    if (items && items.length) {
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

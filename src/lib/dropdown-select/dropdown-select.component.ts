import {
  Component, Input, Output, EventEmitter, ViewEncapsulation, ChangeDetectionStrategy, ChangeDetectorRef, HostBinding
} from '@angular/core';

export interface SelectItem {
  id: any;
  name: string;
}

@Component({
  selector: 'app-dropdown-select',
  templateUrl: 'dropdown-select.component.html',
  styleUrls: ['dropdown-select.component.css', '../styles/input-group.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})

export class DropdownSelectComponent {

  @Input() options: SelectItem[];
  @Input() selectedOptions: SelectItem[] = [];
  @Input() multiple: boolean;
  @Input() selectAllMessage: string;
  @Input() cancelMessage: string;
  @Input() clearMessage: string;
  @Input() searchMessage: string;

  @Output() selectionChange: EventEmitter<string> = new EventEmitter<string>();

  @HostBinding('class.dropdown-select') cssClass = true;

  isOpen: boolean;
  selectedName: string;

  constructor(private cd: ChangeDetectorRef) {
  }

  onClick() {
    this.isOpen = !this.isOpen;
  }

  onSelectionChange(event) {
    this.selectedOptions = event;
    this.selectedName = this.getName(event);
    this.selectionChange.emit(event);
    this.isOpen = false;
    this.cd.markForCheck();
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

}

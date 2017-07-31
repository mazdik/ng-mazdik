import {Component, Input, Output, EventEmitter} from '@angular/core';
import {Column, Settings} from '../types/interfaces';

@Component({
  selector: 'detail-view',
  templateUrl: 'detail-view.component.html',
  styleUrls: ['detail-view.component.css'],
})

export class DetailViewComponent {

  @Input() public columns: Column[];
  @Input() public settings: Settings;
  @Input() public item: any;

  @Output() onSaveItem: EventEmitter<any> = new EventEmitter();
  @Output() onDeleteItem: EventEmitter<any> = new EventEmitter();
  @Output() onClose: EventEmitter<any> = new EventEmitter();

  public edit: boolean = false;

  constructor() {
  }

  format(value: any, column: Column) {
    if (column.format && column.format === 'date') {
      let d = new Date(value * 1000);
      value = d.toLocaleString('ru');
    }
    return value;
  }

  closeForm() {
    this.edit = false;
  }

  toggleForm() {
    this.edit = !this.edit;
  }

  closeDetails() {
    this.onClose.emit(true);
  }

  saveItem() {
    this.onSaveItem.emit(this.item);
    this.edit = false;
  }

  deleteItem() {
    this.onDeleteItem.emit(this.item);
    this.onClose.emit(true);
  }

}

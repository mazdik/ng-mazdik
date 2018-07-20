import {Component, Input, ViewChild, ViewContainerRef, OnInit, OnDestroy, Output, EventEmitter} from '@angular/core';
import {DataManager, Column} from '../../base';

@Component({
  selector: 'app-row-form',
  templateUrl: 'form.component.html'
})

export class FormComponent implements OnInit, OnDestroy {

  @Input() public dataManager: DataManager;
  @Output() valid: EventEmitter<boolean> = new EventEmitter();

  @ViewChild('cellTemplate', {read: ViewContainerRef}) cellTemplate: ViewContainerRef;
  private validElements: any = {};

  constructor() {
  }

  ngOnInit() {
  }

  ngOnDestroy(): void {
    if (this.cellTemplate) {
      this.cellTemplate.clear();
    }
  }

  elemEnabled(column: Column): boolean {
    if (column.formHidden) {
      return false;
    }
    if (!this.dataManager.isNewItem && column.isPrimaryKey) {
      return false;
    }
    return true;
  }

  onValid(event: any, column: Column) {
    this.validElements[column.name] = event;
    this.isValid();
  }

  isValid() {
    let result: boolean;
    for (const key of Object.keys(this.validElements)) {
      result = this.validElements[key];
      if (!result) {
        break;
      }
    }
    this.valid.emit(result);
  }

  onKeyColumnChange(event) {
    this.dataManager.item[event.column] = event.value;
  }

  isDisabled(column: Column) {
    if (column.keyColumn && !this.dataManager.isNewItem) {
      const fkColumn = this.dataManager.columns.find(x => x.name === column.keyColumn);
      return (fkColumn.isPrimaryKey === true);
    }
    return false;
  }

}

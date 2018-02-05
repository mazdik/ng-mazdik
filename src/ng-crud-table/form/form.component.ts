import {Component, Input, ViewChild, ViewContainerRef, OnInit, OnDestroy} from '@angular/core';
import {CrudTable} from '../models/crud-table';
import {Column} from '../models/column';

@Component({
  selector: 'app-row-form',
  templateUrl: 'form.component.html'
})

export class FormComponent implements OnInit, OnDestroy {

  @Input() public crudTable: CrudTable;

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
    const name = column.name;
    if (this.crudTable.table.settings.primaryKeys &&
      this.crudTable.table.settings.primaryKeys.length &&
      !this.crudTable.isNewItem) {
      return (this.crudTable.table.settings.primaryKeys.indexOf(name) === -1);
    } else {
      return true;
    }
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
    this.crudTable.formValid = result;
  }

  onKeyColumnChange(event) {
    this.crudTable.item[event.column] = event.value;
  }

  isDisabled(column: Column) {
    if (column.keyColumn && !this.crudTable.isNewItem) {
      return (this.crudTable.table.settings.primaryKeys.indexOf(column.keyColumn) !== -1);
    } else {
      return false;
    }
  }

}

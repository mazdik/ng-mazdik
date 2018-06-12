import {Component, Input, ViewChild, ViewContainerRef, OnInit, OnDestroy} from '@angular/core';
import {DataManager, Column} from '../base';

@Component({
  selector: 'app-row-form',
  templateUrl: 'form.component.html'
})

export class FormComponent implements OnInit, OnDestroy {

  @Input() public dataManager: DataManager;

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
    if (this.dataManager.settings.primaryKeys &&
      this.dataManager.settings.primaryKeys.length &&
      !this.dataManager.isNewItem) {
      return (this.dataManager.settings.primaryKeys.indexOf(name) === -1);
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
    this.dataManager.formValid = result;
  }

  onKeyColumnChange(event) {
    this.dataManager.item[event.column] = event.value;
  }

  isDisabled(column: Column) {
    if (column.keyColumn && !this.dataManager.isNewItem) {
      return (this.dataManager.settings.primaryKeys.indexOf(column.keyColumn) !== -1);
    } else {
      return false;
    }
  }

}

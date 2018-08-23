import {
  Component, Input, ViewChild, ViewContainerRef, OnInit, OnDestroy, Output, EventEmitter, ViewEncapsulation
} from '@angular/core';
import {DataManager, Column} from '../../ng-crud-table/base';

@Component({
  selector: 'app-dynamic-form',
  templateUrl: 'dynamic-form.component.html',
  styleUrls: ['dynamic-form.component.css'],
  encapsulation: ViewEncapsulation.None,
})

export class DynamicFormComponent implements OnInit, OnDestroy {

  @Input() dataManager: DataManager;
  @Input() isNewItem: boolean = true;

  @Output() valid: EventEmitter<boolean> = new EventEmitter();
  @Output() loaded: EventEmitter<any> = new EventEmitter();

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
    if (!this.isNewItem && column.isPrimaryKey) {
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
    if (column.keyColumn && !this.isNewItem) {
      const fkColumn = this.dataManager.columns.find(x => x.name === column.keyColumn);
      return (fkColumn.isPrimaryKey === true);
    }
    return false;
  }

  onSelectPopupNameChanged(value: any, column: Column) {
    if (column.keyColumn) {
      this.dataManager.item[column.name] = value;
    }
  }

}

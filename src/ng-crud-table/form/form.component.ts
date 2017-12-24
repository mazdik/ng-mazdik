import {Component, Input, Output, ViewChild, ViewContainerRef, OnInit, OnDestroy, EventEmitter, ViewEncapsulation} from '@angular/core';
import {Column, Settings, ICrudService} from '../types/interfaces';

@Component({
  selector: 'app-row-form',
  templateUrl: 'form.component.html',
  styleUrls: ['form.component.css', 'checkbox-radio.css'],
  encapsulation: ViewEncapsulation.None,
})

export class FormComponent implements OnInit, OnDestroy {

  @Input() public columns: Column[];
  @Input() public settings: Settings;
  @Input() public item: any;
  @Input() public isNew: boolean = true;
  @Input() public service: ICrudService;
  @Output() valid: EventEmitter<boolean> = new EventEmitter();

  @ViewChild('cellTemplate', { read: ViewContainerRef }) cellTemplate: ViewContainerRef;
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
    if (Array.isArray(this.settings.primaryKey)) {
      if (!this.isNew) {
        return (this.settings.primaryKey.indexOf(name) === -1);
      } else {
        return true;
      }
    } else {
      const pk = (this.settings['primaryKey']) ? this.settings['primaryKey'].toLowerCase() : null;
      return (name !== pk);
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
    this.valid.emit(result);
  }

  onKeyColumnChange(event) {
    this.item[event.column] = event.value;
  }

}

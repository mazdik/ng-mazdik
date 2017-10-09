import {Component, Input, ViewChild, ViewContainerRef, OnInit, OnDestroy} from '@angular/core';
import {Column, Settings} from '../types/interfaces';

@Component({
  selector: 'app-row-form',
  templateUrl: 'form.component.html'
})

export class FormComponent implements OnInit, OnDestroy {

  @Input() public columns: Column[];
  @Input() public settings: Settings;
  @Input() public item: any;
  @Input() public isNew: boolean = true;

  @ViewChild('cellTemplate', { read: ViewContainerRef }) cellTemplate: ViewContainerRef;

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

}

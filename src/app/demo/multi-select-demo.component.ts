import {Component, OnInit, ViewChild, TemplateRef, OnDestroy, ViewEncapsulation} from '@angular/core';
import {Column, CdtSettings, DataManager} from '../../lib/ng-crud-table';
import {CellEventType} from '../../lib/ng-data-table';
import {DemoService} from './demo.service';
import {SelectItem} from '../../lib/common';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-multi-select-demo',
  template: `<app-crud-table class="multi-select-demo" [dataManager]="dataManager"></app-crud-table>
    <ng-template #cellTemplate let-rowIndex="rowIndex" let-value="value">
      <span *ngIf="!editing[rowIndex]">
        {{value}}
      </span>
      <app-dropdown-select
        class="dt-dropdown-select-fixed"
        *ngIf="editing[rowIndex]"
        [multiple]="true"
        [options]="options"
        [value]="value"
        (valueChange)="value=$event">
      </app-dropdown-select>
    </ng-template>
    <ng-template #formTemplate let-value="value">
      <app-dropdown-select
        class="dt-dropdown-select-fixed"
        [multiple]="true"
        [options]="options"
        [value]="value"
        (valueChange)="value=$event">
      </app-dropdown-select>
    </ng-template>
  `,
  styles: [
    `.multi-select-demo {width: 600px;}
    .multi-select-demo .datatable-body-cell {padding: 0; margin: 0;}
    .multi-select-demo .datatable-body-cell > div:first-child,
    .multi-select-demo .datatable-body-cell > span:first-child {padding: 4px 3px;}`,
  ],
  encapsulation: ViewEncapsulation.None,
})

export class MultiSelectDemoComponent implements OnInit, OnDestroy {

  columns: Column[] = [
    { title: 'Id', name: 'id' },
    { title: 'Name', name: 'name' },
    { title: 'Test', name: 'test', width: 250 }
  ];
  dataManager: DataManager;
  settings: CdtSettings = new CdtSettings({
    crud: true,
  });
  @ViewChild('cellTemplate') cellTemplate: TemplateRef<any>;
  @ViewChild('formTemplate') formTemplate: TemplateRef<any>;
  options: SelectItem[] = [
    {id: 1, name: 'Select 1'},
    {id: 2, name: 'Select 2'},
    {id: 3, name: 'Select 3'},
    {id: 4, name: 'Select 4'},
  ];
  editing = {};
  private subscriptions: Subscription[] = [];

  constructor(private service: DemoService) {
    this.dataManager = new DataManager(this.columns, this.settings, this.service);
  }

  ngOnInit() {
    this.dataManager.columns[2].cellTemplate = this.cellTemplate;
    this.dataManager.columns[2].formTemplate = this.formTemplate;

    const subCell = this.dataManager.events.cellSource$.subscribe((data) => {
      if (data.type === CellEventType.Click && data.columnIndex === 2) {
        Object.keys(this.editing).forEach(x => this.editing[x] = false);
        this.editing[data.rowIndex] = true;
      }
    });
    this.subscriptions.push(subCell);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

}

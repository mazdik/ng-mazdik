import {Component, OnInit, ViewChild, TemplateRef} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Column, Settings, DataTable} from '../../ng-data-table';
import {getColumnsPlayers} from './columns';
import {DataFilter} from '../../ng-data-table/base';

@Component({
  selector: 'app-template-demo',
  template: `
    <app-datatable [table]="table"></app-datatable>
    <ng-template #headerCellTemplate let-column="column">
      <img width="40" src="assets/asmodian.png" title="ASMODIANS"
        (click)="clickRaceFilter('ASMODIANS')"
        style="cursor: pointer;"/>
      <strong title="Clear filter" (click)="clickRaceFilter()" style="cursor: pointer;">
        {{column.title}}
      </strong>
      <img width="40" src="assets/elyos.png" title="ELYOS"
      (click)="clickRaceFilter('ELYOS')"
      style="cursor: pointer;"/>
    </ng-template>
    <ng-template #cellTemplate let-row="row" let-value="value">
      <img *ngIf="value === 'ASMODIANS'" width="40" src="assets/asmodian.png" title="ASMODIANS"/>
      <img *ngIf="value === 'ELYOS'" width="40" src="assets/elyos.png" title="ELYOS"/>
      {{value}}
    </ng-template>
  `
})

export class TemplateDemoComponent implements OnInit {

  table: DataTable;
  columns: Column[];
  settings: Settings = <Settings>{
    headerRowHeight: 40,
    rowHeight: 40,
    actionColumnWidth: 0
  };
  @ViewChild('headerCellTemplate') headerCellTemplate: TemplateRef<any>;
  @ViewChild('cellTemplate') cellTemplate: TemplateRef<any>;

  constructor(private http: HttpClient) {
    this.columns = getColumnsPlayers();
    for (const column of this.columns) {
      column.editable = false;
    }
    this.columns[0].frozen = false;
    this.columns[1].frozen = false;
    this.table = new DataTable(this.columns, this.settings);
  }

  ngOnInit() {
    this.table.events.onLoading(true);
    this.http.get('assets/players.json').subscribe(data => {
      this.table.rows = data;
      this.table.events.onLoading(false);
    });
    this.table.columns[2].headerCellTemplate = this.headerCellTemplate;
    this.table.columns[2].cellTemplate = this.cellTemplate;
  }

  clickRaceFilter(value: string) {
    this.table.dataFilter.setFilter(value, 'race', DataFilter.EQUALS);
    this.table.events.onFilter();
  }

}

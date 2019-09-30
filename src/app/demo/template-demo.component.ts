import {Component, OnInit, ViewChild, TemplateRef} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ColumnBase, Settings, DataTable, FilterOperator} from 'ng-mazdik-lib';
import {getColumnsPlayers} from './columns';

@Component({
  selector: 'app-template-demo',
  template: `
    <app-data-table [table]="table"></app-data-table>
    <ng-template #headerCellTemplate let-column="column">
      <img width="40" src="assets/asmodian.png" title="ASMODIANS"
        (click)="clickRaceFilter('ASMODIANS')"
        style="cursor: pointer;"/>
      <strong title="Clear filter" (click)="clickRaceFilter(null)" style="cursor: pointer;">
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
    <ng-template #headerRnCellTemplate>
      <button class="filter-action"
        [style.visibility]="(!table.dataFilter.hasFilters()) ? 'hidden' : 'visible' "
        (click)="clearAllFilters()"
        [title]="table.messages.clearFilters">
        <i class="dt-icon-filter"></i>
      </button>
    </ng-template>
    <ng-template #cellRnTemplate let-row="row">
      {{row.$$index + 1}}
    </ng-template>
  `
})

export class TemplateDemoComponent implements OnInit {

  table: DataTable;
  columns: ColumnBase[];
  settings: Settings = new Settings({
    headerRowHeight: 40,
    rowHeight: 40,
  });
  @ViewChild('headerCellTemplate', {static: true}) headerCellTemplate: TemplateRef<any>;
  @ViewChild('cellTemplate', {static: true}) cellTemplate: TemplateRef<any>;
  @ViewChild('headerRnCellTemplate', {static: true}) headerRnCellTemplate: TemplateRef<any>;
  @ViewChild('cellRnTemplate', {static: true}) cellRnTemplate: TemplateRef<any>;

  rnColumn: ColumnBase = {
    name: 'rn',
    title: '#',
    sortable: false,
    filter: false,
    frozen: true,
    resizeable: false,
    width: 40,
    minWidth: 40,
    formHidden: true,
    cellClass: 'action-cell',
    headerCellClass: 'action-cell',
  };

  constructor(private http: HttpClient) {
    this.columns = getColumnsPlayers();
    for (const column of this.columns) {
      column.editable = false;
      column.frozen = false;
    }
    this.columns.unshift(this.rnColumn);
    this.table = new DataTable(this.columns, this.settings);
  }

  ngOnInit() {
    this.table.events.onLoading(true);
    this.http.get<any[]>('assets/players.json').subscribe(data => {
      this.table.rows = data;
      this.table.events.onLoading(false);
    });
    let column = this.table.columns.find(x => x.name === 'race');
    column.headerCellTemplate = this.headerCellTemplate;
    column.cellTemplate = this.cellTemplate;

    column = this.table.columns.find(x => x.name === 'rn');
    column.headerCellTemplate = this.headerRnCellTemplate;
    column.cellTemplate = this.cellRnTemplate;
  }

  clickRaceFilter(value: string) {
    this.table.dataFilter.setFilter(value, 'race', FilterOperator.EQUALS);
    this.table.events.onFilter();
  }

  clearAllFilters() {
    this.table.dataFilter.clear();
    this.table.events.onFilter();
  }

}

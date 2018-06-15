import {Component, OnInit, ViewChild, TemplateRef} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Column, Settings, DataTable} from '../../ng-crud-table';
import {getColumnsPlayers} from './columns';

@Component({
  selector: 'app-template-demo',
  template: `
    <app-datatable [table]="table"></app-datatable>
    <ng-template #template let-row="row" let-value="value">
      <img *ngIf="value === 'ASMODIANS'" width="40" src="assets/asmodian.png" title="ASMODIANS"/>
      <img *ngIf="value === 'ELYOS'" width="40" src="assets/elyos.png" title="ELYOS"/>
      {{value}}
    </ng-template>
  `
})

export class TemplateDemoComponent implements OnInit {

  public table: DataTable;
  public columns: Column[];
  public settings: Settings = {
    headerRowHeight: 0,
    rowHeight: 40,
    rowNumber: false
  };
  @ViewChild('template') template: TemplateRef<any>;

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
    this.table.columns[2].cellTemplate = this.template;
  }

}

import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Column, Settings, DataTable} from '../../lib/ng-data-table';
import {getColumnsPlayers} from './columns';

@Component({
  selector: 'app-editable-condition-demo',
  template: `<p>Editable condition per row. If row.exp > 1000000 and column editable</p>
  <app-data-table [table]="table"></app-data-table>`
})

export class EditableConditionDemoComponent implements OnInit {

  table: DataTable;
  columns: Column[];

  settings: Settings = new Settings({
    isEditableCellProp: '$$editable',
  });

  constructor(private http: HttpClient) {
    this.columns = getColumnsPlayers();
    this.table = new DataTable(this.columns, this.settings);
  }

  ngOnInit() {
    this.table.events.onLoading(true);
    this.http.get<any[]>('assets/players.json').subscribe(data => {
      for (const row of data) {
        row.$$editable = row.exp > 1000000;
      }
      this.table.rows = data;
      this.table.events.onLoading(false);
    });
  }

}

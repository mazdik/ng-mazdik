import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Column, Settings, DataTable} from '../../ng-crud-table';
import {getColumnsPlayers} from './columns';

@Component({
  selector: 'app-row-group-multiple-demo',
  template: `
    <app-datatable [table]="table" [loading]="loading"></app-datatable>
  `
})

export class RowGroupMultipleDemoComponent implements OnInit {

  public table: DataTable;
  public columns: Column[];
  public loading: boolean = false;

  public settings: Settings = {
    api: null,
    crud: true,
    primaryKeys: ['id'],
    groupRowsBy: ['race', 'gender']
  };

  constructor(private http: HttpClient) {
    this.columns = getColumnsPlayers();
    this.table = new DataTable(this.columns, this.settings);
    this.table.pager.perPage = 50;
  }

  ngOnInit() {
    this.loading = true;
    this.http.get('assets/players.json').subscribe(data => {
      this.table.rows = data;
      this.loading = false;
    });
  }

}

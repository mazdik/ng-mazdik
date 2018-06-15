import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Column, Settings, DataTable} from '../../ng-crud-table';
import {getColumnsPlayers} from './columns';

@Component({
  selector: 'app-css-demo',
  template: `<app-datatable [table]="table"></app-datatable>`
})

export class CssDemoComponent implements OnInit {

  public table: DataTable;
  public columns: Column[];
  public settings: Settings = <Settings>{};

  constructor(private http: HttpClient) {
    this.columns = getColumnsPlayers();
    this.columns[5].cellClass = this.getCellClass;
    this.settings.rowClass = this.getRowClass;
    this.table = new DataTable(this.columns, this.settings);
    this.table.pager.perPage = 20;
  }

  ngOnInit() {
    this.table.events.onLoading(true);
    this.http.get('assets/players.json').subscribe(data => {
      this.table.rows = data;
      this.table.events.onLoading(false);
    });
  }

  getCellClass({row, column, value}): any {
    return {
      'cell-big-value': parseInt(value, 10) > 1000000000,
      'cell-middle-value': parseInt(value, 10) > 1000000 && parseInt(value, 10) < 1000000000,
      'cell-zero-value': parseInt(value, 10) === 0,
    };
  }

  getRowClass(row): any {
    return {
      'row-warrior': (row['player_class'] === 'WARRIOR'),
      'row-sorcerer': (row['player_class'] === 'SORCERER')
    };
  }

}

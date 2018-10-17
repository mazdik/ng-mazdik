import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Column, Settings, DataTable} from '../../ng-data-table';
import {getColumnsPlayers} from './columns';

@Component({
  selector: 'app-live-demo',
  template: `
    <button class="dt-button" style="margin-bottom: 5px;" (click)="stop=true">stop</button>
    <app-data-table [table]="table"></app-data-table>
  `
})

export class LiveDemoComponent implements OnInit {

  table: DataTable;
  columns: Column[];
  tempRows: any;
  stop: boolean;

  settings: Settings = <Settings>{
    sortable: false,
    filter: false,
    trackByProp: 'changed'
  };

  constructor(private http: HttpClient) {
    this.columns = getColumnsPlayers();
    for (const column of this.columns) {
      column.editable = false;
    }
    this.table = new DataTable(this.columns, this.settings);
  }

  ngOnInit() {
    this.table.events.onLoading(true);
    this.http.get('assets/players.json').subscribe((data: any[]) => {
       data = data.map(d => {
        d.changed = Date.now().toString();
        return d;
      });
      this.table.rows = data;
      this.table.events.onLoading(false);
      this.tempRows = [...data];
      this.updateRandom();
    });
  }

  randomNum(start: number, end: number): number {
    return Math.floor(Math.random() * end) + start;
  }

  updateRandom() {
    const rowIndex = this.randomNum(0, 10);
    const newRowIndex = this.randomNum(0, 20);
    const columnName1 = this.table.columns[this.randomNum(0, 7)].name;
    const columnName2 = this.table.columns[this.randomNum(0, 7)].name;

    if (this.tempRows.length) {
      this.tempRows[rowIndex][columnName1] = this.tempRows[newRowIndex][columnName1];
      this.tempRows[rowIndex][columnName2] = this.tempRows[newRowIndex][columnName2];
      this.tempRows[rowIndex].changed = Date.now().toString();
    }
    this.table.rows = [...this.tempRows];
    if (this.stop) {
      return;
    }
    setTimeout(this.updateRandom.bind(this), 500);
  }

}

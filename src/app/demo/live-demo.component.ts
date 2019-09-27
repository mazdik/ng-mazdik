import {Component, OnInit, OnDestroy} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Settings, DataTable} from 'ng-mazdik-lib';
import {getColumnsPlayers} from './columns';
import {Subscription, interval} from 'rxjs';

@Component({
  selector: 'app-live-demo',
  template: `
    <button class="dt-button" style="margin-bottom: 5px;" (click)="stop=!stop">{{stop ? 'start' : 'stop'}}</button>
    <app-data-table [table]="table"></app-data-table>
  `
})

export class LiveDemoComponent implements OnInit, OnDestroy {

  table: DataTable;
  tempRows: any;
  stop: boolean = false;

  settings: Settings = new Settings({
    sortable: false,
    filter: false,
  });
  private subInterval: Subscription;

  constructor(private http: HttpClient) {
    const columns = getColumnsPlayers();
    this.table = new DataTable(columns, this.settings);
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

      this.subInterval = interval(500).subscribe(x => {
        if (this.stop) {
          return;
        }
        this.updateRandom();
      });
    });
  }

  ngOnDestroy() {
    this.subInterval.unsubscribe();
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
  }

}

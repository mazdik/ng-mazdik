import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Settings, DataTable} from 'ng-mazdik-lib';
import {getColumnsPlayers} from './columns';

@Component({
  selector: 'app-header-demo',
  template: `
    <app-data-table [table]="table" class="header-demo">
      <ng-template dtHeaderTemplate>
        <div class="datatable-header-row" [style.height.px]="40" [style.transform]="translate3d()">
          <div class="datatable-header-cell dt-sticky" [style.width.px]="getWidth(0, 2)" [style.transform]="translate3dCell()">Group 1
          </div>
          <div class="datatable-header-cell" [style.width.px]="getWidth(2, 5)">Group 2</div>
          <div class="datatable-header-cell" [style.width.px]="getWidth(5, 8)">Group 3</div>
          <div class="datatable-header-cell" [style.width.px]="getWidth(8, 12)">Group 4</div>
          <div class="datatable-header-cell" [style.width.px]="getWidth(12, 17)">Group 5</div>
        </div>
      </ng-template>
    </app-data-table>
  `,
})

export class HeaderDemoComponent implements OnInit {

  table: DataTable;
  settings: Settings = new Settings({});

  constructor(private http: HttpClient) {
    const columns = getColumnsPlayers();
    columns.splice(17);
    this.table = new DataTable(columns, this.settings);
  }

  ngOnInit() {
    this.table.events.onLoading(true);
    this.http.get<any[]>('assets/players.json').subscribe(data => {
      this.table.rows = data;
      this.table.events.onLoading(false);
    });
  }

  getWidth(from: number, to: number) {
    let width = 0;
    for (let index = from; index < to; index++) {
      width += this.table.columns[index].width;
    }
    return width;
  }

  translate3d() {
    return `translate3d(${this.table.dimensions.offsetX * -1}px, 0, 0)`;
  }

  translate3dCell() {
    return `translate3d(${this.table.dimensions.offsetX}px, 0, 0)`;
  }

}

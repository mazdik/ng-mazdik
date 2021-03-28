import { Component, OnInit } from '@angular/core';
import { Settings, DataTable } from 'ng-mazdik-lib';
import { getColumnsPlayers } from './columns';

@Component({
  selector: 'app-column-group-demo',
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

export class ColumnGroupDemoComponent implements OnInit {

  table: DataTable;
  settings: Settings = new Settings({});

  constructor() {
    const columns = getColumnsPlayers();
    columns.splice(17);
    this.table = new DataTable(columns, this.settings);
  }

  ngOnInit(): void {
    this.table.events.onLoading(true);
    fetch('assets/players.json').then(res => res.json()).then(data => {
      this.table.rows = data;
      this.table.events.onLoading(false);
    });
  }

  getWidth(from: number, to: number): number {
    let width = 0;
    for (let index = from; index < to; index++) {
      width += this.table.columns[index].width;
    }
    return width;
  }

  translate3d(): string {
    return `translate3d(${this.table.dimensions.offsetX * -1}px, 0, 0)`;
  }

  translate3dCell(): string {
    return `translate3d(${this.table.dimensions.offsetX}px, 0, 0)`;
  }

}

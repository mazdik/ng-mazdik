import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Column, Settings, DataTable} from '../../ng-data-table';
import {getColumnsPlayers} from './columns';
import {DataAggregation} from '../../ng-data-table/base/data-aggregation';

@Component({
  selector: 'app-vertical-group-demo',
  template: `
  <div style="display: flex;">
    <div class="datatable vertical">
      <div class="datatable-header-cell"
          [style.width.px]="50"
          [style.height.px]="table.dimensions.headerRowHeight"
          style="border-right: none; border-left: 1px solid #c6c6c6;">
          <span class="column-title">Race</span>
      </div>
      <ng-container *ngFor="let key of raceGroupKeys()">
        <div class="datatable-body-cell"
          [style.width.px]="50"
          [style.height.px]="raceGroupHeight(key)"
          style="border-right: none; border-left: 1px solid #c6c6c6; justify-content: center;">
          <div class="cell-data">{{key}}</div>
        </div>
      </ng-container>
    </div>
    <div class="datatable vertical">
      <div class="datatable-header-cell"
          [style.width.px]="50"
          [style.height.px]="table.dimensions.headerRowHeight"
          style="border-right: none; border-left: 1px solid #c6c6c6;">
          <span class="column-title">Gender</span>
      </div>
      <ng-container *ngFor="let key of genderGroupKeys()">
        <div class="datatable-body-cell"
          [style.width.px]="50"
          [style.height.px]="genderGroupHeight(key)"
          style="border-right: none; border-left: 1px solid #c6c6c6; justify-content: center;">
          <div class="cell-data">{{genderName(key)}}</div>
        </div>
      </ng-container>
    </div>
    <app-data-table [table]="table"></app-data-table>
  </div>
  `,
  styles: [
    'app-data-table .datatable-row-left {z-index: auto;}',
    '.vertical .cell-data {transform: rotate(-90deg); overflow: visible;}'
  ],
  encapsulation: ViewEncapsulation.None,
})

export class VerticalGroupDemoComponent implements OnInit {

  table: DataTable;
  columns: Column[];
  settings: Settings = <Settings>{};

  private raceGroupMetadata: any;
  private genderGroupMetadata: any;
  private dataAggregation: DataAggregation;

  constructor(private http: HttpClient) {
    this.columns = getColumnsPlayers();
    this.columns[2].tableHidden = true;
    this.columns[4].tableHidden = true;
    this.table = new DataTable(this.columns, this.settings);
    this.table.pager.perPage = 50;
    this.dataAggregation = new DataAggregation();
  }

  ngOnInit() {
    this.table.events.onLoading(true);
    this.http.get<any[]>('assets/players.json').subscribe(data => {
      this.table.sorter.multiple = true;
      this.table.sorter.set(['race', 'gender']);
      this.table.rows = this.table.sorter.sortRows(data);
      this.table.sorter.set(['race', 'gender']);
      this.raceGroupMetadata = this.dataAggregation.groupMetaData(this.table.rows, ['race']);
      this.genderGroupMetadata = this.dataAggregation.groupMetaData(this.table.rows, ['race', 'gender']);
      this.table.events.onLoading(false);
    });
  }

  raceGroupKeys() {
    if (this.raceGroupMetadata) {
      return Object.keys(this.raceGroupMetadata);
    }
  }

  raceGroupHeight(key: string) {
    return this.table.dimensions.rowHeight * this.raceGroupMetadata[key].size;
  }

  genderGroupKeys() {
    if (this.genderGroupMetadata) {
      return Object.keys(this.genderGroupMetadata);
    }
  }

  genderGroupHeight(key: string) {
    return this.table.dimensions.rowHeight * this.genderGroupMetadata[key].size;
  }

  genderName(key) {
    return key.split(',')[1];
  }

}

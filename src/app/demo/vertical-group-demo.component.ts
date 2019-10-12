import {Component, OnInit, OnDestroy, ViewEncapsulation, ViewChild, ElementRef} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Settings, DataTable, GroupMetadata, DataAggregation} from 'ng-mazdik-lib';
import {getColumnsPlayers} from './columns';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-vertical-group-demo',
  template: `
  <div class="vertical-group-demo">
    <div class="datatable vertical">
      <div class="datatable-header-cell"
          [style.height.px]="table.dimensions.headerRowHeight"
          style="border-right: none; border-left: 1px solid #c6c6c6;">
          <span class="column-title">Race</span>
      </div>
      <div #dtv1 class="datatable-body" [style.height.px]="table.dimensions.bodyHeight">
        <ng-container *ngFor="let key of raceGroupKeys()">
          <div class="datatable-body-cell"
            [style.height.px]="raceGroupHeight(key)"
            style="border-right: none; border-left: 1px solid #c6c6c6; justify-content: center;">
            <div class="cell-data">{{key}}</div>
          </div>
        </ng-container>
      </div>
    </div>
    <div class="datatable vertical">
      <div class="datatable-header-cell"
          [style.height.px]="table.dimensions.headerRowHeight"
          style="border-right: none; border-left: 1px solid #c6c6c6;">
          <span class="column-title">Gender</span>
      </div>
      <div #dtv2 class="datatable-body" [style.height.px]="table.dimensions.bodyHeight">
        <ng-container *ngFor="let key of genderGroupKeys()">
          <div class="datatable-body-cell"
            [style.height.px]="genderGroupHeight(key)"
            style="border-right: none; border-left: 1px solid #c6c6c6; justify-content: center;">
            <div class="cell-data">{{genderName(key)}}</div>
          </div>
        </ng-container>
      </div>
    </div>
    <app-data-table class="tab2" [table]="table"></app-data-table>
  </div>
  `,
  styles: [`
    .vertical-group-demo {display: flex;}
    .vertical-group-demo .tab2 {overflow-x: auto;}
    .vertical .cell-data {transform: rotate(-90deg); overflow: visible;}
    .vertical .datatable-header-cell, .vertical .datatable-body-cell {width: 50px;}
    .vertical .datatable-body {overflow-y: hidden; overflow-x: scroll}`,
  ],
  encapsulation: ViewEncapsulation.None,
})

export class VerticalGroupDemoComponent implements OnInit, OnDestroy {

  table: DataTable;
  settings: Settings = new Settings({
    headerRowHeight: 40,
    bodyHeight: 380,
    filter: false,
  });

  @ViewChild('dtv1', {static: true}) dtv1: ElementRef;
  @ViewChild('dtv2', {static: true}) dtv2: ElementRef;

  private raceGroupMetadata: GroupMetadata;
  private genderGroupMetadata: GroupMetadata;
  private dataAggregation: DataAggregation;
  private subscriptions: Subscription[] = [];

  constructor(private http: HttpClient) {
    const columns = getColumnsPlayers();
    columns[2].tableHidden = true;
    columns[4].tableHidden = true;
    this.table = new DataTable(columns, this.settings);
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

    const subScroll = this.table.events.scrollSource$.subscribe(() => {
      requestAnimationFrame(() => {
        this.dtv1.nativeElement.scrollTop = this.table.dimensions.offsetY;
        this.dtv2.nativeElement.scrollTop = this.table.dimensions.offsetY;
      });
    });
    this.subscriptions.push(subScroll);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
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

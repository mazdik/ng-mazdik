import {Component, OnInit, OnDestroy, AfterViewInit, ViewChild, ElementRef} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Settings, DataTable} from 'ng-mazdik-lib';
import {getColumnsPlayers} from './columns';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-frozen-table-demo',
  template: `
  <div class="frozen-table-demo">
    <div class="datatable frozen">
      <div class="datatable-header">
        <div class="datatable-header-row">
          <div class="datatable-header-cell" style="width: 200px;">
            <span class="column-title">Race</span>
          </div>
          <div class="datatable-header-cell" style="width: 200px;">
            <span class="column-title">Gender</span>
          </div>
        </div>
      </div>
      <div class="datatable-body">
        <div #dtv1 class="dt-scroller" [style.height.px]="table.dimensions.bodyHeight">
          <ng-container *ngFor="let row of table.rows; trackBy: rowTrackingFn">
            <div class="datatable-body-row" style="height: 30px;">
              <div class="datatable-body-cell" style="width: 200px;">
                {{row['race']}}
              </div>
              <div class="datatable-body-cell" style="width: 200px;">
                {{row['gender']}}
              </div>
            </div>
          </ng-container>
        </div>
      </div>
    </div>
    <app-data-table class="tab2" [table]="table"></app-data-table>
  </div>
  `,
})

export class FrozenTableDemoComponent implements OnInit, AfterViewInit, OnDestroy {

  table: DataTable;
  settings: Settings = new Settings({
    bodyHeight: 380,
  });

  @ViewChild('dtv1', {static: false}) dtv1: ElementRef;

  private subscriptions: Subscription[] = [];
  rowTrackingFn = (index: number, row: any) => (this.table.settings.trackByProp) ? row[this.table.settings.trackByProp] : index;

  constructor(private http: HttpClient) {
    const columns = getColumnsPlayers();
    columns.forEach(x => x.frozen = false);
    columns[2].tableHidden = true;
    columns[4].tableHidden = true;
    this.table = new DataTable(columns, this.settings);
    this.table.pager.perPage = 50;
  }

  ngOnInit() {
    this.table.events.onLoading(true);
    this.http.get<any[]>('assets/players.json').subscribe(data => {
      this.table.rows = data;
      this.table.events.onLoading(false);
    });
  }

  ngAfterViewInit() {
    const subScroll = this.table.events.scrollSource$.subscribe(() => {
      requestAnimationFrame(() => {
        this.dtv1.nativeElement.scrollTop = this.table.dimensions.offsetY;
      });
    });
    this.subscriptions.push(subScroll);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

}

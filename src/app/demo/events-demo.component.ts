import {Component, OnInit, OnDestroy, ChangeDetectorRef} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Column, Settings, DataTable} from '../../ng-data-table';
import {getColumnsPlayers} from './columns';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-events-demo',
  template: `
    <app-data-table [table]="table"></app-data-table>
    <div class="df-alert df-alert-success" style="word-break: break-all;" *ngIf="cellValueChangedEvent">
      <b>cellValueChanged:</b> {{cellValueChangedEvent}}
    </div><br>
    <div class="df-alert df-alert-success" style="word-break: break-all;">
      <b>{{eventName}}:</b> {{eventValue}}
    </div>
  `,
  styleUrls: ['../../ng-crud-table/styles/alerts.css'],
})

export class EventsDemoComponent implements OnInit, OnDestroy {

  table: DataTable;
  columns: Column[];

  settings: Settings = <Settings>{
    clientSide: true,
    hoverEvents: true,
    contextMenu: true,
  };
  eventName: string = 'Event name';
  eventValue: any = 'event value';
  cellValueChangedEvent: any;

  private subscriptions: Subscription[] = [];

  constructor(private http: HttpClient, private cd: ChangeDetectorRef) {
    this.columns = getColumnsPlayers();
    this.table = new DataTable(this.columns, this.settings);
  }

  ngOnInit() {
    this.table.events.onLoading(true);
    this.http.get('assets/players.json').subscribe(data => {
      this.table.rows = data;
      this.table.events.onLoading(false);
    });

    const subMouseover = this.table.events.mouseoverSource$.subscribe((data) => {
      this.printEvent('mouseove', data);
    });
    const subMouseout = this.table.events.mouseoutSource$.subscribe((data) => {
      this.printEvent('mouseout', data);
    });
    const subContextMenu = this.table.events.contextMenuSource$.subscribe((data) => {
      this.printEvent('contextmenu', data);
    });
    const subCellValueChanged = this.table.events.cellValueChangedSource$.subscribe((data) => {
      this.cellValueChangedEvent = JSON.stringify(data);
    });
    this.subscriptions.push(subMouseover);
    this.subscriptions.push(subMouseout);
    this.subscriptions.push(subContextMenu);
    this.subscriptions.push(subCellValueChanged);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  printEvent(name: string, event: any) {
    this.eventName = name;
    if (this.eventName === 'mouseout') {
      this.eventValue = JSON.stringify(event);
    } else {
      const columnName = this.table.columns[event.columnIndex].name;
      const row = this.table.rows[event.rowIndex];
      this.eventValue = JSON.stringify({columnName, row});
    }
    this.cd.detectChanges();
    console.log(name, event);
  }

}

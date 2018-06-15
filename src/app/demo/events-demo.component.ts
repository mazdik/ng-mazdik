import {Component, OnInit, OnDestroy, ChangeDetectorRef} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Column, Settings, DataTable} from '../../ng-crud-table';
import {getColumnsPlayers} from './columns';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-events-demo',
  template: `
    <app-datatable [table]="table"></app-datatable>
    <div class="df-alert df-alert-success" style="word-break: break-all;">
    <b>{{eventName}}:</b> {{eventValue}}</div>
  `
})

export class EventsDemoComponent implements OnInit, OnDestroy {

  public table: DataTable;
  public columns: Column[];

  public settings: Settings = <Settings>{
    clientSide: true,
    hoverEvents: true,
    contextMenu: true,
  };
  public eventName: string = 'Event name';
  public eventValue: any = 'event value';
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
    this.subscriptions.push(subMouseover);
    this.subscriptions.push(subMouseout);
    this.subscriptions.push(subContextMenu);
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

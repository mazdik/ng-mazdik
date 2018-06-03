import {Component, OnInit, OnDestroy} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Column, Settings, DataTable} from '../../ng-crud-table';
import {getColumnsPlayers} from './columns';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-events-demo',
  template: `
    <app-datatable [table]="table" [loading]="loading"></app-datatable>
  `
})

export class EventsDemoComponent implements OnInit, OnDestroy {

  public table: DataTable;
  public columns: Column[];
  public loading: boolean;

  public settings: Settings = <Settings>{
    clientSide: true,
    hoverEvents: true,
  };
  private subscriptions: Subscription[] = [];

  constructor(private http: HttpClient) {
    this.columns = getColumnsPlayers();
    this.table = new DataTable(this.columns, this.settings);
  }

  ngOnInit() {
    this.loading = true;
    this.http.get('assets/players.json').subscribe(data => {
      this.table.rows = data;
      this.loading = false;
    });

    const subMouseover = this.table.dataService.mouseoverSource$.subscribe((data) => {
      this.printEvent('mouseove', data);
    });
    const subMouseout = this.table.dataService.mouseoutSource$.subscribe((data) => {
      this.printEvent('mouseout', data);
    });
    this.subscriptions.push(subMouseover);
    this.subscriptions.push(subMouseout);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  printEvent(name: string, event: any) {
    console.log(name, event);
  }

}

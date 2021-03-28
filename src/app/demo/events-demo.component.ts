import { Component, OnInit, OnDestroy, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { Settings, DataTable, CellEventType, EventHelper } from 'ng-mazdik-lib';
import { getColumnsPlayers } from './columns';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-events-demo',
  template: `
  <div style="position: relative;">
    <div #tooltip class="tooltip">
      <b>{{this.eventName}}</b>: {{this.eventValue}}
    </div>
    <app-data-table [table]="table"></app-data-table>
    <div class="dt-message dt-message-success" style="word-break: break-all;">
      <b>{{this.eventName}}:</b> {{this.eventValue}}
    </div>
  </div>
  `,
})

export class EventsDemoComponent implements OnInit, OnDestroy {

  table: DataTable;

  settings: Settings = new Settings({
    hoverEvents: true,
    contextMenu: true,
  });
  eventName = 'Event name';
  eventValue: any = 'event value';
  timer: any;
  @ViewChild('tooltip', { static: false }) tooltip: ElementRef;

  private subscriptions: Subscription[] = [];

  constructor(private cd: ChangeDetectorRef) {
    const columns = getColumnsPlayers();
    this.table = new DataTable(columns, this.settings);
  }

  ngOnInit(): void {
    this.table.events.onLoading(true);
    fetch('assets/players.json').then(res => res.json()).then(data => {
      this.table.rows = data;
      this.table.events.onLoading(false);
    });

    const subCell = this.table.events.cellSource$.subscribe((data) => {
      if (data.type === CellEventType.ContextMenu) {
        this.printEvent('contextmenu', data);
      }
      if (data.type === CellEventType.Mouseover) {
        this.printEvent('mouseover', data);
        if (this.timer) {
          clearTimeout(this.timer);
        }
        this.timer = setTimeout(() => {
          this.showTooltip(data.event);
          this.timer = null;
        }, 700);
      }
      if (data.type === CellEventType.Mouseout) {
        this.hideTooltip();
      }
    });
    this.subscriptions.push(subCell);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  printEvent(name: string, event: any): void {
    this.eventName = name;
    const columnName = this.table.columns[event.columnIndex].name;
    const cell = this.table.rows[event.rowIndex][columnName];
    this.eventValue = JSON.stringify({ columnName, cell }, null, 2);
    this.cd.detectChanges();
  }

  showTooltip(event: MouseEvent): void {
    const { left, top } = EventHelper.getRowPosition(event);
    this.tooltip.nativeElement.style.left = left + 'px';
    this.tooltip.nativeElement.style.top = top + 'px';
    this.tooltip.nativeElement.style.visibility = 'visible';
  }

  hideTooltip(): void {
    this.tooltip.nativeElement.style.visibility = 'hidden';
  }

}

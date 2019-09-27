import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Settings, DataTable} from 'ng-mazdik-lib';
import {getColumnsPlayers} from './columns';

@Component({
  selector: 'app-multiple-selection-demo',
  template: `<button class="dt-button" (click)="clearSelection()">Clear all selections</button>
    <p>Selection type: multiple. Selection mode: checkbox</p>
    <app-data-table [table]="table" (selectionChange)="onSelection()"></app-data-table>
    <div class="dt-message dt-message-success" style="margin-right:5px;"
                *ngFor="let row of selectedRows">
                {{row.id + '-' + row.name}}
    </div>
    <p>Selection type: multiple. Selection mode: radio</p>
    <app-data-table [table]="table2" (selectionChange)="onSelection2()"></app-data-table>
    <div class="dt-message dt-message-success" style="margin-right:5px;"
                *ngFor="let row of selectedRows2">
                {{row.id + '-' + row.name}}
    </div>
  `
})

export class MultipleSelectionDemoComponent implements OnInit {

  table: DataTable;
  table2: DataTable;
  selectedRows: any[];
  selectedRows2: any[];

  settings: Settings = new Settings({
    selectionMultiple: true,
    selectionMode: 'checkbox',
  });

  settings2: Settings = new Settings({
    selectionMultiple: true,
    selectionMode: 'radio',
  });

  constructor(private http: HttpClient) {
    const columns = getColumnsPlayers();
    const columns2 = getColumnsPlayers();
    this.table = new DataTable(columns, this.settings);
    this.table2 = new DataTable(columns2, this.settings2);
  }

  ngOnInit() {
    this.table.events.onLoading(true);
    this.http.get<any[]>('assets/players.json').subscribe(data => {
      this.table.rows = data;
      this.table2.rows = data;
      this.table.events.onLoading(false);
    });
  }

  onSelection() {
    this.selectedRows = this.table.getSelection();
  }

  onSelection2() {
    this.selectedRows2 = this.table2.getSelection();
  }

  clearSelection() {
    this.table.selection.clearSelection();
    this.table2.selection.clearSelection();
  }

}

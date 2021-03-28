import { Component, OnInit } from '@angular/core';
import { Settings, DataTable } from 'ng-mazdik-lib';
import { getColumnsPlayers } from './columns';

@Component({
  selector: 'app-multiple-selection-demo',
  template: `<button class="dt-button" (click)="clearSelection()">Clear all selections</button>
    <p>Selection type: multiple. Selection mode: checkbox</p>
    <app-data-table [table]="table"></app-data-table>
    <p>Selection type: multiple. Selection mode: radio</p>
    <app-data-table [table]="table2"></app-data-table>
  `
})

export class MultipleSelectionDemoComponent implements OnInit {

  table: DataTable;
  table2: DataTable;

  settings: Settings = new Settings({
    selectionMultiple: true,
    selectionMode: 'checkbox',
  });

  settings2: Settings = new Settings({
    selectionMultiple: true,
    selectionMode: 'radio',
  });

  constructor() {
    const columns = getColumnsPlayers();
    const columns2 = getColumnsPlayers();
    this.table = new DataTable(columns, this.settings);
    this.table2 = new DataTable(columns2, this.settings2);
  }

  ngOnInit(): void {
    this.table.events.onLoading(true);
    fetch('assets/players.json').then(res => res.json()).then(data => {
      this.table.rows = data;
      this.table2.rows = data;
      this.table.events.onLoading(false);
    });
  }

  clearSelection(): void {
    this.table.selection.clearSelection();
    this.table2.selection.clearSelection();
  }

}

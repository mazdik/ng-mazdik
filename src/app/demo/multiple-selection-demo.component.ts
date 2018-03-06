import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Column, Settings, DataTable} from '../../ng-crud-table';
import {getColumnsPlayers} from './columns';

@Component({
  selector: 'app-multiple-selection-demo',
  template: `<p>Selection type: multiple. Selection mode: checkbox</p>
    <app-datatable [table]="table" [loading]="loading" (selectionChange)="onSelection()"></app-datatable>
    <div class="df-alert df-alert-success" style="margin-right:5px;" *ngFor="let row of selectedRows">
      {{row.id}}-{{row.name}}</div>
    <p>Selection type: multiple. Selection mode: radio</p>
    <app-datatable [table]="table2" [loading]="loading" (selectionChange)="onSelection2()"></app-datatable>
    <div class="df-alert df-alert-success" style="margin-right:5px;" *ngFor="let row of selectedRows2">
      {{row.id}}-{{row.name}}</div>
  `
})

export class MultipleSelectionDemoComponent implements OnInit {

  public table: DataTable;
  public table2: DataTable;
  public columns: Column[];
  public loading: boolean;
  public selectedRows: any[];
  public selectedRows2: any[];

  public settings: Settings = {
    api: null,
    crud: true,
    primaryKeys: ['id'],
    selectionType: 'multiple',
    selectionMode: 'checkbox',
  };

  public settings2: Settings = {
    api: null,
    crud: true,
    primaryKeys: ['id'],
    selectionType: 'multiple',
    selectionMode: 'radio',
  };

  constructor(private http: HttpClient) {
    this.columns = getColumnsPlayers();
    for (const column of this.columns) {
      column.editable = false;
    }

    this.table = new DataTable(this.columns, this.settings);
    this.table2 = new DataTable(this.columns, this.settings2);
  }

  ngOnInit() {
    this.loading = true;
    this.http.get('assets/players.json').subscribe(data => {
      this.table.rows = data;
      this.table2.rows = data;
      this.loading = false;
    });
  }

  onSelection() {
    this.selectedRows = this.table.dataSelection.getSelectedRows(this.table.rows);
  }

  onSelection2() {
    this.selectedRows2 = this.table2.dataSelection.getSelectedRows(this.table2.rows);
  }

}

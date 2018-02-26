import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Column, Settings, DataTable} from '../../ng-crud-table';
import {getColumnsPlayers} from './columns';

@Component({
  selector: 'app-multiple-selection-demo',
  template: `
    <app-datatable [table]="table" [loading]="loading" (selectionChange)="onSelection()"></app-datatable>
    <div class="df-alert df-alert-success" style="margin-right:5px;" *ngFor="let row of selectedRows">
      {{row.id}}-{{row.name}}</div>
  `
})

export class MultipleSelectionDemoComponent implements OnInit {

  public table: DataTable;
  public columns: Column[];
  public loading: boolean;
  public selectedRows: any[];

  public settings: Settings = {
    api: null,
    crud: true,
    primaryKeys: ['id'],
    selectionType: 'multiple',
  };

  constructor(private http: HttpClient) {
    this.columns = getColumnsPlayers();
    for (const column of this.columns) {
      column.editable = false;
    }

    this.table = new DataTable(this.columns, this.settings);
  }

  ngOnInit() {
    this.loading = true;
    this.http.get('assets/players.json').subscribe(data => {
      this.table.rows = data;
      this.loading = false;
    });
  }

  onSelection() {
    this.selectedRows = this.table.dataSelection.getSelectedRows(this.table.rows);
  }

}

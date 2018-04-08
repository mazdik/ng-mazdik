import {Component, OnInit, ViewChild, TemplateRef} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Column, Settings, DataTable} from '../../ng-crud-table';
import {getColumnsPlayers} from './columns';

@Component({
  selector: 'app-header-demo',
  template: `
    <app-datatable [table]="table" [loading]="loading"></app-datatable>
    <ng-template #template>
    <div class="datatable-header-inner">
    <div class="datatable-row-left">
            <div class="datatable-header-cell" [style.width.px]="getWidth(0, 2)">Group 1</div>
        </div>
        <div class="datatable-row-center" [style.transform]="translate3d()">
            <div class="datatable-header-cell" [style.width.px]="getWidth(2, 5)">Group 2</div>
            <div class="datatable-header-cell" [style.width.px]="getWidth(5, 8)">Group 3</div>
            <div class="datatable-header-cell" [style.width.px]="getWidth(8, 12)">Group 4</div>
            <div class="datatable-header-cell" [style.width.px]="getWidth(12, 17)">Group 5</div>
        </div>
  </div>
    </ng-template>
  `,
  styles: ['.datatable-header-cell {justify-content: center;}']
})

export class HeaderDemoComponent implements OnInit {

  public table: DataTable;
  public columns: Column[];
  public loading: boolean;
  public settings: Settings = {};
  @ViewChild('template') template: TemplateRef<any>;

  constructor(private http: HttpClient) {
    this.columns = getColumnsPlayers();
    this.columns.splice(17);
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
    this.table.settings.headerTemplate = this.template;
  }

  getWidth(from: number, to: number) {
    let width = (from === 0) ? 40 : 0;
    for (let index = from; index < to; index++) {
      width += this.table.columns[index].width;
    }
    return width;
  }

  translate3d() {
    return `translate3d(${this.table.offsetX * -1}px, 0, 0)`;
  }

}

import {Component, OnInit, ViewChild, TemplateRef} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Column, Settings, DataTable} from '../../ng-data-table';
import {getColumnsPlayers} from './columns';

@Component({
  selector: 'app-header-demo',
  template: `
    <app-data-table [table]="table"></app-data-table>
    <ng-template #template>
    <div class="datatable-header-row">
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

  table: DataTable;
  columns: Column[];
  settings: Settings = <Settings>{};
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
    this.table.events.onLoading(true);
    this.http.get('assets/players.json').subscribe(data => {
      this.table.rows = data;
      this.table.events.onLoading(false);
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
    return `translate3d(${this.table.dimensions.offsetX * -1}px, 0, 0)`;
  }

}

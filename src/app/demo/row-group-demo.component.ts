import {Component, OnInit, ViewChild, TemplateRef} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Column, Settings, DataTable} from '../../lib/ng-data-table';
import {getColumnsPlayers} from './columns';

@Component({
  selector: 'app-row-group-demo',
  template: `
    <app-data-table [table]="table"></app-data-table>
    <ng-template #rowGroupTemplate let-row="row">
      <div class="datatable-body-cell" (click)="onExpand(row)">
        <i [class]="getExpanderIcon(row)"></i>
        {{table.rowGroup.getRowGroupName(row)}} ({{table.rowGroup.getRowGroupSize(row)}})
      </div>
    </ng-template>
  `
})

export class RowGroupDemoComponent implements OnInit {

  table: DataTable;
  columns: Column[];

  settings: Settings = <Settings>{
    groupRowsBy: ['race'],
    rowHeightProp: '$$height',
  };
  @ViewChild('rowGroupTemplate') rowGroupTemplate: TemplateRef<any>;

  constructor(private http: HttpClient) {
    this.columns = getColumnsPlayers();
    this.table = new DataTable(this.columns, this.settings);
    this.table.pager.perPage = 50;
  }

  ngOnInit() {
    this.table.settings.rowGroupTemplate = this.rowGroupTemplate;
    this.table.events.onLoading(true);
    this.http.get<any[]>('assets/players.json').subscribe(data => {
      data.forEach(x => x.expanded = true)
      this.table.rows = data;
      this.table.events.onLoading(false);
    });
  }

  onExpand(row: any) {
    row.expanded = !row.expanded;
    if (!row.expanded) {
      const descendants = this.table.rowGroup.getGroupRows(row, this.table.rows);
      descendants.forEach(x => x.$$height = 0);
    } else {
      const descendants = this.table.rowGroup.getGroupRows(row, this.table.rows);
      descendants.forEach(x => x.$$height = null);
    }
  }

  getExpanderIcon(row: any) {
    return (!row.expanded) ? 'dt-icon-node dt-icon-collapsed' : 'dt-icon-node';
  }

}

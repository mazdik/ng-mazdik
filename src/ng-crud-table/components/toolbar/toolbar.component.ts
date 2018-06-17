import { Component, Input, Output, EventEmitter, HostBinding } from '@angular/core';
import { DataTable } from '../../base';

@Component({
    selector: 'app-datatable-toolbar',
    templateUrl: './toolbar.component.html',
})
export class ToolbarComponent {

    @Input() public table: DataTable;
    @Output() createAction: EventEmitter<any> = new EventEmitter();

    @HostBinding('class') cssClass = 'datatable-toolbar';

    constructor() {
    }

    globalFilter() {
        this.table.dataFilter.filters = {};
        this.table.dataFilter.isGlobal = true;
        this.table.events.onFilter();
      }

      onClickGlobalSearch() {
        this.globalFilter();
      }

      onKeyPressGlobalSearch(event: KeyboardEvent) {
        if (event.which === 13) {
          this.globalFilter();
        }
      }

    downloadCsv() {
        this.table.export.downloadCSV(this.table.rows, null);
    }

    createActionClick() {
        this.createAction.emit();
    }

}

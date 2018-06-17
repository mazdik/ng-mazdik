import { Component, Input, HostBinding } from '@angular/core';
import { DataTable } from '../../base';

@Component({
    selector: 'app-datatable-toolbar',
    template: `
  <div class="df-col">
    <button class="button" (click)="downloadCsv()">{{table.messages.export}}</button>
  </div>
  `
})
export class ToolbarComponent {

    @Input() public table: DataTable;
    @HostBinding('class') cssClass = 'datatable-toolbar';

    constructor() {
    }

    downloadCsv() {
        this.table.export.downloadCSV(this.table.rows, null);
    }

}

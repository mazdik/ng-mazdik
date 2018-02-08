import {Component, Input, HostBinding} from '@angular/core';
import {DataTable} from '../models/data-table';

@Component({
  selector: 'app-datatable-footer',
  templateUrl: './footer.component.html',
})
export class FooterComponent {

  @Input() public table: DataTable;

  @HostBinding('class') cssClass = 'datatable-footer';

  onPageChanged(event) {
    this.table.pager.current = event;
    this.table.dataService.onPage();
  }

}

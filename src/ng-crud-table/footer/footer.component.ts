import {Component, Output, EventEmitter, Input, ChangeDetectionStrategy, HostBinding} from '@angular/core';
import {DataTable} from '../models/data-table';

@Component({
  selector: 'app-datatable-footer',
  templateUrl: './footer.component.html',
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class FooterComponent {

  @Input() public table: DataTable;
  @Output() pageChanged: EventEmitter<any> = new EventEmitter();

  @HostBinding('class') cssClass = 'datatable-footer';

  onPageChanged(event) {
    this.pageChanged.emit(event);
    this.table.pager.current = event;
  }

}

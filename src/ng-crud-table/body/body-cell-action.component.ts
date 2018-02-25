import {
  Component, Input, HostBinding, ChangeDetectionStrategy, ChangeDetectorRef
} from '@angular/core';
import {DataTable} from '../base/data-table';
import {MenuItem} from '../types';

@Component({
  selector: 'app-datatable-body-cell-action',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ng-template ngFor let-action [ngForOf]="table.actionMenu">
        <span class="row-menu"
              [ngClass]="action.icon"
              *ngIf="!action.disabled"
              title="{{action.label}}"
              (click)="actionClick($event, action, rowIndex)">
        </span>
    </ng-template>
    <span *ngIf="!table.actionMenu">{{rowIndex + 1}}</span>
    <label *ngIf="false">
      <input type="checkbox"
             [checked]="isSelected()"
             (click)="onCheckboxChange($event)"/>
      <span></span>
    </label>
  `
})
export class BodyCellActionComponent {

  @Input() public table: DataTable;
  @Input() public rowIndex: number;

  @HostBinding('class') cssClass = 'datatable-body-cell action-column';

  @HostBinding('style.width.px')
  get width(): number {
    return this.table.actionColumnWidth;
  }

  constructor(private cd: ChangeDetectorRef) {
  }

  actionClick(event, menuItem: MenuItem, rowIndex: number) {
    this.table.selectRow(rowIndex);
    this.table.dataService.onRowMenuClick({'event': event, 'menuItem': menuItem, 'rowIndex': rowIndex});
  }

  isSelected() {
    return this.table.dataSelection.isRowSelected(this.rowIndex);
  }

  onCheckboxChange(event) {
  }

}

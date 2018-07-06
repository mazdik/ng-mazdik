import {
  Component, Input, HostBinding, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef
} from '@angular/core';
import {DataTable} from '../../base';
import {MenuItem, Row} from '../../types';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-datatable-body-cell-action',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ng-template ngFor let-action [ngForOf]="table.actionMenu">
        <span class="row-menu"
              [ngClass]="action.icon"
              *ngIf="!action.disabled"
              title="{{action.label}}"
              (click)="actionClick($event, action)">
        </span>
    </ng-template>
    <span *ngIf="!table.actionMenu && !table.settings.selectionMode && table.settings.rowNumber">
    {{row.$$index + 1}}</span>
    <span *ngIf="table.settings.selectionMode"
          class="{{'datatable-' + table.settings.selectionMode}}">
      <input [type]="table.settings.selectionMode"
             [checked]="checked"
             (click)="onCheckboxClick($event)"/>
    </span>
  `
})
export class BodyCellActionComponent implements OnInit, OnDestroy {

  @Input() public table: DataTable;
  @Input() public row: Row;

  @HostBinding('class') cssClass = 'datatable-body-cell action-cell';

  @HostBinding('style.width.px')
  get width(): number {
    return this.table.dimensions.actionColumnWidth;
  }

  public checked: boolean;
  private subscriptions: Subscription[] = [];

  constructor(private cd: ChangeDetectorRef) {
  }

  ngOnInit() {
    const subSelection = this.table.events.selectionSource$.subscribe(() => {
      this.checked = this.table.selection.isRowSelected(this.row.$$index);
      this.cd.markForCheck();
    });
    this.subscriptions.push(subSelection);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  actionClick(event, menuItem: MenuItem) {
    this.table.selectRow(this.row.$$index);
    this.table.events.onRowMenuClick({'event': event, 'menuItem': menuItem, 'row': this.row});
  }

  onCheckboxClick(event) {
    this.table.selectRow(this.row.$$index);
  }

}

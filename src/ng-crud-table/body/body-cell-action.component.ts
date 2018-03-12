import {
  Component, Input, HostBinding, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef
} from '@angular/core';
import {DataTable} from '../base/data-table';
import {MenuItem} from '../types';
import {Subscription} from 'rxjs/Subscription';

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
    <span *ngIf="!table.actionMenu && !table.settings.selectionMode">{{rowIndex + 1}}</span>
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
  @Input() public rowIndex: number;

  @HostBinding('class') cssClass = 'datatable-body-cell action-column';

  @HostBinding('style.width.px')
  get width(): number {
    return this.table.dimensions.actionColumnWidth;
  }

  public checked: boolean;
  private subscriptions: Subscription[] = [];

  constructor(private cd: ChangeDetectorRef) {
  }

  ngOnInit() {
    const subSelection = this.table.dataService.selectionSource$.subscribe(() => {
      this.checked = this.table.dataSelection.isRowSelected(this.rowIndex);
      this.cd.markForCheck();
    });
    this.subscriptions.push(subSelection);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  actionClick(event, menuItem: MenuItem, rowIndex: number) {
    this.table.selectRow(rowIndex);
    this.table.dataService.onRowMenuClick({'event': event, 'menuItem': menuItem, 'rowIndex': rowIndex});
  }

  onCheckboxClick(event) {

  }

}

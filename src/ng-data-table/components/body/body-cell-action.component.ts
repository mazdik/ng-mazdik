import {
  Component, Input, HostBinding, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef, ViewChild, ViewContainerRef
} from '@angular/core';
import {DataTable} from '../../base';
import {Row} from '../../types';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-datatable-body-cell-action',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span *ngIf="!table.settings.rowActionTemplate && !table.settings.selectionMode
     && table.settings.rowNumber && table.dimensions.actionColumnWidth">
    {{row.$$index + 1}}</span>
    <span *ngIf="table.settings.selectionMode && table.dimensions.actionColumnWidth"
          class="{{'datatable-' + table.settings.selectionMode}}">
      <input [type]="table.settings.selectionMode"
             [checked]="checked"
             (click)="onCheckboxClick($event)"/>
    </span>
    <ng-template #rowActionTemplate
                 *ngIf="table.settings.rowActionTemplate && table.dimensions.actionColumnWidth"
                 [ngTemplateOutlet]="table.settings.rowActionTemplate"
                 [ngTemplateOutletContext]="cellContext">
    </ng-template>
  `
})
export class BodyCellActionComponent implements OnInit, OnDestroy {

  @Input() public table: DataTable;

  @Input()
  set row(row: Row) {
    this._row = row;
    this.cellContext.row = row;
  }

  get row(): Row {
    return this._row;
  }

  @HostBinding('class') cssClass = 'datatable-body-cell action-cell';

  @HostBinding('style.width.px')
  get width(): number {
    return this.table.dimensions.actionColumnWidth;
  }

  @ViewChild('rowActionTemplate', {read: ViewContainerRef}) rowActionTemplate: ViewContainerRef;

  public checked: boolean;
  public cellContext: any = {row: this.row};
  private _row: Row;
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
    if (this.rowActionTemplate) {
      this.rowActionTemplate.clear();
    }
  }

  onCheckboxClick(event) {
    this.table.selectRow(this.row.$$index);
  }

}

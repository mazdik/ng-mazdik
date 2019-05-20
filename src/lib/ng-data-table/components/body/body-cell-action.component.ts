import {
  Component, Input, HostBinding, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef
} from '@angular/core';
import {DataTable, Row} from '../../base';
import {Subscription} from 'rxjs';
import {isBlank} from '../../../common/utils';
import {RowActionTemplateDirective} from '../../directives/row-action-template.directive';

@Component({
  selector: 'dt-body-cell-action',
  templateUrl: 'body-cell-action.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BodyCellActionComponent implements OnInit, OnDestroy {

  @Input() table: DataTable;
  @Input() row: Row;
  @Input() rowActionTemplate: RowActionTemplateDirective;

  @HostBinding('class') cssClass = 'datatable-body-cell';
  @HostBinding('class.action-cell') cssAction = true;
  @HostBinding('class.dt-sticky') cssSticky = true;

  @HostBinding('attr.role') role = 'gridcell';

  @HostBinding('style.width.px')
  get width(): number {
    return this.table.dimensions.actionColumnWidth;
  }

  @HostBinding('style.left.px') get left() { return 0; }

  get rowNum() {
    return (this.row && !isBlank(this.row.$$index)) ? this.row.$$index + 1 : null;
  }

  checked: boolean;
  private subscriptions: Subscription[] = [];

  constructor(private cd: ChangeDetectorRef) {
  }

  ngOnInit() {
    const subSelection = this.table.events.selectionSource$.subscribe(() => {
      this.checked = this.table.selection.isSelected(this.row.$$index);
      this.cd.markForCheck();
    });
    this.subscriptions.push(subSelection);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  onCheckboxClick(event) {
    this.table.selection.toggle(this.row.$$index);
    this.table.events.onCheckbox(this.row);
  }

}

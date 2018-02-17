import {
  Component, OnInit, Input, HostBinding, ChangeDetectionStrategy, DoCheck,
  KeyValueDiffers, KeyValueDiffer, ChangeDetectorRef
} from '@angular/core';
import {DataTable} from '../base/data-table';

@Component({
  selector: 'app-datatable-summary-row',
  templateUrl: './summary-row.component.html',
  // changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SummaryRowComponent implements OnInit, DoCheck {

  @Input() public table: DataTable;
  @Input() public row: any;
  @Input() public offsetX: number;

  private rowDiffer: KeyValueDiffer<{}, {}>;

  @HostBinding('class')
  get cssClass() {
    const cls = 'datatable-body-row datatable-group-row';
    return cls;
  }

  constructor(private differs: KeyValueDiffers, private cd: ChangeDetectorRef) {
    this.rowDiffer = this.differs.find({}).create();
  }

  ngOnInit() {
  }

  ngDoCheck(): void {
    if (this.rowDiffer.diff(this.row)) {
      this.cd.markForCheck();
    }
  }

  stylesByGroup() {
    const styles: any = {};
    styles.left = `${this.offsetX}px`;
    return styles;
  }

  columnTrackingFn(index: number, column: any): any {
    return column.name;
  }

}

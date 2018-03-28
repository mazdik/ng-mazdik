import {
  Component, OnInit, Input, HostBinding, HostListener, OnDestroy,
  ChangeDetectionStrategy, KeyValueDiffers, KeyValueDiffer, ChangeDetectorRef
} from '@angular/core';
import {DataTable} from '../base/data-table';
import {Subscription} from 'rxjs/Subscription';
import {translate, addClass} from '../base/util';

@Component({
  selector: 'app-datatable-body-row',
  templateUrl: './body-row.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BodyRowComponent implements OnInit, OnDestroy {

  @Input() public table: DataTable;
  @Input() public row: any;

  private rowDiffer: KeyValueDiffer<{}, {}>;
  private subscriptions: Subscription[] = [];

  @HostBinding('class')
  get cssClass() {
    let cls = 'datatable-body-row';
    const rowClass = this.table.settings.rowClass;
    if (rowClass) {
      if (typeof rowClass === 'string') {
        cls += ' ' + rowClass;
      } else if (typeof rowClass === 'function') {
        const res = rowClass(this.row);
        cls = addClass(cls, res);
      }
    }
    if (this.table.dataSelection.isRowSelected(this.row.$index)) {
      cls += ' row-selected';
    }
    return cls;
  }

  constructor(private differs: KeyValueDiffers, private cd: ChangeDetectorRef) {
    this.rowDiffer = this.differs.find({}).create();
  }

  ngOnInit(): void {
    if (this.table.settings.setWidthColumnOnMove) {
      const subColumnResize = this.table.dataService.resizeSource$.subscribe(() => {
        this.cd.markForCheck();
      });
      this.subscriptions.push(subColumnResize);
    }
    const subColumnResizeEnd = this.table.dataService.resizeEndSource$.subscribe(() => {
      this.cd.markForCheck();
    });
    const subRows = this.table.dataService.rowsSource$.subscribe(() => {
      if (this.rowDiffer.diff(this.row)) {
        this.cd.markForCheck();
      }
    });
    const subScroll = this.table.dataService.scrollSource$.subscribe(() => {
      this.cd.markForCheck();
    });
    this.subscriptions.push(subColumnResizeEnd);
    this.subscriptions.push(subRows);
    this.subscriptions.push(subScroll);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  @HostListener('click', ['$event'])
  onClick(event: MouseEvent): void {
    this.rowClick(this.row.$index);
  }

  rowClick(rowIndex: number) {
    this.table.selectRow(rowIndex);
  }

  stylesByGroup() {
    return translate(this.table.offsetX, 0);
  }

}

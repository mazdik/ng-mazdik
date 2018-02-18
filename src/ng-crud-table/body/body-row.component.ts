import {
  Component, OnInit, Input, HostBinding, HostListener, OnDestroy,
  ChangeDetectionStrategy, DoCheck, KeyValueDiffers, KeyValueDiffer, ChangeDetectorRef
} from '@angular/core';
import {MenuItem} from '../types';
import {DataTable} from '../base/data-table';
import {Subscription} from 'rxjs/Subscription';

@Component({
  selector: 'app-datatable-body-row',
  templateUrl: './body-row.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BodyRowComponent implements OnInit, DoCheck, OnDestroy {

  @Input() public table: DataTable;
  @Input() public row: any;
  @Input() public offsetX: number;
  @Input() public rowIndex: number;

  private rowDiffer: KeyValueDiffer<{}, {}>;
  private subscriptions: Subscription[] = [];

  @HostBinding('class')
  get cssClass() {
    let cls = 'datatable-body-row';
    if (this.rowIndex === this.table.selectedRowIndex) {
      cls += ' row-selected';
    }
    return cls;
  }

  constructor(private differs: KeyValueDiffers, private cd: ChangeDetectorRef) {
    this.rowDiffer = this.differs.find({}).create();
  }

  ngOnInit(): void {
    const subColumnResize = this.table.dataService.resizeSource$.subscribe(() => {
      this.cd.markForCheck();
    });
    this.subscriptions.push(subColumnResize);
  }

  ngDoCheck(): void {
    if (this.rowDiffer.diff(this.row)) {
      this.cd.markForCheck();
    }
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  @HostListener('click', ['$event'])
  onClick(event: MouseEvent): void {
    this.rowClick(this.rowIndex);
  }

  rowClick(rowIndex: number) {
    this.table.selectRow(rowIndex);
  }

  actionClick(event, menuItem: MenuItem, rowIndex: number) {
    this.table.selectRow(rowIndex);
    this.table.dataService.onRowMenuClick({'event': event, 'menuItem': menuItem, 'rowIndex': rowIndex});
  }

  stylesByGroup() {
    const styles: any = {};
    styles.left = `${this.offsetX}px`;
    return styles;
  }

}

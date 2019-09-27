import { Component, OnInit, Input, ViewChild, ChangeDetectionStrategy, ChangeDetectorRef, ViewEncapsulation } from '@angular/core';
import { DataTable } from '../ng-data-table/base';
import { SelectItem } from '../common';
import { ModalComponent } from '../modal/modal.component';

@Component({
  selector: 'dt-column-toggler',
  templateUrl: './dt-column-toggler.component.html',
  styleUrls: ['../styles/buttons.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class DtColumnTogglerComponent implements OnInit {

  @Input() table: DataTable;
  @Input() zIndex: number;

  @ViewChild('childModal', {static: false}) childModal: ModalComponent;
  selectColumns: SelectItem[] = [];
  selectedColumns: SelectItem[] = [];

  constructor(private cd: ChangeDetectorRef) {}

  ngOnInit() {
    this.zIndex = this.zIndex || 3;
  }

  onSelectionChange(event: SelectItem[]) {
    this.selectedColumns = event;
  }

  createSelectItems() {
    this.selectedColumns = this.table.columns.filter(x => !x.tableHidden).map(x => ({ id: x.name, name: x.title }) as SelectItem);
    this.selectColumns = this.table.columns.map(x => ({ id: x.name, name: x.title }) as SelectItem);
  }

  save() {
    this.table.columns.forEach(x => {x.tableHidden = true; x.index = 99; });
    this.selectedColumns.forEach((el, i) => {
      const index = this.table.columns.findIndex(x => x.name === el.id);
      this.table.columns[index].tableHidden = false;
      this.table.columns[index].index = i;
    });
    this.table.columns.sort((a, b) => (a.index > b.index) ? 1 : (a.index < b.index) ? -1 : 0);
    this.table.initColumns();
    this.table.events.onRowsChanged();
    this.table.events.onResizeEnd();

    this.childModal.hide();
    this.cd.markForCheck();
  }

  open() {
    this.createSelectItems();
    this.childModal.show();
    this.cd.markForCheck();
  }

  close() {
    this.childModal.hide();
    this.cd.markForCheck();
  }

}

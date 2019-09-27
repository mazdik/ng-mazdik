import {ColumnBase} from './column-base';
import {Column} from './column';
import {Settings} from './settings';
import {supportsStickyPosition} from '../../common/utils';

export class ColumnModelGenerator {

  static actionColumn: ColumnBase = {
    name: 'action',
    title: 'Row actions',
    sortable: false,
    filter: false,
    frozen: true,
    resizeable: false,
    width: 40,
    minWidth: 40,
    formHidden: true,
    cellClass: 'action-cell',
    headerCellClass: 'action-cell',
  };

  static checkboxColumn: ColumnBase = {
    name: 'checkbox',
    title: 'Checkbox selection',
    sortable: false,
    filter: false,
    frozen: true,
    resizeable: false,
    width: 40,
    minWidth: 40,
    formHidden: true,
    cellClass: 'action-cell',
    headerCellClass: 'action-cell',
  };

  constructor(private readonly settings: Settings) {}

  createColumns(columns: ColumnBase[]): Column[] {
    if (this.settings.selectionMode) {
      columns.unshift(ColumnModelGenerator.checkboxColumn);
    }
    return columns.map(x => new Column(x));
  }

  prepareColumns(columns: Column[]): Column[] {
    const frozenColumns = [];
    const scrollableColumns = [];
    let columnIndex = 0;
    const canSticky = supportsStickyPosition();

    columns.forEach((column) => {
      column.frozen = column.frozen && canSticky;
      this.setColumnSettings(column);
      if (!column.tableHidden) {
        if (column.frozen) {
          frozenColumns.push(column);
        } else {
          scrollableColumns.push(column);
        }
        column.index = columnIndex++;
      }
    });
    return [...frozenColumns, ...scrollableColumns];
  }

  private setColumnSettings(column: Column) {
    if (this.settings.sortable === false) {
      column.sortable = false;
    }
    if (this.settings.filter === false) {
      column.filter = false;
    }
    // hide if column is grouped
    if (this.settings.groupRowsBy && this.settings.groupRowsBy.length) {
      if (this.settings.groupRowsBy.indexOf(column.name) >= 0) {
        column.tableHidden = true;
      }
    }
  }

}

import {DataPager} from './data-pager';
import {DataSort} from './data-sort';
import {DataFilter} from './data-filter';
import {RowGroup} from './row-group';
import {Settings} from './settings';
import {Row} from './types';

export class LocalDataSource {

  localRows: Row[] = [];

  constructor(private dataFilter: DataFilter, private pager: DataPager, private sorter: DataSort,
    private rowGroup: RowGroup, private settings: Settings) {
  }

  setRows(data: Row[]) {
    this.dataFilter.clear();
    this.sorter.clear();
    this.pager.current = 1;
    this.localRows = (data) ? data.slice(0) : [];
  }

  getRows(): Row[] {
    if (this.localRows) {
      const data = this.dataFilter.filterRows(this.localRows);
      this.pager.total = data.length;
      this.rowGroup.setSortMetaGroup();
      let rows = this.sorter.sortRows(data);
      if (!this.settings.virtualScroll) {
        rows = this.pager.pager(rows);
      }
      return rows;
    }
  }

  post(newRow: Row) {
    this.localRows.push(newRow);
  }

  put(row: Row) {
    const rowIndex = this.localRows.findIndex(x => x.$$uid === row.$$uid);
    this.localRows[rowIndex] = row;
  }

  delete(row: Row) {
    const rowIndex = this.localRows.findIndex(x => x.$$uid === row.$$uid);
    this.localRows.splice(rowIndex, 1);
  }

}

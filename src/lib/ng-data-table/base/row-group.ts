import { Row, GroupMetadata, AggregateMeta } from './types';
import { Settings } from './settings';
import { DataAggregation } from './data-aggregation';
import { DataSort } from './data-sort';
import { Column } from './column';

export class RowGroup {

  rowGroupMetadata: GroupMetadata;
  grandTotalRow: any;

  get aggregationEnabled() {
    return this.dataAggregation.enabled;
  }

  private dataAggregation: DataAggregation;

  constructor(private settings: Settings, private sorter: DataSort, private columns: Column[]) {
    this.dataAggregation = new DataAggregation();
    this.dataAggregation.aggregates = this.columns
      .filter(x => x.aggregation)
      .map(x => <AggregateMeta>{ field: x.name, type: x.aggregation });
  }

  setSortMetaGroup() {
    if (this.settings.groupRowsBy && this.settings.groupRowsBy.length) {
      this.sorter.multiple = true;
      this.sorter.set(this.settings.groupRowsBy);
    }
  }

  updateRowGroupMetadata(rows: Row[]) {
    if (this.settings.groupRowsBy && this.settings.groupRowsBy.length) {
      this.rowGroupMetadata = this.dataAggregation.groupMetaData(rows, this.settings.groupRowsBy);
    }
    this.grandTotalRow = this.dataAggregation.grandTotal(rows);
  }

  getRowGroupName(row: Row) {
    return this.dataAggregation.groupStringValues(row, this.settings.groupRowsBy);
  }

  getRowGroupSize(row: Row) {
    const group = this.dataAggregation.groupStringValues(row, this.settings.groupRowsBy);
    return this.rowGroupMetadata[group].size;
  }

  isRowGroup(row: Row) {
    if (this.settings.groupRowsBy && this.settings.groupRowsBy.length) {
      const group = this.dataAggregation.groupStringValues(row, this.settings.groupRowsBy);
      return this.rowGroupMetadata[group].index === row.$$index;
    } else {
      return false;
    }
  }

  isRowGroupSummary(row: Row) {
    if (this.settings.groupRowsBy && this.settings.groupRowsBy.length && this.dataAggregation.aggregates.length) {
      const group = this.dataAggregation.groupStringValues(row, this.settings.groupRowsBy);
      const lastRowIndex = (this.rowGroupMetadata[group].index + this.rowGroupMetadata[group].size) - 1;
      return lastRowIndex === row.$$index;
    } else {
      return false;
    }
  }

  getRowGroupSummary(row: Row) {
    const group = this.dataAggregation.groupStringValues(row, this.settings.groupRowsBy);
    return Object.assign({}, this.rowGroupMetadata[group].aggRow);
  }

  getGroupRows(row: Row, rows: Row[]): Row[] {
    const group = this.dataAggregation.groupStringValues(row, this.settings.groupRowsBy);
    return rows.filter(x => this.dataAggregation.groupStringValues(x, this.settings.groupRowsBy) === group);
  }

}

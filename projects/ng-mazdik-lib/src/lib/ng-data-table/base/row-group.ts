import { GroupMetadata, AggregateMeta } from './types';
import { DataAggregation } from './data-aggregation';
import { Column } from './column';
import { Row } from './row';

export class RowGroup {

  rowGroupMetadata: GroupMetadata;
  groupRowsBy: string[];

  get aggregationEnabled(): boolean {
    return this.dataAggregation.enabled;
  }

  get groupEnabled(): boolean {
    return this.groupRowsBy && this.groupRowsBy.length > 0;
  }

  get aggregates(): AggregateMeta[] {
    return this.dataAggregation.aggregates;
  }

  private dataAggregation: DataAggregation;
  private grandTotalRow: Row;

  constructor(groupRowsBy: string[], columns: Column[]) {
    this.groupRowsBy = groupRowsBy;
    this.dataAggregation = new DataAggregation();
    this.dataAggregation.aggregates = columns
      .filter(x => x.aggregation)
      .map(x => ({ field: x.name, type: x.aggregation }) as AggregateMeta);
  }

  updateRowGroupMetadata(rows: Row[]) {
    if (this.groupEnabled) {
      this.rowGroupMetadata = this.dataAggregation.groupMetaData(rows, this.groupRowsBy);
    }
    this.grandTotalRow = new Row(this.dataAggregation.grandTotal(rows));
  }

  getRowGroupName(row: Row) {
    return this.dataAggregation.groupStringValues(row, this.groupRowsBy);
  }

  getRowGroupSize(row: Row) {
    const group = this.getRowGroupName(row);
    return this.rowGroupMetadata[group].size;
  }

  isRowGroup(row: Row) {
    if (this.groupEnabled) {
      const group = this.getRowGroupName(row);
      return this.rowGroupMetadata[group].index === row.$$index;
    } else {
      return false;
    }
  }

  isRowGroupSummary(row: Row) {
    if (this.groupEnabled && this.aggregationEnabled) {
      const group = this.getRowGroupName(row);
      const lastRowIndex = (this.rowGroupMetadata[group].index + this.rowGroupMetadata[group].size) - 1;
      return lastRowIndex === row.$$index;
    } else {
      return false;
    }
  }

  getRowGroupSummary(row: Row): Row {
    const group = this.getRowGroupName(row);
    return new Row(this.rowGroupMetadata[group].aggRow);
  }

  getRowSummary(): Row {
    return this.grandTotalRow || new Row({});
  }

  getGroupRows(row: Row, rows: Row[]): Row[] {
    const group = this.getRowGroupName(row);
    return rows.filter(x => this.getRowGroupName(x) === group);
  }

}

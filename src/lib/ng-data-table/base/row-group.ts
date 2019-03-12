import { Row, GroupMetadata, AggregateMeta } from './types';
import { Settings } from './settings';
import { DataAggregation } from './data-aggregation';
import { Column } from './column';

export class RowGroup {

  rowGroupMetadata: GroupMetadata;
  grandTotalRow: any;
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

  constructor(settings: Settings, private columns: Column[]) {
    this.groupRowsBy = settings.groupRowsBy;
    this.dataAggregation = new DataAggregation();
    this.dataAggregation.aggregates = this.columns
      .filter(x => x.aggregation)
      .map(x => <AggregateMeta>{ field: x.name, type: x.aggregation });
  }

  updateRowGroupMetadata(rows: Row[]) {
    if (this.groupEnabled) {
      this.rowGroupMetadata = this.dataAggregation.groupMetaData(rows, this.groupRowsBy);
    }
    this.grandTotalRow = this.dataAggregation.grandTotal(rows);
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

  getRowGroupSummary(row: Row) {
    const group = this.getRowGroupName(row);
    return Object.assign({}, this.rowGroupMetadata[group].aggRow);
  }

  getGroupRows(row: Row, rows: Row[]): Row[] {
    const group = this.getRowGroupName(row);
    return rows.filter(x => this.getRowGroupName(x) === group);
  }

}

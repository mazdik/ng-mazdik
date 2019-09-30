import {isBlank} from '../../common/utils';
import {AggregateType, AggregateMeta, GroupMetadata} from './types';

export class DataAggregation {

  aggregates: AggregateMeta[] = [];

  get enabled(): boolean {
    return this.aggregates && this.aggregates.length > 0;
  }

  groupStringValues(item: any, keys: any[]): string {
    return keys.map(x => item[x]).join(', ');
  }

  groupBy(array: any[], keys: any[]) {
    const groups = {};
    array.forEach(row => {
      const group = this.groupStringValues(row, keys);
      groups[group] = groups[group] || [];
      groups[group].push(row);
    });
    return groups;
  }

  groupMetaData(array: any[], keys: any[]): GroupMetadata {
    const groupMetadata: GroupMetadata = {};
    if (array) {
      for (let i = 0; i < array.length; i++) {
        const row = array[i];
        const group = this.groupStringValues(row, keys);
        if (i === 0) {
          groupMetadata[group] = {index: 0, size: 1};
          groupMetadata[group].aggRow = this.summaryIterator(groupMetadata[group].aggRow, row);
        } else {
          const previousRow = array[i - 1];
          const previousRowGroup = this.groupStringValues(previousRow, keys);
          if (group === previousRowGroup) {
            groupMetadata[group].size++;
            groupMetadata[group].aggRow = this.summaryIterator(groupMetadata[group].aggRow, row);
          } else {
            groupMetadata[group] = {index: i, size: 1};
            groupMetadata[group].aggRow = this.summaryIterator(groupMetadata[group].aggRow, row);
          }
        }
      }
      Object.keys(groupMetadata).forEach(key => {
        groupMetadata[key].aggRow = this.average(groupMetadata[key].aggRow, groupMetadata[key].size);
      });
    }
    return groupMetadata;
  }

  private summaryIterator(aggRow: any, currentRow: any) {
    aggRow = aggRow || {};
    if (this.enabled) {
      for (const agg of this.aggregates) {
        const previousValue = aggRow[agg.field] || null;
        aggRow[agg.field] = this.aggregate(previousValue, currentRow[agg.field], agg.type);
      }
    }
    return aggRow;
  }

  private aggregate(previousValue: any, currentValue: any, aggregateType: AggregateType) {
    if (aggregateType === 'sum' || aggregateType === 'average') {
      return parseFloat(previousValue || 0) + parseFloat(currentValue || 0);
    } else if (aggregateType === 'max') {
      return (parseFloat(previousValue || 0) < parseFloat(currentValue)) ? currentValue : previousValue;
    } else if (aggregateType === 'min') {
      if (previousValue === null) {
        return currentValue;
      }
      return (parseFloat(previousValue) > parseFloat(currentValue)) ? currentValue : previousValue;
    } else if (aggregateType === 'count') {
      return previousValue + (isBlank(currentValue) ? 0 : 1);
    }
  }

  private average(aggRow: any, count: number) {
    if (this.enabled) {
      this.aggregates.filter(x => x.type === 'average').forEach(agg => {
        aggRow[agg.field] = +(aggRow[agg.field] / count).toFixed(5);
      });
    }
    return aggRow;
  }

  grandTotal(array: any[]) {
    let total = {};
    if (array && this.enabled) {
      array.forEach((row, i) => {
        for (const agg of this.aggregates) {
          total[agg.field] = this.aggregate((i === 0) ? null : total[agg.field], row[agg.field], agg.type);
        }
      });
      total = this.average(total, array.length);
    }
    return total;
  }

}

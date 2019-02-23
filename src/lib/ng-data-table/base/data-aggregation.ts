import {isBlank} from '../../common/utils';
import {AggregateType, AggregateMeta, GroupMetadata, GroupMeta} from './types';

export class DataAggregation {

  aggregates: AggregateMeta[] = [];

  get enabled() {
    return (this.aggregates && this.aggregates.length);
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
          groupMetadata[group] = this.summaryIterator(groupMetadata[group], row);
        } else {
          const previousRow = array[i - 1];
          const previousRowGroup = this.groupStringValues(previousRow, keys);
          if (group === previousRowGroup) {
            groupMetadata[group].size++;
            groupMetadata[group] = this.summaryIterator(groupMetadata[group], row);
          } else {
            groupMetadata[group] = {index: i, size: 1};
            groupMetadata[group] = this.summaryIterator(groupMetadata[group], row);
          }
        }
      }
      for (const key of Object.keys(groupMetadata)) {
        groupMetadata[key] = this.average(groupMetadata[key]);
      }
    }
    return groupMetadata;
  }

  summaryIterator(groupMeta: GroupMeta, currentRow: any): GroupMeta {
    if (this.enabled) {
      for (const agg of this.aggregates) {
        const previousValue = groupMeta[agg.field] || null;
        groupMeta[agg.field] = this.aggregate(previousValue, currentRow[agg.field], agg.type);
      }
    }
    return groupMeta;
  }

  aggregate(previousValue: any, currentValue: any, aggregateType: AggregateType) {
    if (aggregateType === 'sum' || aggregateType === 'average') {
      return parseFloat(previousValue || 0) + parseFloat(currentValue);
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

  average(groupMeta: GroupMeta): GroupMeta {
    if (this.enabled) {
      this.aggregates.filter(x => x.type === 'average').forEach(agg => {
        groupMeta[agg.field] = +(groupMeta[agg.field] / groupMeta.size).toFixed(5);
      });
    }
    return groupMeta;
  }

  grandTotal(array: any[]): GroupMeta {
    let total: GroupMeta = <GroupMeta>{};
    if (array && this.enabled) {
      total.size = array.length;
      array.forEach((row, i) => {
        for (const agg of this.aggregates) {
          total[agg.field] = this.aggregate((i === 0) ? null : total[agg.field], row[agg.field], agg.type);
        }
      });
      total = this.average(total);
    }
    return total;
  }

}

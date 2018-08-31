import {isBlank} from './util';
import {AggregateType, AggregateMeta} from './types';

export class DataAggregation {

  aggregates: AggregateMeta[] = [];

  get enabled() {
    return (this.aggregates && this.aggregates.length);
  }

  groupStringValues(item: any, keys: any[]) {
    const values = [];
    keys.forEach(key => {
      values.push(item[key]);
    });
    return values.join(', ');
  }

  groupBy(array: any[], keys: any[]) {
    const groups = {};
    array.forEach(function (row) {
      const group = this.groupStringValues(row, keys);
      groups[group] = groups[group] || [];
      groups[group].push(row);
    });
    return groups;
  }

  groupMetaData(array: any[], keys: any[]) {
    const groupMetadata = {};
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

  summaryIterator(groupMetadata: any, currentRow: any) {
    if (this.enabled) {
      for (const agg of this.aggregates) {
        const previousValue = (groupMetadata[agg.field]) ? groupMetadata[agg.field] : null;
        groupMetadata[agg.field] = this.aggregate(previousValue, currentRow[agg.field], agg.type);
      }
    }
    return groupMetadata;
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

  average(groupMetadata: any) {
    if (this.enabled) {
      for (const agg of this.aggregates) {
        if (agg.type === 'average') {
          groupMetadata[agg.field] = groupMetadata[agg.field] / groupMetadata.size;
          groupMetadata[agg.field] = parseFloat(groupMetadata[agg.field]).toFixed(5);
        }
      }
    }
    return groupMetadata;
  }

  grandTotal(array: any[]) {
    let total: any = {};
    if (array && this.enabled) {
      total.size = array.length;
      for (let i = 0; i < total.size; i++) {
        const row = array[i];
        if (i === 0) {
          for (const agg of this.aggregates) {
            total[agg.field] = this.aggregate(null, row[agg.field], agg.type);
          }
        } else {
          for (const agg of this.aggregates) {
            total[agg.field] = this.aggregate(total[agg.field], row[agg.field], agg.type);
          }
        }
      }
      total = this.average(total);
    }
    return total;
  }

}

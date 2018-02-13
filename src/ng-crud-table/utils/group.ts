import {isBlank} from './util';

export function groupStringValues(item: any, keys: any[]) {
  const values = [];
  keys.forEach(key => {
    values.push(item[key]);
  });
  return values.join(', ');
}

export function groupBy(array: any[], keys: any[]) {
  const groups = {};
  array.forEach(function (row) {
    const group = groupStringValues(row, keys);
    groups[group] = groups[group] || [];
    groups[group].push(row);
  });
  return groups;
}

export function groupMetaData(array: any[], keys: any[], aggregates?: any[]) {
  const groupMetadata = {};
  if (array) {
    for (let i = 0; i < array.length; i++) {
      const row = array[i];
      const group = groupStringValues(row, keys);
      if (i === 0) {
        groupMetadata[group] = {index: 0, size: 1};
        groupMetadata[group] = summaryIterator(groupMetadata[group], row, aggregates);
      } else {
        const previousRow = array[i - 1];
        const previousRowGroup = groupStringValues(previousRow, keys);
        if (group === previousRowGroup) {
          groupMetadata[group].size++;
          groupMetadata[group] = summaryIterator(groupMetadata[group], row, aggregates);
        } else {
          groupMetadata[group] = {index: i, size: 1};
          groupMetadata[group] = summaryIterator(groupMetadata[group], row, aggregates);
        }
      }
    }
    Object.keys(groupMetadata).forEach(function(key) {
      groupMetadata[key] = average(groupMetadata[key], aggregates);
    });
  }
  return groupMetadata;
}

export function summaryIterator(groupMetadata: any, currentRow: any, aggregates?: any[]) {
  if (aggregates && aggregates.length) {
    for (const agg of aggregates) {
      const previousValue = (groupMetadata[agg.field]) ? groupMetadata[agg.field] : null;
      groupMetadata[agg.field] = aggregate(previousValue, currentRow[agg.field], agg.type);
    }
  }
  return groupMetadata;
}

export function aggregate(previousValue: any, currentValue: any, aggregateType: string) {
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

export function average(groupMetadata: any, aggregates?: any[]) {
  if (aggregates && aggregates.length) {
    for (const agg of aggregates) {
      if (agg.type === 'average') {
        groupMetadata[agg.field] = groupMetadata[agg.field] / groupMetadata.size;
      }
    }
  }
  return groupMetadata;
}

function getStringValues(item: any, keys: any[]) {
  const values = [];
  keys.forEach(key => {
    values.push(item[key]);
  });
  return values.join(', ');
}

export function groupBy(array: any[], keys: any[]) {
  const groups = {};
  array.forEach(function (row) {
    const group = getStringValues(row, keys);
    groups[group] = groups[group] || [];
    groups[group].push(row);
  });
  return groups;
}

/*
var arr = [
  { shape: 'square', color: 'red', used: 1, instances: 1 },
  { shape: 'square', color: 'red', used: 2, instances: 1 },
  { shape: 'circle', color: 'blue', used: 0, instances: 0 },
  { shape: 'square', color: 'blue', used: 4, instances: 4 },
  { shape: 'circle', color: 'red', used: 1, instances: 1 },
  { shape: 'circle', color: 'red', used: 1, instances: 0 },
  { shape: 'square', color: 'red', used: 4, instances: 4 },
  { shape: 'square', color: 'red', used: 2, instances: 2 }
];
groupBy(arr, ['shape', 'color']);
*/

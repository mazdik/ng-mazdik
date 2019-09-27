export function inputFormattedDate(type: string, value: any) {
  if (value) {
    if (value instanceof Date) {
      value = value.toISOString();
    }
    if (type === 'datetime-local') {
      return value.slice(0, 16);
    } else if (type === 'date') {
      return value.slice(0, 10);
    } else if (type === 'month') {
      return value.slice(0, 7);
    }
  }
  return value;
}

export type LastDateType = 'year' | 'month' | 'day' | 'hour';

export function getLastDate(type: LastDateType) {
  let dt: Date;
  if (type === 'year') {
    dt = new Date();
    dt.setMonth(dt.getMonth() - 12);
  } else if (type === 'month') {
    dt = new Date();
    dt.setMonth(dt.getMonth() - 1);
  } else if (type === 'day') {
    dt = new Date(Date.now() + -1 * 24 * 3600 * 1000);
  } else if (type === 'hour') {
    dt = new Date(Date.now() + -1 * 3600 * 1000);
  }
  return dt;
}

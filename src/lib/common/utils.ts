export function isBlank(val: any): boolean {
  if (val !== null && val !== undefined) {
    if ((typeof val === 'string' && val.trim().length === 0) ||
      (val instanceof Array && val.length === 0) ||
      (typeof val === 'object' && Object.getOwnPropertyNames(val).length === 0)) {
      return true;
    } else {
      return false;
    }
  }
  return true;
}

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

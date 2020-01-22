export function toISOStringIgnoreTZ(date: Date): string {
  return new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toISOString();
}

export function inputFormattedDate(type: string, value: any) {
  if (value) {
    const strDate = (value instanceof Date) ? toISOStringIgnoreTZ(value) : value;
    if (type === 'datetime-local') {
      return strDate.slice(0, 16);
    } else if (type === 'date') {
      return strDate.slice(0, 10);
    } else if (type === 'month') {
      return strDate.slice(0, 7);
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

export function inputIsDateType(type: string): boolean {
  return (type === 'date' || type === 'datetime-local' || type === 'month');
}

export function checkStrDate(value: string): boolean {
  if (!value || value.substring(0, 3) === '000' || value.substring(0, 2) === '00' || value.substring(0, 1) === '0') {
    return false;
  }
  return true;
}

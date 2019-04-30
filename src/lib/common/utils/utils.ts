export function isBlank(val: any): boolean {
  if (val !== null && val !== undefined) {
    if ((typeof val === 'string' && val.trim().length === 0) ||
      (val instanceof Array && val.length === 0) ||
      (Object.keys(val).length === 0 && val.constructor === Object)) {
      return true;
    } else {
      return false;
    }
  }
  return true;
}

export function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

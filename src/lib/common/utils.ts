export function inputFormattedDate(type, value) {
  if (value) {
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

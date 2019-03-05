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

export function isLeftButton(event: MouseEvent | TouchEvent) {
  return (event.type === 'mousedown' && (<MouseEvent>event).button === 0);
}

export function getEvent(event: MouseEvent | TouchEvent): MouseEvent | Touch {
  if (event.type === 'touchend' || event.type === 'touchcancel') {
    return (<TouchEvent>event).changedTouches[0];
  }
  return event.type.startsWith('touch') ? (<TouchEvent>event).targetTouches[0] : <MouseEvent>event;
}

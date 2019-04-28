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

export function isLeftButton(event: MouseEvent | TouchEvent) {
  return (event.type === 'mousedown' && (event as MouseEvent).button === 0);
}

export function getEvent(event: MouseEvent | TouchEvent): MouseEvent | Touch {
  if (event.type === 'touchend' || event.type === 'touchcancel') {
    return (event as TouchEvent).changedTouches[0];
  }
  return event.type.startsWith('touch') ? (event as TouchEvent).targetTouches[0] : event as MouseEvent;
}

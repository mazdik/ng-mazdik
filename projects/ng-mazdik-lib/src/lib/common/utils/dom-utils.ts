export function isLeftButton(event: MouseEvent | TouchEvent) {
  if (event.type === 'touchstart') {
    return true;
  }
  return (event.type === 'mousedown' && (event as MouseEvent).button === 0);
}

export function getEvent(event: MouseEvent | TouchEvent): MouseEvent | Touch {
  if (event.type === 'touchend' || event.type === 'touchcancel') {
    return (event as TouchEvent).changedTouches[0];
  }
  return event.type.startsWith('touch') ? (event as TouchEvent).targetTouches[0] : event as MouseEvent;
}

export function maxZIndex(selectors: string = 'body *') {
  return Array.from(document.querySelectorAll(selectors))
    .map(a => parseFloat(window.getComputedStyle(a).zIndex))
    .filter(a => !isNaN(a))
    .sort((a, b) => a - b)
    .pop() || 0;
}

export function findAncestor(el, selectors) {
  if (typeof el.closest === 'function') {
    return el.closest(selectors) || null;
  }
  while (el) {
    if (el.matches(selectors)) {
      return el;
    }
    el = el.parentElement;
  }
  return null;
}

export function supportsStickyPosition(): boolean {
  if (!('CSS' in window)) {
    return false;
  }
  return (
    CSS.supports('position', 'sticky') ||
    CSS.supports('position', '-webkit-sticky')
  );
}

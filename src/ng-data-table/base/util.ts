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

export function getHeight(el): number {
  let height = el.offsetHeight;
  const style = getComputedStyle(el);
  height -= parseFloat(style.paddingTop) + parseFloat(style.paddingBottom);
  height -= parseFloat(style.borderTopWidth) + parseFloat(style.borderBottomWidth);
  return height;
}

export function translate(x: number, y: number) {
  const styles: any = {};
  styles.transform = `translate3d(${x}px, ${y}px, 0)`;
  styles.backfaceVisibility = 'hidden';
  return styles;
}

export function addClass(cls: string, res: any): string {
  if (typeof res === 'string') {
    cls += ' ' + res;
  } else if (typeof res === 'object') {
    const keys = Object.keys(res);
    for (const k of keys) {
      if (res[k] === true) {
        cls += ` ${k}`;
      }
    }
  }
  return cls;
}

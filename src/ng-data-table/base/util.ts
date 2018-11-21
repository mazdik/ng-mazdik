export function isBlank(val: any): boolean {
  if (val !== null && val !== undefined) {
    return ((typeof val === 'string' && val.trim().length === 0) ||
      (val instanceof Array && val.length === 0) ||
      (typeof val === 'object' && Object.getOwnPropertyNames(val).length === 0));
  }
  return true;
}

export function translate(x: number, y: number) {
  return `translate3d(${x}px, ${y}px, 0)`;
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

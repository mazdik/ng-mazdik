export function arrayMove<T = any>(array: T[], fromIndex: number, toIndex: number): void {
  fromIndex = clamp(fromIndex, array.length - 1);
  toIndex = clamp(toIndex, array.length - 1);

  if (fromIndex !== toIndex) {
    array.splice(toIndex, 0, array.splice(fromIndex, 1)[0]);
  }
}

export function arrayTransfer<T = any>(arrayFrom: T[], arrayTo: T[], fromIndex: number, toIndex: number): void {
  fromIndex = clamp(fromIndex, arrayFrom.length - 1);
  toIndex = clamp(toIndex, arrayTo.length);

  if (arrayFrom.length) {
    arrayTo.splice(toIndex, 0, arrayFrom.splice(fromIndex, 1)[0]);
  }
}

function clamp(a: number, b: number): number {
  return Math.max(0, Math.min(a, b));
}

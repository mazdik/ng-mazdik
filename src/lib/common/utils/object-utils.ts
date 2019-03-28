import { isBlank } from './utils';

export function getDeepValue(data: any, path: string): any {
  if (!data) {
    return '';
  }
  if (data[path] !== undefined) {
    return data[path];
  }
  const fields = path.split('.');
  let currentObject = data;
  for (let i = 0; i < fields.length; i++) {
    currentObject = currentObject[fields[i]];
    if (isBlank(currentObject)) {
      return '';
    }
  }
  return currentObject;
}

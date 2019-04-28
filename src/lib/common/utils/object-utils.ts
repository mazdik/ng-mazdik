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
  for (const field of fields) {
    currentObject = currentObject[field];
    if (isBlank(currentObject)) {
      return '';
    }
  }
  return currentObject;
}

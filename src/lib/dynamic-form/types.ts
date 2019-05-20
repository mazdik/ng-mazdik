export type ElementType =
  'text'
  | 'password'
  | 'number'
  | 'select'
  | 'radio'
  | 'checkbox'
  | 'textarea'
  | 'date'
  | 'datetime-local'
  | 'month'
  | 'select-popup'
  | 'select-dropdown';

export type GetOptionsFunc = (url: string, parentId: any) => Promise<any>;

export interface KeyElementChangeEventArgs {
  keyElementName: string;
  keyElementValue: any;
  elementName: string;
  elementValue: string;
}

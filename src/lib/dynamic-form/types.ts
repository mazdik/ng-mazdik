export interface SelectOption {
  id: any;
  name: string;
  parentId?: any;
}

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

export type getOptionsFunction = (url: string, parentId: any) => Promise<any>;

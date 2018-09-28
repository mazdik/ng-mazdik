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
  | 'select-popup';

export type getOptionsFunction = (url: string, parentId: any) => Promise<any>;

import {TemplateRef} from '@angular/core';
import {ElementType} from './types';
import {SelectItem} from '../common';

export class DynamicFormElement {
  title: string;
  name: string;
  options?: SelectItem[];
  optionsUrl?: string;
  type?: ElementType;
  validatorFunc?: (name: string, value: any) => string[];
  dependsElement?: string;
  cellTemplate?: TemplateRef<any>;
  hidden?: boolean;
  keyElement?: string;
  disableOnEdit?: boolean;

  getOptions(dependsValue?: any): SelectItem[] {
    if (this.options) {
      if (this.dependsElement && dependsValue) {
        return this.options.filter((value) => value.parentId === dependsValue);
      } else {
        return this.options;
      }
    }
  }

  validate(value: any): string[] {
    if (this.validatorFunc) {
      return this.validatorFunc(this.title, value);
    }
    return [];
  }

  get isDateType(): boolean {
    return (this.type === 'date' || this.type === 'datetime-local' || this.type === 'month');
  }

}

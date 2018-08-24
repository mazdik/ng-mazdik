import {SelectOption, Validation, ColumnType, AggregateType} from '../types';
import {TemplateRef} from '@angular/core';

export class ColumnBase {

  title: string;
  name: string;
  sortable?: boolean = true;
  filter?: boolean = true;
  options?: SelectOption[];
  optionsUrl?: string;
  width?: number = null;
  frozen?: boolean;
  type?: ColumnType;
  validation?: Validation;
  editable?: boolean;
  resizeable?: boolean = true;
  dependsColumn?: string;
  cellTemplate?: TemplateRef<any>;
  headerCellTemplate?: TemplateRef<any>;
  formHidden?: boolean;
  tableHidden?: boolean;
  cellClass?: string | Function;
  headerCellClass?: string;
  isPrimaryKey?: boolean;
  keyColumn?: string;
  selectionLimit?: number = 1;
  minWidth?: number = 50;
  maxWidth?: number = 500;
  aggregation?: AggregateType;
  filterValuesFunc?: (columnName: string) => Promise<SelectOption[]>;

}

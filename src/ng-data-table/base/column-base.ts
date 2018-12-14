import {ColumnType, AggregateType, DataType} from './types';
import {TemplateRef, PipeTransform} from '@angular/core';
import {SelectItem} from '../../lib/common';

export class ColumnBase {

  title: string;
  name: string;
  sortable?: boolean = true;
  filter?: boolean = true;
  options?: SelectItem[];
  optionsUrl?: string;
  width?: number = null;
  frozen?: boolean;
  type?: ColumnType;
  validatorFunc?: (name: string, value: any) => string[];
  editable?: boolean;
  resizeable?: boolean = true;
  dependsColumn?: string;
  cellTemplate?: TemplateRef<any>;
  headerCellTemplate?: TemplateRef<any>;
  formHidden?: boolean;
  tableHidden?: boolean;
  cellClass?: string | Function;
  headerCellClass?: string;
  keyColumn?: string;
  multiSelectFilter?: boolean;
  minWidth?: number = 50;
  maxWidth?: number = 500;
  aggregation?: AggregateType;
  filterValuesFunc?: (columnName: string) => Promise<SelectItem[]>;
  dataType?: DataType;
  formDisableOnEdit?: boolean;
  pipe?: PipeTransform;
}

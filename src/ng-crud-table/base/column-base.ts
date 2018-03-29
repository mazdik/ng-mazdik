import {SelectOption, Validation, ColumnType, AggregateType} from '../types';
import {TemplateRef} from '@angular/core';

export class ColumnBase {

  public title: string;
  public name: string;
  public sortable?: boolean = true;
  public filter?: boolean = true;
  public options?: SelectOption[] | Function;
  public optionsUrl?: string;
  public width?: number = null;
  public frozen?: boolean;
  public type?: ColumnType;
  public validation?: Validation;
  public editable?: boolean;
  public resizeable?: boolean = true;
  public dependsColumn?: string;
  public cellTemplate?: TemplateRef<any>;
  public formHidden?: boolean;
  public tableHidden?: boolean;
  public cellClass?: string | Function;
  public keyColumn?: string;
  public selectionLimit?: number = 1;
  public minWidth?: number = 50;
  public maxWidth?: number = 500;
  public aggregation?: AggregateType;

}

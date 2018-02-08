import {PipeTransform} from '@angular/core';
import {SelectOption, Validation, ColumnType} from '../types';

export class ColumnBase {

  public title: string;
  public name: string;
  public sortable?: boolean = true;
  public filter?: boolean = true;
  public options?: SelectOption[];
  public pipe?: PipeTransform;
  public width?: number = null;
  public frozen?: boolean;
  public type?: ColumnType;
  public validation?: Validation;
  public editable?: boolean;
  public resizeable?: boolean = true;
  public dependsColumn?: string;
  public cellTemplate?: any;
  public formHidden?: boolean;
  public tableHidden?: boolean;
  public optionsUrl?: string;
  public cellClass?: any;
  public keyColumn?: string;
  public selectionLimit?: number = 1;
  public minWidth: number = 50;
  public maxWidth: number = 500;

}

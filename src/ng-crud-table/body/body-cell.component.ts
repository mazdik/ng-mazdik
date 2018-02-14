import {
  Component, Input, PipeTransform, HostBinding,
  ChangeDetectionStrategy, DoCheck, ChangeDetectorRef,
} from '@angular/core';
import {Column} from '../base/column';

@Component({
  selector: 'app-datatable-body-cell',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="cell-data" *ngIf="!column.cellTemplate" title="{{value}}">
      {{value}}
    </div>
    <ng-template #cellTemplate
                 *ngIf="column.cellTemplate"
                 [ngTemplateOutlet]="column.cellTemplate"
                 [ngTemplateOutletContext]="cellContext">
    </ng-template>
  `
})
export class BodyCellComponent implements DoCheck {

  @Input() colIndex: number;

  @Input()
  set column(column: Column) {
    this._column = column;
    this.cellContext.column = column;
    this.checkValueUpdates();
    this.cd.markForCheck();
  }

  get column(): Column {
    return this._column;
  }

  @Input()
  set row(row: any) {
    this._row = row;
    this.cellContext.row = row;
    this.checkValueUpdates();
    this.cd.markForCheck();
  }

  get row(): any {
    return this._row;
  }


  @HostBinding('class')
  get columnCssClasses(): any {
    let cls = 'datatable-body-cell';
    if (this.column.cellClass) {
      if (typeof this.column.cellClass === 'string') {
        cls += ' ' + this.column.cellClass;
      } else if (typeof this.column.cellClass === 'function') {
        const res = this.column.cellClass({
          row: this.row,
          column: this.column,
          value: this.value,
        });

        if (typeof res === 'string') {
          cls += ' ' + res;
        } else if (typeof res === 'object') {
          const keys = Object.keys(res);
          for (const k of keys) {
            if (res[k] === true) {
              cls += ` ${k}`;
            }
          }
        }
      }
    }
    return cls;
  }

  @HostBinding('style.width.px')
  get width(): number {
    return this.column.width;
  }

  value: any;
  cellContext: any = {
    row: this.row,
    value: this.value,
    column: this.column,
  };
  private _column: Column;
  private _row: any;

  constructor(private cd: ChangeDetectorRef) {
  }

  ngDoCheck(): void {
    this.checkValueUpdates();
  }

  checkValueUpdates(): void {
    let value = '';

    if (!this.row || !this.column) {
      value = '';
    } else {
      const val = this.row[this.column.name];
      const userPipe: PipeTransform = this.column.pipe;

      if (userPipe) {
        value = userPipe.transform(val);
      } else if (value !== undefined) {
        value = val;
      }
    }

    if (this.value !== value) {
      this.value = value;
      this.cellContext.value = value;
      if (value !== null && value !== undefined) {
        this.value = this.column.getOptionName(value);
      }
      this.cd.markForCheck();
    }
  }

}

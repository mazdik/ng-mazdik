import {
  Component, Input, PipeTransform, HostBinding,
  ChangeDetectionStrategy, DoCheck, ChangeDetectorRef,
} from '@angular/core';
import {Column} from '../types/interfaces';
import {ColumnUtils} from '../utils/column-utils';

@Component({
  selector: 'datatable-body-cell',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<span class="cell-data" title="{{value}}">{{value}}</span>`
})
export class BodyCellComponent implements DoCheck {

  @Input() row: any;
  @Input() column: Column;
  @Input() colIndex: number;

  @HostBinding('class')
  get columnCssClasses(): any {
    const cls = 'datatable-body-cell';
    return cls;
  }

  @HostBinding('style.width.px')
  get width(): number {
    return this.column.width;
  }

  value: any;

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
      if (value !== null && value !== undefined) {
        this.value = ColumnUtils.getOptionName(value, this.column);
      }
      this.cd.markForCheck();
    }
  }

}

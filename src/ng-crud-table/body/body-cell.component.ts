import {
  Component, Input, PipeTransform, HostBinding, ViewChild, ChangeDetectionStrategy, DoCheck, ChangeDetectorRef,
  Output, EventEmitter, HostListener, ElementRef, ViewContainerRef, OnDestroy
} from '@angular/core';
import {Column} from '../types/interfaces';
import {ColumnUtils} from '../utils/column-utils';

@Component({
  selector: 'datatable-body-cell',
  templateUrl: './body-cell.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BodyCellComponent implements OnDestroy, DoCheck {

  @Input() row: any;
  @Input() column: Column;
  @Input() colIndex: number;
  @Output() editComplete: EventEmitter<any> = new EventEmitter();

  @ViewChild('cellTemplate', {read: ViewContainerRef}) cellTemplate: ViewContainerRef;
  @ViewChild('selectElement') selectElement: ElementRef;
  @ViewChild('inputElement') inputElement: ElementRef;

  @HostBinding('class')
  get columnCssClasses(): any {
    let cls = 'datatable-body-cell';
    if (this.editing) {
      cls += ' cell-editing';
    }
    if (this.isFocused || this.editing) {
      cls += ' active';
    }
    return cls;
  }

  @HostBinding('style.width.px')
  get width(): number {
    return this.column.width;
  }

  value: any;
  isFocused: boolean = false;
  element: any;
  editing: boolean = false;
  cellContext: any = {
    row: this.row,
    value: this.value,
    column: this.column
  };

  constructor(element: ElementRef, private cd: ChangeDetectorRef) {
    this.element = element.nativeElement;
  }

  ngDoCheck(): void {
    this.checkValueUpdates();
  }

  ngOnDestroy(): void {
    if (this.cellTemplate) {
      this.cellTemplate.clear();
    }
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
        this.value = ColumnUtils.getOptionName(value, this.column);
      }
      this.cd.markForCheck();
    }
  }

  @HostListener('focus')
  onFocus(): void {
    this.isFocused = true;
  }

  @HostListener('blur')
  onBlur(): void {
    this.isFocused = false;
  }

  @HostListener('click', ['$event'])
  onClick(event: MouseEvent): void {
    this.switchCellToEditMode(this.column);
  }

  switchCellToEditMode(column: Column) {
    if (column.editable) {
      this.editing = true;
      if (column.options) {
        setTimeout(() => this.selectElement.nativeElement.focus(), 50);
      } else {
        setTimeout(() => this.inputElement.nativeElement.focus(), 50);
      }
    }
  }

  switchCellToViewMode() {
    this.editing = false;
  }

  onCellEditorKeydown(event: any) {
    const colIndex = this.colIndex;
    // enter
    if (event.keyCode === 13) {
      this.editComplete.emit(this.row);
      this.switchCellToViewMode();
      event.preventDefault();
      // escape
    } else if (event.keyCode === 27) {
      this.switchCellToViewMode();
      event.preventDefault();
      // tab TODO
    } else if (event.keyCode === 9) {
      const currentCell = this.element;
      const row = currentCell.parentElement;
      let targetCell;

      if (event.shiftKey) {
        if (colIndex === 0) {
          const previousRow = row.previousElementSibling;
          if (previousRow) {
            targetCell = previousRow.lastElementChild;
          }
        } else {
          targetCell = row.children[colIndex - 1];
        }
      } else {
        if (colIndex === (row.children.length - 1)) {
          const nextRow = row.nextElementSibling;
          if (nextRow) {
            targetCell = nextRow.firstElementChild;
          }
        } else {
          targetCell = row.children[colIndex + 1];
        }
      }

      if (targetCell) {
        targetCell.click();
        event.preventDefault();
      }
    }
  }

  getOptions(column: Column, row: any[]) {
    return ColumnUtils.getOptions(column, row[column.dependsColumn]);
  }


}

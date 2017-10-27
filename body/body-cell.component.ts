import {
  Component, Input, PipeTransform, HostBinding, ViewChild, ChangeDetectionStrategy, DoCheck,
  Output, EventEmitter, HostListener, ElementRef, ViewContainerRef, OnDestroy, Renderer
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
  isFocused: boolean = false;
  element: any;
  cellContext: any = {
    row: this.row,
    value: this.value,
    column: this.column
  };

  constructor(element: ElementRef, private renderer: Renderer) {
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
      /*this.cd.markForCheck();*/
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
    this.switchCellToEditMode(event, this.column);
  }

  switchCellToEditMode(event: any, column: Column) {
    if (column.editable) {
      this.renderer.setElementClass(this.element, 'cell-editing', true);
      let focusable;
      if (column.options) {
        focusable = this.element.querySelector('.cell-editor select');
      } else {
        focusable = this.element.querySelector('.cell-editor input');
      }
      if (focusable) {
        setTimeout(() => this.renderer.invokeElementMethod(focusable, 'focus'), 50);
      }
    }
  }

  switchCellToViewMode() {
    this.renderer.setElementClass(this.element, 'cell-editing', false);
  }

  onCellEditorKeydown(event: any, column: Column, item: any, colIndex: number) {
    // enter
    if (event.keyCode === 13) {
      this.editComplete.emit(item);
      this.renderer.invokeElementMethod(event.target, 'blur');
      this.switchCellToViewMode();
      event.preventDefault();
      // escape
    } else if (event.keyCode === 27) {
      // this.onEditCancel.emit({column: column, data: rowData});
      this.renderer.invokeElementMethod(event.target, 'blur');
      this.switchCellToViewMode();
      event.preventDefault();
      // tab
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
        this.renderer.invokeElementMethod(targetCell, 'click');
        event.preventDefault();
      }
    }
  }

  getOptions(column: Column, row: any[]) {
    return ColumnUtils.getOptions(column, row[column.dependsColumn]);
  }


}

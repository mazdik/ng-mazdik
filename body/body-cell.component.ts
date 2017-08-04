import {
  Component, Input, PipeTransform, HostBinding, ViewChild,
  Output, EventEmitter, HostListener, ElementRef, ViewContainerRef, OnDestroy, Renderer
} from '@angular/core';
import {Column} from '../types/interfaces';

@Component({
  selector: 'datatable-body-cell',
  templateUrl: './body-cell.component.html',
  host: {
    class: 'datatable-body-cell'
  }
})
export class BodyCellComponent implements OnDestroy {

  @Input() row: any;
  @Input() column: Column;
  @Input() colIndex: number;
  @Output() editComplete: EventEmitter<any> = new EventEmitter();

  public editingCell: any;
  public editorClick: boolean;
  public isFocused: boolean = false;
  public element: any;

  @HostBinding('style.width.px')
  get width(): number {
    return this.column.width;
  }

  @HostListener('focus')
  onFocus(): void {
    this.isFocused = true;
  }

  @HostListener('blur')
  onBlur(): void {
    this.isFocused = false;
  }

  @HostBinding('class')
  get columnCssClasses(): any {
    let cls = 'datatable-body-cell';
/*    if (this.isFocused) {
      cls += ' cell-editing';
    }*/
    return cls;
  }

  @HostListener('click', ['$event'])
  onClick(event: MouseEvent): void {
    this.switchCellToEditMode(event, this.column);
  }

  constructor(element: ElementRef, private renderer: Renderer) {
    this.element = element.nativeElement;
  }

  ngOnDestroy(): void {
  }

  format(value: any, column: Column) {
    if (column.format && column.format === 'date') {
      const d = new Date(value * 1000);
      value = d.toLocaleString('ru');
    }
    return value;
  }

  findCell(event) {
    return this.element;
  }

  switchCellToEditMode(event: any, column: Column) {
    if (column.editable) {
      this.editorClick = true;
      const cell = this.findCell(event);
      if (cell !== this.editingCell) {
        if (this.editingCell) {
          this.renderer.setElementClass(this.editingCell, 'cell-editing', false);
        }
        this.renderer.setElementClass(cell, 'cell-editing', true);
        this.editingCell = cell;
        let focusable;
        if (column.options) {
          focusable = cell.querySelector('.cell-editor select');
        } else {
          focusable = cell.querySelector('.cell-editor input');
        }
        if (focusable) {
          setTimeout(() => this.renderer.invokeElementMethod(focusable, 'focus'), 50);
        }
      }
    }
  }

  switchCellToViewMode(event: any) {
    this.editingCell = null;
    const cell = this.findCell(event);
    this.renderer.setElementClass(cell, 'cell-editing', false);
  }

  closeCell() {
    if (this.editingCell) {
      this.renderer.setElementClass(this.editingCell, 'cell-editing', false);
      this.editingCell = null;
    }
  }

  onCellEditorKeydown(event: any, column: Column, item: any, colIndex: number) {
    // enter
    if (event.keyCode === 13) {
      this.editComplete.emit(item);
      this.renderer.invokeElementMethod(event.target, 'blur');
      this.switchCellToViewMode(event);
      event.preventDefault();
      // escape
    } else if (event.keyCode === 27) {
      // this.onEditCancel.emit({column: column, data: rowData});
      this.renderer.invokeElementMethod(event.target, 'blur');
      this.switchCellToViewMode(event);
      event.preventDefault();
      // tab
    } else if (event.keyCode === 9) {
      const currentCell = this.findCell(event);
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

  getOptions(column: Column, item: any) {
    if (column.options) {
      if (column.dependsColumn) {
        return column.options.filter((value) => value.parentId === item[column.dependsColumn]);
      } else {
        return column.options;
      }
    }
  }


}

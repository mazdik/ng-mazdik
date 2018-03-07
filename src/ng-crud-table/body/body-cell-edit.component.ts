import {
  Component, HostListener, ElementRef, ViewChild, ChangeDetectionStrategy, ChangeDetectorRef,
} from '@angular/core';
import {Column} from '../base/column';
import {BodyCellComponent} from './body-cell.component';

@Component({
  selector: 'app-datatable-body-cell-edit',
  templateUrl: './body-cell-edit.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BodyCellEditComponent extends BodyCellComponent {

  @ViewChild('selectElement') selectElement: ElementRef;
  @ViewChild('inputElement') inputElement: ElementRef;

  constructor(cd: ChangeDetectorRef, private element: ElementRef) {
    super(cd);
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
    if (this.row[this.column.name] !== this.oldValue) {
      this.updateValue();
    }
  }

  onCellEditorKeydown(event: any) {
    const colIndex = this.colIndex;
    // enter
    if (event.keyCode === 13) {
      this.table.dataService.onEdit(this.row);
      this.switchCellToViewMode();
      event.preventDefault();
      // escape
    } else if (event.keyCode === 27) {
      this.editing = false;
      event.preventDefault();
      event.stopPropagation();
      this.row[this.column.name] = this.oldValue;
      this.updateValue();
      // tab TODO
    } else if (event.keyCode === 9) {
      const currentCell = this.element.nativeElement;
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

  getOptions(row: any[]) {
    return this.column.getOptions(row[this.column.dependsColumn]);
  }


}

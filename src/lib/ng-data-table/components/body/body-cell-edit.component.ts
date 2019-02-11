import {Component, ElementRef, OnInit, ChangeDetectionStrategy, ChangeDetectorRef} from '@angular/core';
import {BodyCellComponent} from './body-cell.component';
import {Keys, Row, CellEventArgs, EditMode} from '../../base';

@Component({
  selector: 'dt-body-cell-edit',
  templateUrl: './body-cell-edit.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BodyCellEditComponent extends BodyCellComponent implements OnInit {

  tempValue: any;

  constructor(cd: ChangeDetectorRef, element: ElementRef) {
    super(cd, element);
  }

  ngOnInit(): void {
    super.ngOnInit();
    const subDblClickCell = this.table.events.dblClickCellSource$.subscribe((ev: CellEventArgs) => {
      if (this.row.$$index === ev.rowIndex && this.column.index === ev.columnIndex) {
        if (this.table.settings.editMode !== EditMode.EditProgrammatically) {
          this.switchCellToEditMode();
        }
      }
    });
    const subKeydownCell = this.table.events.keydownCellSource$.subscribe((ev: CellEventArgs) => {
      if (this.row.$$index === ev.rowIndex && this.column.index === ev.columnIndex) {
        if (this.table.settings.editMode !== EditMode.EditProgrammatically) {
          this.onCellKeydown(ev.event);
        }
      }
    });
    const subCellEditMode = this.table.events.cellEditModeSource$.subscribe((ev: CellEventArgs) => {
      if (this.row.$$index === ev.rowIndex && this.column.index === ev.columnIndex) {
        if (ev.editMode) {
          this.switchCellToEditMode();
        } else {
          this.switchCellToViewMode();
          this.cd.markForCheck();
        }
      }
    });
    this.subscriptions.push(subDblClickCell);
    this.subscriptions.push(subKeydownCell);
    this.subscriptions.push(subCellEditMode);
  }

  switchCellToEditMode() {
    if (this.column.editable) {
      this.editing = true;
      this.validate();
      this.cd.markForCheck();
    }
  }

  switchCellToViewMode() {
    this.editing = false;
    if (this.row[this.column.name] !== this.tempValue) {
      this.updateValue();
      this.table.events.onCellValueChanged({
        columnIndex: this.column.index,
        rowIndex: this.row.$$index,
        oldValue: this.row[this.column.name],
        newValue: this.tempValue,
      });
    }
  }

  onCellKeydown(event: any) {
    if (this.editing) {
      this.onCellEditorKeydown(event);
    } else {
      if (event.keyCode === Keys.KEY_F2 || event.keyCode === Keys.ENTER) {
        this.switchCellToEditMode();
      }
    }
    if (!this.column.options) {
      event.preventDefault();
    }
  }

  onCellEditorKeydown(event: any) {
    if (event.keyCode === Keys.ENTER) {
      this.switchCellToViewMode();
      this.element.nativeElement.focus();
    } else if (event.keyCode === Keys.ESCAPE) {
      this.editing = false;
      this.row[this.column.name] = this.tempValue;
      this.updateValue();
      this.element.nativeElement.focus();
    }
  }

  getOptions(row: Row[]) {
    return this.column.getOptions(row[this.column.dependsColumn]);
  }

  onInputBlur() {
    if (this.table.settings.editMode !== EditMode.EditProgrammatically) {
      this.switchCellToViewMode();
    }
  }

  onInputFocus() {
    this.tempValue = this.row[this.column.name];
  }

}

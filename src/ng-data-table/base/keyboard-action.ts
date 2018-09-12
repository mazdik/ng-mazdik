import { DataTable } from '../base/data-table';
import { CellEventArgs, Keys } from './types';
import { isBlank } from '../base/util';

export class KeyboardAction {

    constructor(private table: DataTable) {
    }

    handleEvent(event: KeyboardEvent, target: HTMLElement) {
        const keyCode = event.keyCode;
        const shiftKey = event.shiftKey;
        if (!this.isAction(keyCode) && !this.isNavigationKey(keyCode)) {
            return;
        }
        const isEditing = target.classList.contains('cell-editing');
        const dataColIndex = target.dataset.columnIndex;
        const dataRowIndex = target.dataset.rowIndex;
        if (!isBlank(dataColIndex) && !isBlank(dataRowIndex)) {
            let columnIndex = parseInt(dataColIndex, 10);
            let rowIndex = parseInt(dataRowIndex, 10);

            if (this.isAction(keyCode)) {
                this.table.events.onKeydownCell(<CellEventArgs>{ columnIndex, rowIndex, event, fromCell: target });
            }
            if (this.isNavigationKey(keyCode) && !isEditing) {
                [columnIndex, rowIndex] = this.findNextCell(columnIndex, rowIndex, keyCode, shiftKey);
                this.table.events.onActivateCell(<CellEventArgs>{ columnIndex, rowIndex, event, fromCell: target });
                if (!this.table.selection.multiple) {
                    this.table.selectRow(rowIndex);
                }
                event.preventDefault();
                event.stopPropagation();
            }
        }
    }

    private findNextCell(columnIndex: number, rowIndex: number, keyCode: number, shiftKey: boolean) {
        const maxRowIndex = this.table.rows.length;
        const maxColIndex = this.table.columns.length;

        if (keyCode === Keys.LEFT) {
            columnIndex = (columnIndex > 0) ? columnIndex - 1 : 0;
        } else if (keyCode === Keys.RIGHT) {
            columnIndex = (columnIndex < maxColIndex) ? columnIndex + 1 : 0;
        } else if (keyCode === Keys.UP) {
            rowIndex = (rowIndex > 0) ? rowIndex - 1 : 0;
        } else if (keyCode === Keys.DOWN) {
            rowIndex = (rowIndex < maxRowIndex) ? rowIndex + 1 : 0;
        } else if (keyCode === Keys.TAB && shiftKey) {
            columnIndex = (columnIndex > 0) ? columnIndex - 1 : 0;
        } else if (keyCode === Keys.TAB) {
            columnIndex = (columnIndex < maxColIndex) ? columnIndex + 1 : 0;
        }
        return [columnIndex, rowIndex];
    }

    private isAction(keyCode: number): boolean {
        const isAction =
            keyCode === Keys.ENTER ||
            keyCode === Keys.ESCAPE ||
            keyCode === Keys.KEY_F2;
        return (isAction);
    }

    private isNavigationKey(keyCode: number) {
        const isAction =
            keyCode === Keys.UP ||
            keyCode === Keys.DOWN ||
            keyCode === Keys.LEFT ||
            keyCode === Keys.RIGHT ||
            keyCode === Keys.TAB;
        return (isAction);
    }

}

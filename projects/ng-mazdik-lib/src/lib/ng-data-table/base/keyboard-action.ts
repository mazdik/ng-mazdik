import { Events } from './events';
import { DataSelection } from './data-selection';
import { CellEventArgs } from './types';
import { isBlank } from '../../common/utils';
import { Keys } from '../../common';
import { EventHelper } from './event-helper';

export interface FindCellArgs {
  columnIndex: number;
  rowIndex: number;
  keyCode: number;
  shiftKey: boolean;
  maxColIndex: number;
  maxRowIndex: number;
}

export class KeyboardAction {

  constructor(private readonly events: Events, private readonly selection: DataSelection<number>) {}

  handleEvent(event: KeyboardEvent, element: HTMLElement, maxColIndex: number, maxRowIndex: number) {
    const target = EventHelper.findCellEventTarget(event, element);
    if (!target) {
      return;
    }
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
        this.events.onKeydownCell({ columnIndex, rowIndex, event, fromCell: target } as CellEventArgs);
      }
      if (this.isNavigationKey(keyCode) && !isEditing) {
        [columnIndex, rowIndex] = this.findNextCell({columnIndex, rowIndex, keyCode, shiftKey, maxColIndex, maxRowIndex});
        this.events.onActivateCell({ columnIndex, rowIndex, event, fromCell: target } as CellEventArgs);
        if (!this.selection.multiple) {
          this.selection.selectValue(rowIndex);
        }
        event.preventDefault();
        event.stopPropagation();
      }
    }
  }

  private findNextCell(args: FindCellArgs): number[] {
    if (args.keyCode === Keys.LEFT) {
      args.columnIndex = (args.columnIndex > 0) ? args.columnIndex - 1 : 0;
    } else if (args.keyCode === Keys.RIGHT) {
      args.columnIndex = (args.columnIndex < args.maxColIndex) ? args.columnIndex + 1 : 0;
    } else if (args.keyCode === Keys.UP) {
      args.rowIndex = (args.rowIndex > 0) ? args.rowIndex - 1 : 0;
    } else if (args.keyCode === Keys.DOWN) {
      args.rowIndex = (args.rowIndex < args.maxRowIndex) ? args.rowIndex + 1 : 0;
    } else if (args.keyCode === Keys.TAB && args.shiftKey) {
      args.columnIndex = (args.columnIndex > 0) ? args.columnIndex - 1 : 0;
    } else if (args.keyCode === Keys.TAB) {
      args.columnIndex = (args.columnIndex < args.maxColIndex) ? args.columnIndex + 1 : 0;
    }
    return [args.columnIndex, args.rowIndex];
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

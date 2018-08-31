import { CellEventArgs } from './types';
import { isBlank } from './util';

export class EventHelper {

    static findCellEventTarget(event: any, element: HTMLElement): HTMLElement {
        let target = event.target;
        if (target === null) { return; }
        while (target !== element) {
            if (target.classList.contains('datatable-body-cell')) {
                break;
            }
            target = target.parentNode;
        }
        if (target === element) {
            return;
        }
        return target;
    }

    static findCellEvent(event: any, element: HTMLElement): CellEventArgs {
        const target = this.findCellEventTarget(event, element);
        if (target) {
            const dataColIndex = target.dataset.columnIndex;
            const dataRowIndex = target.dataset.rowIndex;
            if (!isBlank(dataColIndex) && !isBlank(dataRowIndex)) {
                const columnIndex = parseInt(dataColIndex, 10);
                const rowIndex = parseInt(dataRowIndex, 10);
                return <CellEventArgs>{ columnIndex, rowIndex, event, fromCell: target };
            }
        }
    }

}

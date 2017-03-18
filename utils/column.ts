import { Column } from '../types/interfaces';

export function setColumnDefaults(columns: Column[]): Column[] {
    if (!columns) return;

    let result = columns.map(function(column) {

        if (!column.hasOwnProperty('sortable')) {
            column.sortable = true;
        }

        if (!column.hasOwnProperty('filter')) {
            column.filter = true;
        }

        if (!column.hasOwnProperty('width')) {
            column.width = 150;
        }

        if (!column.hasOwnProperty('frozen')) {
            column.frozen = false;
        }

        return column;

    });
    return result;
}

export function columnsTotalWidth(columns: Column[]): number {
    let totalWidth = 0;

    for (let column of columns) {
        totalWidth = totalWidth + column.width;
    }

    return totalWidth;
}
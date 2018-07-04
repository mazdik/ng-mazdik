import { Row } from '../types';
import { Column } from './column';

export class Sequence {

    private uidRow: number = 0;

    setColumnIndexes(columns: Column[]): Column[] {
        let columnIndex = 0;
        columns.forEach(column => {
            if (!column.tableHidden) {
                column.index = columnIndex++;
            }
        });
        return columns;
    }

    setRowIndexes(rows: Row[]): Row[] {
        let rowIndex = 0;
        rows.forEach(row => {
            row.index = rowIndex++;
        });
        return rows;
    }

    setRowUid(rows: Row[]): Row[] {
        rows.forEach(row => {
            if (!row.uid) {
                row.uid = this.uidRow++;
            }
        });
        return rows;
    }

    getUidRow() {
        return this.uidRow++;
    }

}

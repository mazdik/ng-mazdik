import {Injectable} from '@angular/core';

@Injectable()
export class ExportCSV {

    columnDelimiter = ';';
    lineDelimiter = '\n';

    downloadCSV(rows: any[], filename: string, keys: string[], titles: string[]) {
        let csv = this.convertArrayOfObjectsToCSV(rows, keys, titles);
        if (csv == null) { return; }

        filename = filename || 'export.csv';

        if (!csv.match(/^data:text\/csv/i)) {
          const bom = '\uFEFF';
          csv = 'data:text/csv;charset=utf-8,' + bom + csv;
        }
        const data = encodeURI(csv);

        const link = document.createElement('a');
        link.setAttribute('href', data);
        link.setAttribute('download', filename);
        link.click();
    }

    private convertArrayOfObjectsToCSV(rows, keys, titles) {
        if (!rows || !rows.length) {
            return;
        }
        if (!keys || !keys.length) {
          keys = Object.keys(rows[0]);
        }
        if (!titles || !titles.length) {
          titles = keys;
        }
        let result = '';
        result += '"' + titles.join('"' + this.columnDelimiter + '"') + '"';
        result += this.lineDelimiter;

        rows.forEach(item => {
            let ctr = 0;
            keys.forEach(key => {
                if (ctr > 0) {
                    result += this.columnDelimiter;
                }
                result += '"' + item[key] + '"';
                ctr++;
            });
            result += this.lineDelimiter;
        });

        return result;
    }

}

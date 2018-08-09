export class Export {

    columnDelimiter = ';';
    lineDelimiter = '\n';

    downloadCSV(rows, filename: string) {
        let csv = this.convertArrayOfObjectsToCSV(rows);
        if (csv == null) { return; }

        filename = filename || 'export.csv';

        if (!csv.match(/^data:text\/csv/i)) {
            csv = 'data:text/csv;charset=utf-8,' + csv;
        }
        const data = encodeURI(csv);

        const link = document.createElement('a');
        link.setAttribute('href', data);
        link.setAttribute('download', filename);
        link.click();
    }

    private convertArrayOfObjectsToCSV(rows) {
        if (!rows || !rows.length) {
            return;
        }
        const keys = Object.keys(rows[0]);

        let result = '';
        result += '"' + keys.join('"' + this.columnDelimiter + '"') + '"';
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

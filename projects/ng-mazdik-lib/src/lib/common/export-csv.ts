import {isBlank} from './utils';

export interface CSVargs {
  rows: any[];
  keys: string[];
  titles: string[];
  filename?: string;
  columnDelimiter?: string;
  lineDelimiter?: string;
}

export function downloadCSV(args: CSVargs) {
  args.filename = args.filename || 'export.csv';
  args.columnDelimiter = args.columnDelimiter || ';';
  args.lineDelimiter = args.lineDelimiter || '\n';

  let csv = convertArrayOfObjectsToCSV(args);
  if (csv == null) { return; }

  if (!csv.match(/^data:text\/csv/i)) {
    const bom = '\uFEFF';
    csv = 'data:text/csv;charset=utf-8,' + bom + csv;
  }
  const data = encodeURI(csv);

  const link = document.createElement('a');
  link.setAttribute('href', data);
  link.setAttribute('download', args.filename);
  link.click();
}

function convertArrayOfObjectsToCSV(args: CSVargs) {
  if (!args.rows || !args.rows.length) {
    return;
  }
  if (!args.keys || !args.keys.length) {
    args.keys = Object.keys(args.rows[0]);
  }
  if (!args.titles || !args.titles.length) {
    args.titles = args.keys;
  }
  let result = '';
  result += '"' + args.titles.join('"' + args.columnDelimiter + '"') + '"';
  result += args.lineDelimiter;

  args.rows.forEach(item => {
    let ctr = 0;
    args.keys.forEach(key => {
      if (ctr > 0) {
        result += args.columnDelimiter;
      }
      const value = (item && !isBlank(item[key])) ? item[key] : '';
      result += '"' + value + '"';
      ctr++;
    });
    result += args.lineDelimiter;
  });
  return result;
}

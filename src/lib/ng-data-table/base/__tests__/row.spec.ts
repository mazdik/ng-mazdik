import { Row } from '../row';
import { Column } from '../column';
import { Settings } from '../settings';

describe('Row', () => {

  const settings = new Settings({
    rowClass: 'row-class'
  });
  const column = new Column({ name: 'id', cellClass: 'cell-class', editable: true }, settings);
  const data = { id: 10, name: 'Anastasia', $$uid: 9999, $$height: 40 };
  let row: Row;

  beforeEach(() => {
    row = new Row(data, settings);
  });

  it('should create', () => {
    expect(row['id']).toBe(data.id);
    expect(row['name']).toBe(data.name);
  });

  it('should be able to merge properties', () => {
    expect(row.$$uid).toBe(data.$$uid);
    expect(row.$$height).toBe(data.$$height);
  });

  it('should be able to clone row', () => {
    const newRow = row.clone();
    expect(row['id']).toBe(data.id);
    expect(row['name']).toBe(data.name);
    expect(newRow.$$uid).toBeNull();
    expect(newRow.$$index).toBeNull();
    expect(newRow.$$data).toBeNull();
  });

  it('should be able to create cell', () => {
    const cell = row.createCell(column);
    expect(cell.row).toBeDefined();
    expect(cell.row['id']).toBe(data.id);
  });

  it('should be able to get row class', () => {
    const cls = row.getRowClass();
    expect(cls).toBe(settings.rowClass);
  });

  it('should be able to get row class via the function', () => {
    settings.rowClass = (row) => row['id'] === 10 ? 'row-10' : 'row-class';
    const cls = row.getRowClass();
    expect(cls).toBe('row-10');
  });

  it('should be able to get cell class', () => {
    const cls = row.getCellClass(column);
    expect(cls).toBe(column.cellClass);
  });

  it('should be able to get cell class via the function', () => {
    column.cellClass = ({row, column, value}) => value === 10 ? 'cell-10' : 'cell-class';
    const cls = row.getCellClass(column);
    expect(cls).toBe('cell-10');
  });

  it('should be is editable cell', () => {
    let result = row.isEditableCell(column);
    expect(result).toBe(true);

    settings.isEditableCellProp = '$$editable';
    row.$$editable = false;
    result = row.isEditableCell(column);
    expect(result).toBe(false);
  });

});

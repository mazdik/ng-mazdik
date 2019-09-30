import { Row } from '../row';
import { Cell } from '../cell';
import { Column } from '../column';
import { Settings } from '../settings';

describe('Row', () => {

  const data = { id: 10, name: 'Anastasia', $$uid: 9999, $$height: 40 };
  let column: Column;
  let row: Row;

  beforeEach(() => {
    column = new Column({ name: 'id', cellClass: 'cell-class', editable: true });
    const settings = new Settings({
      rowClass: 'row-class',
      isEditableCellProp: '$$editable',
    });
    row = new Row(data, settings);
  });

  it('should create', () => {
    expect(row['id']).toBe(data.id);
    expect(row['name']).toBe(data.name);
    expect(Object.keys(row)).toContain('$$data');
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
    const cell = new Cell(row, column);
    expect(cell.row).toBeDefined();
    expect(cell.row['id']).toBe(data.id);
  });

  it('should be able to get row class', () => {
    const cls = row.getRowClass();
    expect(cls).toBe('row-class');
  });

  it('should be able to get row class via the function', () => {
    const settings = new Settings({
      rowClass: (r) => r['id'] === 10 ? 'row-10' : 'row-class'
    });
    row = new Row(data, settings);

    const cls = row.getRowClass();
    expect(cls).toBe('row-10');
  });

  it('should be able to get cell class', () => {
    const cls = row.getCellClass(column);
    expect(cls).toBe(column.cellClass);
  });

  it('should be able to get cell class via the function', () => {
    column.cellClass = ({r, col, value}) => value === 10 ? 'cell-10' : 'cell-class';
    const cls = row.getCellClass(column);
    expect(cls).toBe('cell-10');
  });

  it('should be is editable cell', () => {
    let result = row.isEditableCell(column);
    expect(result).toBe(true);

    row.$$editable = false;
    result = row.isEditableCell(column);
    expect(result).toBe(false);
  });

  it('should be able to merge row', () => {
    const newRow = { id: 11, name: 'Test'};
    row.merge(newRow);

    expect(row['id']).toBe(newRow.id);
    expect(row['name']).toBe(newRow.name);
    expect(row.$$data['id']).toBe(newRow.id);
    expect(row.$$data['name']).toBe(newRow.name);
  });

  it('should be able to backup row', () => {
    row.backup();
    row['id'] = 33;

    expect(row['id']).toBe(33);
    expect(row.$$data['id']).toBe(data.id);
  });

  it('should be able to revert row changes', () => {
    row['id'] = 33;
    expect(row['id']).toBe(33);

    row.revertChanges([column]);
    expect(row['id']).not.toBe(33);
    expect(row['id']).toBe(data.id);
  });

});

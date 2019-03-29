import { DataTable } from '../data-table';
import { Settings } from '../settings';
import { ColumnBase } from '../column-base';

describe('DataTable', () => {
  const settings = new Settings({});
  const columns = [
    <ColumnBase>{name: 'date', frozen: true, width: 100},
    <ColumnBase>{name: 'gender', frozen: true, width: 100},
    <ColumnBase>{name: 'test1', frozen: false, width: 100},
    <ColumnBase>{name: 'test2', frozen: false, width: 100},
    <ColumnBase>{name: 'test3', frozen: false, width: 100},
    <ColumnBase>{name: 'test4', tableHidden: true, width: 100},
  ];
  let dataTable: DataTable;

  beforeEach(() => {
    dataTable = new DataTable(columns, settings);
    const rows = [
      { date: new Date(2017, 8, 5), gender: 'f' },
      { date: new Date(2016, 11, 1), gender: 'm' },
      { date: new Date(2019, 3, 7), gender: 'f' },
      { date: new Date(2018, 4, 3), gender: 'm' }
    ];
    dataTable.rows = rows;
  });

  it('should be able to init columns', () => {
    dataTable.initColumns();
    expect(dataTable.frozenColumns.length).toBe(2);
    expect(dataTable.scrollableColumns.length).toBe(3);
  });

  it('should be able to get rows', () => {
    expect(dataTable.rows.length).toBe(4);
    expect(Object.keys(dataTable.rows[0])).toContain('$$uid');
    expect(Object.keys(dataTable.rows[0])).toContain('$$index');
    expect(Object.keys(dataTable.rows[0])).toContain('$$data');
  });

  it('should be able to select row', () => {
    const row = dataTable.rows[0];
    dataTable.selectRow(row.$$index);
    const selected = dataTable.getSelection()[0];
    expect(selected.$$index).toBe(row.$$index);
  });

  it('should be able to add row', () => {
    const spy = jasmine.createSpy('changed spy');
    dataTable.events.rowsChanged$.subscribe(spy);

    const row = { date: new Date(2020, 8, 5), gender: 'f' };
    dataTable.addRow(row);

    expect(spy).toHaveBeenCalledTimes(1);
    expect(dataTable.rows.length).toBe(5);
    expect(dataTable.pager.total).toBe(5);
    expect(Object.keys(dataTable.rows[4])).toContain('$$uid');
    expect(Object.keys(dataTable.rows[4])).toContain('$$index');
    expect(Object.keys(dataTable.rows[4])).toContain('$$data');
  });

  it('should be able to delete row', () => {
    const spy = jasmine.createSpy('changed spy');
    dataTable.events.rowsChanged$.subscribe(spy);

    expect(dataTable.rows.length).toBe(4);
    dataTable.deleteRow(dataTable.rows[dataTable.rows.length - 1]);

    expect(spy).toHaveBeenCalledTimes(1);
    expect(dataTable.rows.length).toBe(3);
    expect(dataTable.pager.total).toBe(3);
  });

  it('should be able to merge row', () => {
    const spy = jasmine.createSpy('changed spy');
    dataTable.events.rowsChanged$.subscribe(spy);

    const row = { date: new Date(2020, 8, 5), gender: 'male' };
    dataTable.mergeRow(dataTable.rows[0], row);

    expect(spy).toHaveBeenCalledTimes(1);
    expect(dataTable.rows[0].date).toEqual(new Date(2020, 8, 5));
    expect(dataTable.rows[0].gender).toBe('male');
  });

  it('should be able cell to edit mode', () => {
    const spy = jasmine.createSpy('changed spy');
    dataTable.events.cellEditModeSource$.subscribe(spy);

    dataTable.editCell(0, 1, true);
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should be able to revert row changes', () => {
    const spy = jasmine.createSpy('changed spy');
    dataTable.events.rowsChanged$.subscribe(spy);

    dataTable.rows[3].date = new Date(2022, 4, 3);
    expect(dataTable.rowChanged(dataTable.rows[3])).toBe(true);
    dataTable.revertRowChanges(dataTable.rows[3]);

    expect(spy).toHaveBeenCalledTimes(1);
    expect(dataTable.rows[3].date).toEqual(new Date(2018, 4, 3));
  });

  it('should be able to clone row', () => {
    const newRow = dataTable.cloneRow(dataTable.rows[0]);

    expect(newRow.$$uid).toBeNull();
    expect(newRow.$$index).toBeNull();
    expect(newRow.$$data).toBeNull();
  });

  it('should be able to concat rows', () => {
    expect(dataTable.rows.length).toBe(4);
    expect(dataTable.sequence.curUidRow()).toBe(4);

    const newRows = [
      { date: new Date(2020, 8, 5), gender: 'f' },
      { date: new Date(2020, 8, 6), gender: 'm' }
    ];
    dataTable.rows = dataTable.rows.concat(newRows);
    expect(dataTable.rows.length).toBe(6);
    expect(dataTable.sequence.curUidRow()).toBe(6);
  });

});

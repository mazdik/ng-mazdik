import { ColumnBase, Settings, DataTable, Row } from '../index';

describe('DataTable', () => {
  const settings = new Settings({});
  const columns: ColumnBase[] = [
    {name: 'date', title: '', frozen: true, width: 100},
    {name: 'test1', title: '', frozen: false, width: 100},
    {name: 'gender', title: '', frozen: true, width: 100},
    {name: 'test2', title: '', frozen: false, width: 100},
    {name: 'test3', title: '', frozen: false, width: 100},
    {name: 'test4', title: '', tableHidden: true, width: 100},
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
    dataTable.events.cellSource$.subscribe(spy);

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

  it('should be able to concat rows', () => {
    expect(dataTable.rows.length).toBe(4);
    expect(dataTable.rowModelGenerator.curUidRow()).toBe(4);

    const newRows = [
      { date: new Date(2020, 8, 5), gender: 'f' },
      { date: new Date(2020, 8, 6), gender: 'm' }
    ];
    dataTable.rows = dataTable.rows.concat(newRows);
    expect(dataTable.rows.length).toBe(6);
    expect(dataTable.rowModelGenerator.curUidRow()).toBe(6);
  });

  it('row should be instanceof Row', () => {
    expect(dataTable.rows[0] instanceof Row).toBe(true);
  });

  describe('DataTable multiple selection', () => {

    beforeEach(() => {
      const options = new Settings({ selectionMultiple: true});
      dataTable = new DataTable(columns, options);
      const rows = [
        { date: new Date(2017, 8, 5), gender: 'f' },
        { date: new Date(2016, 11, 1), gender: 'm' },
        { date: new Date(2019, 3, 7), gender: 'f' },
        { date: new Date(2018, 4, 3), gender: 'm' }
      ];
      dataTable.rows = rows;
    });

    it('should be able all row selected', () => {
      dataTable.selection.selectAll([0, 1, 2, 3]);
      const result = dataTable.allRowsSelected();
      expect(result).toBe(true);
    });

    it('should be able partially selected', () => {
      dataTable.selectRow(1);
      const result = dataTable.partiallySelected();
      expect(result).toBe(true);
    });

    it('should be able to select all rows', () => {
      dataTable.selectAllRows();
      const result = dataTable.allRowsSelected();
      expect(result).toBe(true);
    });

    it('should be able to togle select all rows', () => {
      dataTable.selectAllRows();
      dataTable.selectAllRows();
      const result = dataTable.allRowsSelected();
      expect(result).toBe(false);
    });

  });

});

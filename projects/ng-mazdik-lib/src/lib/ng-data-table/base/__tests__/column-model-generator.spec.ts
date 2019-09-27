import { ColumnBase, Column, Settings, ColumnModelGenerator } from '../index';

describe('ColumnModelGenerator', () => {
  const baseColumns: ColumnBase[] = [
    {name: 'date', title: '', frozen: true, width: 100},
    {name: 'test1', title: '', frozen: false, width: 100},
    {name: 'gender', title: '', frozen: true, width: 100},
    {name: 'test2', title: '', frozen: false, width: 100},
    {name: 'test3', title: '', frozen: false, width: 100},
    {name: 'test4', title: '', tableHidden: true, width: 100},
  ];
  let columnModelGenerator: ColumnModelGenerator;

  beforeEach(() => {
    const settings = new Settings({});
    columnModelGenerator = new ColumnModelGenerator(settings);
  });

  it('should be able to create columns', () => {
    const columns = columnModelGenerator.createColumns(baseColumns);
    expect(columns.length).toBe(baseColumns.length);
    expect(columns[0] instanceof Column).toBe(true);
  });

  it('should be able add checkbox column', () => {
    const settings = new Settings({selectionMode: 'checkbox'});
    columnModelGenerator = new ColumnModelGenerator(settings);

    const columns = columnModelGenerator.createColumns([...baseColumns]);
    expect(columns.length).toBe(baseColumns.length + 1);
    expect(columns[0].name).toBe(ColumnModelGenerator.checkboxColumn.name);
  });

  it('should be able to prepare columns', () => {
    const columns = columnModelGenerator.createColumns(baseColumns);
    const preparedColumns = columnModelGenerator.prepareColumns(columns);
    const frozenColumns = preparedColumns.filter(x => x.frozen);
    const scrollableColumns = preparedColumns.filter(x => !x.frozen);
    expect(frozenColumns.length).toBe(2);
    expect(scrollableColumns.length).toBe(3);
  });

  it('should be able to first sorted frozen columns', () => {
    const columns = columnModelGenerator.createColumns(baseColumns);
    const preparedColumns = columnModelGenerator.prepareColumns(columns);
    expect(preparedColumns[0].frozen).toBe(true);
    expect(preparedColumns[1].frozen).toBe(true);
    expect(preparedColumns[2].frozen).toBe(false);
  });

  it('should be able to set column index', () => {
    const columns = columnModelGenerator.createColumns(baseColumns);
    const preparedColumns = columnModelGenerator.prepareColumns(columns);
    expect(preparedColumns[0].index).toBe(0); // frozen column sorted
    expect(preparedColumns[1].index).toBe(2); // frozen column sorted
    expect(preparedColumns[2].index).toBe(1);
    expect(preparedColumns[3].index).toBe(3);
  });

});

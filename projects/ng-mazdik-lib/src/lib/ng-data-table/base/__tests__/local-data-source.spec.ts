import { LocalDataSource } from '../local-data-source';
import { DataPager } from '../data-pager';
import { DataSort } from '../data-sort';
import { DataFilter } from '../data-filter';
import { Settings } from '../settings';
import { Row } from '../row';

describe('LocalDataSource', () => {

  const dataFilter = new DataFilter();
  const pager = new DataPager();
  const sorter = new DataSort();
  const settings = new Settings({});
  const dataSource = new LocalDataSource(dataFilter, pager, sorter, settings);

  const rows: Row[] = [
    new Row({ date: new Date(2017, 8, 5), gender: 'f', id: 10, name: 'Anastasia', cityId: 1, $$index: 0, $$uid: 0, $$data: {} }),
    new Row({ date: new Date(2019, 3, 7), gender: 'f', id: 30, name: 'Gabriela', cityId: 1, $$index: 1, $$uid: 1, $$data: {} }),
    new Row({ date: new Date(2016, 11, 1), gender: 'm', id: 20, name: 'Aaron', cityId: 1, $$index: 2, $$uid: 2, $$data: {} }),
    new Row({ date: new Date(2018, 4, 3), gender: 'm', id: 40, name: 'Daniel', cityId: 2, $$index: 3, $$uid: 3, $$data: {} }),
  ];

  beforeEach(() => {
    dataSource.setRows(rows);
  });

  it('should be able set rows', () => {
    expect(dataSource.localRows.length).toBe(4);
    expect(dataFilter.filters).toEqual({});
    expect(sorter.sortMeta).toEqual([]);
    expect(pager.current).toBe(1);
  });

  it('should be able get rows', () => {
    const result = dataSource.getRows();
    expect(result.length).toBe(4);
    expect(pager.total).toBe(4);
  });

  it('should be able add row', () => {
    const newRow = new Row({ date: new Date(2018, 7, 3), gender: 'm', id: 50, name: 'Bob', cityId: 2, $$index: 4, $$uid: 4, $$data: {} });
    dataSource.post(newRow);
    expect(dataSource.localRows.length).toBe(5);
  });

  it('should be able edit row', () => {
    let newRow = new Row({ date: new Date(2018, 7, 3), gender: 'm', id: 50, name: 'Bob', cityId: 2, $$index: 4, $$uid: 4, $$data: {} });
    dataSource.post(newRow);
    newRow = new Row({ date: new Date(2018, 7, 3), gender: 'm', id: 55, name: 'Bob', cityId: 2, $$index: 4, $$uid: 4, $$data: {} });
    dataSource.put(newRow);
    expect(dataSource.localRows[4]['id']).toBe(55);
  });

  it('should be able delete row', () => {
    dataSource.delete(rows[0]);
    expect(dataSource.localRows.length).toBe(3);
  });

});

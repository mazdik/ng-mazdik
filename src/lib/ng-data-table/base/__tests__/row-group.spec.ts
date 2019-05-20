import { RowGroup } from '../row-group';
import { Column } from '../column';
import { Row } from '../row';

describe('RowGroup', () => {
  const groupBy = ['cityId', 'gender'];
  const columns = [
    new Column({ name: 'cityId' }),
    new Column({ name: 'gender' }),
    new Column({ name: 'id', aggregation: 'max' }),
  ];
  const rows: Row[] = [
    new Row({ date: new Date(2017, 8, 5), gender: 'f', id: 10, name: 'Anastasia', cityId: 1, $$index: 0, $$uid: 0, $$data: {} }),
    new Row({ date: new Date(2019, 3, 7), gender: 'f', id: 30, name: 'Gabriela', cityId: 1, $$index: 1, $$uid: 1, $$data: {} }),
    new Row({ date: new Date(2016, 11, 1), gender: 'm', id: 20, name: 'Aaron', cityId: 1, $$index: 2, $$uid: 2, $$data: {} }),
    new Row({ date: new Date(2018, 4, 3), gender: 'm', id: 40, name: 'Daniel', cityId: 2, $$index: 3, $$uid: 3, $$data: {} }),
  ];
  const rowGroup = new RowGroup(groupBy, columns);

  beforeEach(() => {
    rowGroup.updateRowGroupMetadata(rows);
  });

  it('should be able group enabled', () => {
    expect(rowGroup.groupEnabled).toBe(true);
    expect(rowGroup.groupRowsBy).toEqual(groupBy);
  });

  it('should be able aggregation enabled', () => {
    expect(rowGroup.aggregationEnabled).toBe(true);
    expect(rowGroup.aggregates).toEqual([{ field: 'id', type: 'max' }]);
  });

  it('should be able update row group metadata', () => {
    rowGroup.updateRowGroupMetadata(rows);
    expect(rowGroup.rowGroupMetadata).not.toBeUndefined();
    expect(rowGroup.getRowSummary()).not.toBeUndefined();
  });

  it('should be able get row group name', () => {
    const result = rowGroup.getRowGroupName(rows[0]);
    expect(result).toBe('1, f');
  });

  it('should be able get row group size', () => {
    const result = rowGroup.getRowGroupSize(rows[0]);
    expect(result).toBe(2);
  });

  it('should be able to define a row as a group row', () => {
    let result = rowGroup.isRowGroup(rows[0]);
    expect(result).toBe(true);

    result = rowGroup.isRowGroup(rows[1]);
    expect(result).toBe(false);

    result = rowGroup.isRowGroup(rows[2]);
    expect(result).toBe(true);

    result = rowGroup.isRowGroup(rows[3]);
    expect(result).toBe(true);
  });

  it('should be able to define a row as a summary row', () => {
    let result = rowGroup.isRowGroupSummary(rows[0]);
    expect(result).toBe(false);

    result = rowGroup.isRowGroupSummary(rows[1]);
    expect(result).toBe(true);

    result = rowGroup.isRowGroupSummary(rows[2]);
    expect(result).toBe(true);

    result = rowGroup.isRowGroupSummary(rows[3]);
    expect(result).toBe(true);
  });

  it('should be able to get row group summary', () => {
    const result = rowGroup.getRowGroupSummary(rows[0]);
    expect(result).not.toBeUndefined();
  });

  it('should be able to get group rows', () => {
    const result = rowGroup.getGroupRows(rows[0], rows);
    expect(result.length).toBe(2);
    expect(result[0]).toEqual(rows[0]);
    expect(result[1]).toEqual(rows[1]);
  });

  it('grand total row should be instanceof Row', () => {
    expect(rowGroup.getRowSummary() instanceof Row).toBe(true);
  });

  it('row group summary should be instanceof Row', () => {
    const result = rowGroup.getRowGroupSummary(rows[0]);
    expect(result instanceof Row).toBe(true);
  });

});

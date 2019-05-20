import { DataAggregation } from '../data-aggregation';
import { DataSort } from '../data-sort';

describe('DataAggregation', () => {

  const rows = [
    { date: new Date(2017, 8, 5), gender: 'f', id: 10, name: 'Anastasia', cityId: 1 },
    { date: new Date(2016, 11, 1), gender: 'm', id: 20, name: 'Aaron', cityId: 1 },
    { date: new Date(2019, 3, 7), gender: 'f', id: 30, name: 'Gabriela', cityId: 1 },
    { date: new Date(2018, 4, 3), gender: 'm', id: 40, name: 'Daniel', cityId: 2 },
    { date: undefined, gender: undefined, id: undefined, name: undefined, cityId: undefined },
  ];
  const dataAggregation = new DataAggregation();
  const dataSort = new DataSort(true);

  describe('group by single column', () => {

    const groupBy = ['gender'];
    dataSort.clear();
    dataSort.set(groupBy); // asc
    const sortedRows = dataSort.sortRows([...rows]);

    it('should be able to group by single column', () => {
      const result = dataAggregation.groupMetaData(sortedRows, groupBy);

      expect(result['f'].index).toBe(0);
      expect(result['f'].size).toBe(2);

      expect(result['m'].index).toBe(2);
      expect(result['m'].size).toBe(2);

      expect(result[''].index).toBe(4);
      expect(result[''].size).toBe(1);
    });

    it('should be able to aggregate sum', () => {
      dataAggregation.aggregates = [{ field: 'id', type: 'sum' }];
      const result = dataAggregation.groupMetaData(sortedRows, groupBy);

      expect(result['f'].aggRow.id).toBe(40);
      expect(result['m'].aggRow.id).toBe(60);
    });

    it('should be able to aggregate min', () => {
      dataAggregation.aggregates = [{ field: 'id', type: 'min' }];
      const result = dataAggregation.groupMetaData(sortedRows, groupBy);

      expect(result['f'].aggRow.id).toBe(10);
      expect(result['m'].aggRow.id).toBe(20);
    });

    it('should be able to aggregate max', () => {
      dataAggregation.aggregates = [{ field: 'id', type: 'max' }];
      const result = dataAggregation.groupMetaData(sortedRows, groupBy);

      expect(result['f'].aggRow.id).toBe(30);
      expect(result['m'].aggRow.id).toBe(40);
    });

    it('should be able to aggregate count', () => {
      dataAggregation.aggregates = [{ field: 'id', type: 'count' }];
      const result = dataAggregation.groupMetaData(sortedRows, groupBy);

      expect(result['f'].aggRow.id).toBe(2);
      expect(result['m'].aggRow.id).toBe(2);
    });

    it('should be able to aggregate average', () => {
      dataAggregation.aggregates = [{ field: 'id', type: 'average' }];
      const result = dataAggregation.groupMetaData(sortedRows, groupBy);

      expect(result['f'].aggRow.id).toBe(20);
      expect(result['m'].aggRow.id).toBe(30);
    });

    it('should be able to aggregate grand total sum', () => {
      dataAggregation.aggregates = [{ field: 'id', type: 'sum' }];
      const result = dataAggregation.grandTotal(rows);

      expect(result['id']).toBe(100);
    });

  });

  describe('group by multiple columns', () => {

    const groupBy = ['cityId', 'gender'];
    dataSort.clear();
    dataSort.set(groupBy); // asc
    const sortedRows = dataSort.sortRows([...rows]);

    it('should be able to group by multiple columns', () => {
      const result = dataAggregation.groupMetaData(sortedRows, groupBy);

      expect(result['1, f'].index).toBe(0);
      expect(result['1, f'].size).toBe(2);

      expect(result['1, m'].index).toBe(2);
      expect(result['1, m'].size).toBe(1);

      expect(result['2, m'].index).toBe(3);
      expect(result['2, m'].size).toBe(1);
    });

    it('should be able to aggregate sum', () => {
      dataAggregation.aggregates = [{ field: 'id', type: 'sum' }];
      const result = dataAggregation.groupMetaData(sortedRows, groupBy);

      expect(result['1, f'].aggRow.id).toBe(40);
      expect(result['1, m'].aggRow.id).toBe(20);
      expect(result['2, m'].aggRow.id).toBe(40);
    });

    it('should be able to aggregate min', () => {
      dataAggregation.aggregates = [{ field: 'id', type: 'min' }];
      const result = dataAggregation.groupMetaData(sortedRows, groupBy);

      expect(result['1, f'].aggRow.id).toBe(10);
      expect(result['1, m'].aggRow.id).toBe(20);
      expect(result['2, m'].aggRow.id).toBe(40);
    });

    it('should be able to aggregate max', () => {
      dataAggregation.aggregates = [{ field: 'id', type: 'max' }];
      const result = dataAggregation.groupMetaData(sortedRows, groupBy);

      expect(result['1, f'].aggRow.id).toBe(30);
      expect(result['1, m'].aggRow.id).toBe(20);
      expect(result['2, m'].aggRow.id).toBe(40);
    });

    it('should be able to aggregate count', () => {
      dataAggregation.aggregates = [{ field: 'id', type: 'count' }];
      const result = dataAggregation.groupMetaData(sortedRows, groupBy);

      expect(result['1, f'].aggRow.id).toBe(2);
      expect(result['1, m'].aggRow.id).toBe(1);
      expect(result['2, m'].aggRow.id).toBe(1);
    });

    it('should be able to aggregate average', () => {
      dataAggregation.aggregates = [{ field: 'id', type: 'average' }];
      const result = dataAggregation.groupMetaData(sortedRows, groupBy);

      expect(result['1, f'].aggRow.id).toBe(20);
      expect(result['1, m'].aggRow.id).toBe(20);
      expect(result['2, m'].aggRow.id).toBe(40);
    });

    it('should be able to aggregate grand total sum', () => {
      dataAggregation.aggregates = [{ field: 'id', type: 'sum' }];
      const result = dataAggregation.grandTotal(rows);

      expect(result['id']).toBe(100);
    });

  });

});

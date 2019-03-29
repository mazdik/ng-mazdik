import { DataFilter, FilterOperator } from '../data-filter';

describe('DataFilter', () => {

  const rows = [
    { date: new Date(2017, 8, 5), gender: 'f', id: 10, name: 'Anastasia' },
    { date: new Date(2016, 11, 1), gender: 'm', id: 20, name: 'Aaron' },
    { date: new Date(2019, 3, 7), gender: 'f', id: 30, name: 'Gabriela' },
    { date: new Date(2018, 4, 3), gender: 'm', id: 40, name: 'Daniel' },
    { date: undefined, gender: undefined, id: undefined, name: undefined },
  ];

  describe('set filter', () => {
    const dataFilter = new DataFilter();

    it('should be able to set filter', () => {
      dataFilter.setFilter('f', 'gender', FilterOperator.EQUALS);
      expect(dataFilter.hasFilter('gender')).toBe(true);
      expect(dataFilter.hasFilters()).toBe(true);

      dataFilter.clear();
      expect(dataFilter.hasFilter('gender')).toBe(false);
      expect(dataFilter.hasFilters()).toBe(false);

      dataFilter.globalFilterValue = 'test';
      expect(dataFilter.hasFilter('gender')).toBe(false);
      expect(dataFilter.hasFilters()).toBe(true);

      dataFilter.clear();
      dataFilter.setFilter(new Date(2017, 8, 5), 'date', FilterOperator.EQUALS);
      expect(dataFilter.hasFilter('date')).toBe(true);
    });
  });

  describe('filter date values', () => {
    const dataFilter = new DataFilter();

    it('should be able to filter date EQUALS', () => {
      dataFilter.setFilter(new Date(2017, 8, 5), 'date', FilterOperator.EQUALS);
      const result = dataFilter.filterRows(rows);
      expect(result.length).toBe(1);
      expect(result[0]).toEqual(rows[0]);
    });

    it('should be able to filter date NOT_EQUAL', () => {
      dataFilter.setFilter(new Date(2017, 8, 5), 'date', FilterOperator.NOT_EQUAL);
      const result = dataFilter.filterRows(rows);
      expect(result.length).toBe(4);
    });

    it('should be able to filter date IN_RANGE', () => {
      dataFilter.setFilter(new Date(2018, 1, 5), 'date', FilterOperator.IN_RANGE, new Date(2018, 5, 5));
      const result = dataFilter.filterRows(rows);
      expect(result.length).toBe(1);
      expect(result[0]).toEqual(rows[3]);
    });

    it('should be able to filter date LESS_THAN', () => {
      dataFilter.setFilter(new Date(2017, 8, 5), 'date', FilterOperator.LESS_THAN);
      const result = dataFilter.filterRows(rows);
      expect(result.length).toBe(1);
      expect(result[0]).toEqual(rows[1]);
    });

    it('should be able to filter date LESS_THAN_OR_EQUAL', () => {
      dataFilter.setFilter(new Date(2017, 8, 5), 'date', FilterOperator.LESS_THAN_OR_EQUAL);
      const result = dataFilter.filterRows(rows);
      expect(result.length).toBe(2);
    });

    it('should be able to filter date GREATER_THAN', () => {
      dataFilter.setFilter(new Date(2017, 8, 5), 'date', FilterOperator.GREATER_THAN);
      const result = dataFilter.filterRows(rows);
      expect(result.length).toBe(2);
    });

    it('should be able to filter date GREATER_THAN_OR_EQUAL', () => {
      dataFilter.setFilter(new Date(2017, 8, 5), 'date', FilterOperator.GREATER_THAN_OR_EQUAL);
      const result = dataFilter.filterRows(rows);
      expect(result.length).toBe(3);
    });

    it('should be able to filter date IS_EMPTY', () => {
      dataFilter.setFilter(new Date(2017, 8, 5), 'date', FilterOperator.IS_EMPTY);
      const result = dataFilter.filterRows(rows);
      expect(result.length).toBe(1);
    });

    it('should be able to filter date IS_NOT_EMPTY', () => {
      dataFilter.setFilter(new Date(2017, 8, 5), 'date', FilterOperator.IS_NOT_EMPTY);
      const result = dataFilter.filterRows(rows);
      expect(result.length).toBe(4);
    });

  });

  describe('filter number values', () => {
    const dataFilter = new DataFilter();

    it('should be able to filter number EQUALS', () => {
      dataFilter.setFilter(40, 'id', FilterOperator.EQUALS);
      const result = dataFilter.filterRows(rows);
      expect(result.length).toBe(1);
      expect(result[0]).toEqual(rows[3]);
    });

    it('should be able to filter number NOT_EQUAL', () => {
      dataFilter.setFilter(40, 'id', FilterOperator.NOT_EQUAL);
      const result = dataFilter.filterRows(rows);
      expect(result.length).toBe(4);
    });

    it('should be able to filter number IN_RANGE', () => {
      dataFilter.setFilter(35, 'id', FilterOperator.IN_RANGE, 45);
      const result = dataFilter.filterRows(rows);
      expect(result.length).toBe(1);
      expect(result[0]).toEqual(rows[3]);
    });

    it('should be able to filter number LESS_THAN', () => {
      dataFilter.setFilter(20, 'id', FilterOperator.LESS_THAN);
      const result = dataFilter.filterRows(rows);
      expect(result.length).toBe(1);
    });

    it('should be able to filter number LESS_THAN_OR_EQUAL', () => {
      dataFilter.setFilter(20, 'id', FilterOperator.LESS_THAN_OR_EQUAL);
      const result = dataFilter.filterRows(rows);
      expect(result.length).toBe(2);
    });

    it('should be able to filter number GREATER_THAN', () => {
      dataFilter.setFilter(20, 'id', FilterOperator.GREATER_THAN);
      const result = dataFilter.filterRows(rows);
      expect(result.length).toBe(2);
    });

    it('should be able to filter number GREATER_THAN_OR_EQUAL', () => {
      dataFilter.setFilter(20, 'id', FilterOperator.GREATER_THAN_OR_EQUAL);
      const result = dataFilter.filterRows(rows);
      expect(result.length).toBe(3);
    });

    it('should be able to filter number IS_EMPTY', () => {
      dataFilter.setFilter(10, 'id', FilterOperator.IS_EMPTY);
      const result = dataFilter.filterRows(rows);
      expect(result.length).toBe(1);
    });

    it('should be able to filter number IS_NOT_EMPTY', () => {
      dataFilter.setFilter(10, 'id', FilterOperator.IS_NOT_EMPTY);
      const result = dataFilter.filterRows(rows);
      expect(result.length).toBe(4);
    });

    it('should be able to filter number IN', () => {
      dataFilter.setFilter([10, 30], 'id', FilterOperator.IN);
      const result = dataFilter.filterRows(rows);
      expect(result.length).toBe(2);
      expect(result[0]).toEqual(rows[0]);
      expect(result[1]).toEqual(rows[2]);
    });

    it('should be able to filter number IN (no array)', () => {
      dataFilter.setFilter(10, 'id', FilterOperator.IN);
      const result = dataFilter.filterRows(rows);
      expect(result.length).toBe(1);
    });

  });

  describe('filter string values', () => {
    const dataFilter = new DataFilter();

    it('should be able to filter string EQUALS', () => {
      dataFilter.setFilter('Anastasia', 'name', FilterOperator.EQUALS);
      const result = dataFilter.filterRows(rows);
      expect(result.length).toBe(1);
      expect(result[0]).toEqual(rows[0]);
    });

    it('should be able to filter string NOT_EQUAL', () => {
      dataFilter.setFilter('Anastasia', 'name', FilterOperator.NOT_EQUAL);
      const result = dataFilter.filterRows(rows);
      expect(result.length).toBe(4);
    });

    it('should be able to filter string STARTS_WITH', () => {
      dataFilter.setFilter('a', 'name', FilterOperator.STARTS_WITH);
      const result = dataFilter.filterRows(rows);
      expect(result.length).toBe(2);
    });

    it('should be able to filter string ENDS_WITH', () => {
      dataFilter.setFilter('n', 'name', FilterOperator.ENDS_WITH);
      const result = dataFilter.filterRows(rows);
      expect(result.length).toBe(1);
    });

    it('should be able to filter string CONTAINS', () => {
      dataFilter.setFilter('ie', 'name', FilterOperator.CONTAINS);
      const result = dataFilter.filterRows(rows);
      expect(result.length).toBe(2);
    });

    it('should be able to filter string NOT_CONTAINS', () => {
      dataFilter.setFilter('ie', 'name', FilterOperator.NOT_CONTAINS);
      const result = dataFilter.filterRows(rows);
      expect(result.length).toBe(3);
    });

    it('should be able to filter string IS_EMPTY', () => {
      dataFilter.setFilter('a', 'name', FilterOperator.IS_EMPTY);
      const result = dataFilter.filterRows(rows);
      expect(result.length).toBe(1);
    });

    it('should be able to filter string IS_NOT_EMPTY', () => {
      dataFilter.setFilter('a', 'name', FilterOperator.IS_NOT_EMPTY);
      const result = dataFilter.filterRows(rows);
      expect(result.length).toBe(4);
    });

  });

  describe('global filter', () => {
    const dataFilter = new DataFilter();

    it('should be able to filter string in all columns STARTS_WITH', () => {
      dataFilter.globalFilterValue = 'f';
      let result = dataFilter.filterRows(rows);
      expect(result.length).toBe(2);

      dataFilter.globalFilterValue = 'a';
      result = dataFilter.filterRows(rows);
      expect(result.length).toBe(2);
    });

  });

});

import {DataFilter, FilterOperator} from '../data-filter';

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
      expect(result[0]).toEqual({ date: new Date(2017, 8, 5), gender: 'f' });
      expect(result.length).toBe(1);
    });

    it('should be able to filter date NOT_EQUAL', () => {
      dataFilter.setFilter(new Date(2017, 8, 5), 'date', FilterOperator.NOT_EQUAL);
      const result = dataFilter.filterRows(rows);
      expect(result.length).toBe(4);
    });

    it('should be able to filter date IN_RANGE', () => {
      dataFilter.setFilter(new Date(2018, 1, 5), 'date', FilterOperator.IN_RANGE, new Date(2018, 5, 5));
      const result = dataFilter.filterRows(rows);
      expect(result[0]).toEqual({ date: new Date(2018, 4, 3), gender: 'm' });
      expect(result.length).toBe(1);
    });

    it('should be able to filter date LESS_THAN', () => {
      dataFilter.setFilter(new Date(2017, 8, 5), 'date', FilterOperator.LESS_THAN);
      const result = dataFilter.filterRows(rows);
      expect(result[0]).toEqual({ date: new Date(2016, 11, 1), gender: 'm' });
      expect(result.length).toBe(1);
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
    // TODO
  });

  describe('filter string values', () => {
    const dataFilter = new DataFilter();
    // TODO
  });

});

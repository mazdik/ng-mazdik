import {DataFilter, FilterOperator} from '../data-filter';

describe('DataFilter', () => {

  const rows = [
    { date: new Date(2017, 8, 5), gender: 'f' },
    { date: new Date(2016, 11, 1), gender: 'm' },
    { date: new Date(2019, 3, 7), gender: 'f' },
    { date: new Date(2018, 4, 3), gender: 'm' }
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
  });

});

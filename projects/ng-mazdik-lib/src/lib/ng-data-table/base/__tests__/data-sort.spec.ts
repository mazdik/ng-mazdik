import { DataSort } from '../data-sort';

describe('DataSort', () => {

  let dataSort: DataSort;
  let rows: any[];

  beforeEach(() => {
    rows = [
      { date: new Date(2017, 8, 5), gender: 'f' },
      { date: new Date(2016, 11, 1), gender: 'm' },
      { date: new Date(2019, 3, 7), gender: 'f' },
      { date: new Date(2018, 4, 3), gender: 'm' }
    ];
  });

  describe('single sort', () => {

    beforeEach(() => {
      dataSort = new DataSort();
    });

    it('should be able to set order', () => {
      dataSort.setOrder('date');
      expect(dataSort.getOrder('date')).toBe(1);

      dataSort.setOrder('date');
      expect(dataSort.getOrder('date')).toBe(-1);

      dataSort.setOrder('date');
      expect(dataSort.getOrder('date')).toBe(0);
    });

    it('should be able to set order columns', () => {
      dataSort.setOrder('date');
      expect(dataSort.getOrder('date')).toBe(1);
      expect(dataSort.sortMeta.length).toBe(1);

      dataSort.setOrder('gender');
      expect(dataSort.getOrder('gender')).toBe(1);
      expect(dataSort.getOrder('date')).toBe(0);
      expect(dataSort.sortMeta.length).toBe(1);
    });

    it('should sort date values asc', () => {
      dataSort.setOrder('date');
      const result = dataSort.sortRows(rows);
      expect(result[0]).toEqual({ date: new Date(2016, 11, 1), gender: 'm' });
    });

    it('should sort date values desc', () => {
      dataSort.setOrder('date'); // asc
      dataSort.setOrder('date'); // desc
      const result = dataSort.sortRows(rows);
      expect(result[0]).toEqual({ date: new Date(2019, 3, 7), gender: 'f' });
    });

    it('should sort date values none', () => {
      dataSort.setOrder('date'); // asc
      dataSort.setOrder('date'); // desc
      dataSort.setOrder('date'); // none
      const result = dataSort.sortRows(rows);
      expect(result[0]).toEqual({ date: new Date(2017, 8, 5), gender: 'f' });
    });

  });

  describe('multiple sort', () => {

    beforeEach(() => {
      dataSort = new DataSort(true);
    });

    it('should be able to set order columns', () => {
      dataSort.setOrder('date');
      expect(dataSort.getOrder('date')).toBe(1);
      expect(dataSort.sortMeta.length).toBe(1);

      dataSort.setOrder('gender');
      expect(dataSort.getOrder('gender')).toBe(1);
      expect(dataSort.getOrder('date')).toBe(1);
      expect(dataSort.sortMeta.length).toBe(2);
    });

    it('should be able to set order array with column names', () => {
      dataSort.set(['date', 'gender']);
      expect(dataSort.getOrder('gender')).toBe(1);
      expect(dataSort.getOrder('date')).toBe(1);
      expect(dataSort.sortMeta.length).toBe(2);
    });

    it('should sort gender asc, date asc', () => {
      dataSort.setOrder('gender');
      dataSort.setOrder('date');
      const result = dataSort.sortRows(rows);
      expect(result[0]).toEqual({ date: new Date(2017, 8, 5), gender: 'f' });
      expect(result[1]).toEqual({ date: new Date(2019, 3, 7), gender: 'f' });
      expect(result[2]).toEqual({ date: new Date(2016, 11, 1), gender: 'm' });
      expect(result[3]).toEqual({ date: new Date(2018, 4, 3), gender: 'm' });
    });

    it('should sort gender asc, date desc', () => {
      dataSort.setOrder('gender');
      dataSort.setOrder('date'); // asc
      dataSort.setOrder('date'); // desc
      const result = dataSort.sortRows(rows);
      expect(result[0]).toEqual({ date: new Date(2019, 3, 7), gender: 'f' });
      expect(result[1]).toEqual({ date: new Date(2017, 8, 5), gender: 'f' });
      expect(result[2]).toEqual({ date: new Date(2018, 4, 3), gender: 'm' });
      expect(result[3]).toEqual({ date: new Date(2016, 11, 1), gender: 'm' });
    });

    it('should sort gender desc, date asc', () => {
      dataSort.setOrder('gender'); // asc
      dataSort.setOrder('gender'); // desc
      dataSort.setOrder('date');
      const result = dataSort.sortRows(rows);
      expect(result[0]).toEqual({ date: new Date(2016, 11, 1), gender: 'm' });
      expect(result[1]).toEqual({ date: new Date(2018, 4, 3), gender: 'm' });
      expect(result[2]).toEqual({ date: new Date(2017, 8, 5), gender: 'f' });
      expect(result[3]).toEqual({ date: new Date(2019, 3, 7), gender: 'f' });
    });

    it('should sort gender desc, date desc', () => {
      dataSort.setOrder('gender'); // asc
      dataSort.setOrder('gender'); // desc
      dataSort.setOrder('date'); // asc
      dataSort.setOrder('date'); // desc
      const result = dataSort.sortRows(rows);
      expect(result[0]).toEqual({ date: new Date(2018, 4, 3), gender: 'm' });
      expect(result[1]).toEqual({ date: new Date(2016, 11, 1), gender: 'm' });
      expect(result[2]).toEqual({ date: new Date(2019, 3, 7), gender: 'f' });
      expect(result[3]).toEqual({ date: new Date(2017, 8, 5), gender: 'f' });
    });

  });

});

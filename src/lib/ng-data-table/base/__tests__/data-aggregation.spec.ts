import {DataAggregation} from '../data-aggregation';
import {DataSort} from '../data-sort';

describe('DataAggregation', () => {

  const rows = [
    { date: new Date(2017, 8, 5), gender: 'f', id: 10, name: 'Anastasia', cityId: 1 },
    { date: new Date(2016, 11, 1), gender: 'm', id: 20, name: 'Aaron', cityId: 1 },
    { date: new Date(2019, 3, 7), gender: 'f', id: 30, name: 'Gabriela', cityId: 1 },
    { date: new Date(2018, 4, 3), gender: 'm', id: 40, name: 'Daniel', cityId: 2 },
    { date: undefined, gender: undefined, id: undefined, name: undefined, cityId: undefined },
  ];

  describe('groupMetaData', () => {
    const dataAggregation = new DataAggregation();
    const dataSort = new DataSort(true);

    it('should be able to group by single column', () => {
      dataSort.clear();
      dataSort.setOrder('gender'); // asc
      const sortedRows = dataSort.sortRows([...rows]);
      const result = dataAggregation.groupMetaData(sortedRows, ['gender']);
      expect(result['f'].index).toBe(0);
      expect(result['f'].size).toBe(2);

      expect(result['m'].index).toBe(2);
      expect(result['m'].size).toBe(2);

      expect(result[''].index).toBe(4);
      expect(result[''].size).toBe(1);
    });

    it('should be able to group by multiple columns', () => {
      // TODO
    });

  });

});

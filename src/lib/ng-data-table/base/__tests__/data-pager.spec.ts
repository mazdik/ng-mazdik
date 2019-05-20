import { DataPager } from '../data-pager';

describe('DataPager', () => {

  describe('pager', () => {
    const array: number[] = Array.from(Array(30), (d, i) => ++i);
    const dataPager = new DataPager();
    dataPager.total = array.length;

    beforeEach(() => { });

    it('should be able to paginate 1', () => {
      dataPager.current = 1;
      dataPager.perPage = 10;
      const result = dataPager.pager(array);
      expect(result).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    });

    it('should be able to paginate 2', () => {
      dataPager.current = 2;
      dataPager.perPage = 10;
      const result = dataPager.pager(array);
      expect(result).toEqual([11, 12, 13, 14, 15, 16, 17, 18, 19, 20]);
    });

    it('should be able to paginate 3', () => {
      dataPager.current = 3;
      dataPager.perPage = 10;
      const result = dataPager.pager(array);
      expect(result).toEqual([21, 22, 23, 24, 25, 26, 27, 28, 29, 30]);
    });

    it('when page greater than count pages', () => {
      dataPager.current = 4;
      dataPager.perPage = 10;
      const result = dataPager.pager(array);
      expect(result.length).toBe(0);
    });

  });

});

import { arrayPaginate } from '../../common/utils';

export class DataPager {

  perPage = 10;
  total = 0;
  current = 1;
  pageSizeOptions: number[] = [10, 20, 30, 50];

  pager(data: any[]): any[] {
    return arrayPaginate(data, this.current, this.perPage);
  }

}

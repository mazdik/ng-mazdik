import {arrayPaginate} from '../../common/utils';

export class DataPager {

  perPage: number = 10;
  total: number = 0;
  current: number = 1;
  pageSizeOptions: number[] = [10, 20, 30, 50];

  pager(data: any[]): any[] {
    return arrayPaginate(data, this.current, this.perPage);
  }

}

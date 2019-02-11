export class DataPager {

  perPage: number = 10;
  total: number = 0;
  current: number = 1;
  pageSizeOptions: number[] = [10, 20, 30, 50];

  pager(data: any[]): any[] {
    const start = (this.current - 1) * this.perPage;
    const end = this.perPage > -1 ? (start + this.perPage) : data.length;
    return data.slice(start, end);
  }

}

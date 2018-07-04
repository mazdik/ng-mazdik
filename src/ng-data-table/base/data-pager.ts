export class DataPager {

  public perPage: number = 10;
  public total: number = 0;
  public current: number = 1;
  public cache: any = {};

  pager(data: any[]): any[] {
    const start = (this.current - 1) * this.perPage;
    const end = this.perPage > -1 ? (start + this.perPage) : data.length;
    return data.slice(start, end);
  }

  rowCount() {
    const count = this.perPage * this.current;
    return (count < this.total) ? count : this.total;
  }

  setCache() {
    this.cache[this.current] = true;
  }

  isViewed() {
    return this.cache[this.current];
  }

}

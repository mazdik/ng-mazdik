export class DataPager {

  perPage: number = 10;
  total: number = 0;
  current: number = 1;
  cache: any = {};

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

  getRange(): string {
    return `${(this.perPage * (this.current - 1)) + 1} - ${this.rowCount()}`;
  }

}

import {SortMeta} from '../types';

export class DataSort {

  public static SINGLE = 'single';
  public static MULTIPLE = 'multiple';
  public type: string;
  public sortMeta: SortMeta = <SortMeta>{};

  constructor() {
    this.type = DataSort.SINGLE;
  }

  setOrder(columnName: string) {
    this.sortMeta.order = (this.sortMeta.field === columnName) ? this.sortMeta.order * -1 : 1;
    this.sortMeta.field = columnName;
  }

  getOrder(columnName: string) {
    let order = 0;
    if (this.sortMeta.field && this.sortMeta.field === columnName) {
      order = this.sortMeta.order;
    }
    return order;
  }

  sort(data: any[]) {
    const sortField = this.sortMeta.field;
    const sortOrder = this.sortMeta.order;

    return data.sort((previous: any, current: any) => {
      if (previous[sortField] > current[sortField]) {
        return sortOrder === -1 ? -1 : 1;
      } else if (previous[sortField] < current[sortField]) {
        return sortOrder === 1 ? -1 : 1;
      }
      return 0;
    });
  }

  clear() {
    this.sortMeta = <SortMeta>{};
  }

  getDirection(columnName: string) {
    let icon: string;
    if (this.getOrder(columnName) === -1) {
      icon = 'desc';
    } else if (this.getOrder(columnName) === 1) {
      icon = 'asc';
    } else {
      icon = '';
    }
    return icon;
  }

}

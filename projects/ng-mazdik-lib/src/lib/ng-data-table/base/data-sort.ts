import {SortMetadata} from './types';

export class DataSort {

  sortMeta: SortMetadata[] = [];

  constructor(public multiple: boolean = false) {
  }

  setOrder(columnName: string) {
    const index = this.sortMeta.findIndex(x => x.field === columnName);
    if (index === -1) {
      if (!this.multiple) {
        this.sortMeta = [];
      }
      this.sortMeta.push({field: columnName, order: 1});
    } else if (this.sortMeta[index].order === 1) {
      this.sortMeta[index].order = -1;
    } else if (this.sortMeta[index].order === -1) {
      this.sortMeta.splice(index, 1);
    }
  }

  set(columnNames: string[]): void {
    columnNames.forEach(columnName => {
      const index = this.sortMeta.findIndex(x => x.field === columnName);
      if (index === -1) {
        if (!this.multiple) {
          this.sortMeta = [];
        }
        this.sortMeta.push({field: columnName, order: 1});
      }
    });
  }

  getOrder(columnName: string) {
    const meta = this.sortMeta.find(x => x.field === columnName);
    return (meta) ? meta.order : 0;
  }

  sortRows(data: any[]): any[] {
    if (!data) {
      return [];
    }
    if (!this.sortMeta || !this.sortMeta.length) {
      return data;
    }
    return data.sort((previous, current) => {
      return this.multiSort(previous, current, this.sortMeta, 0);
    });
  }

  private multiSort(previous: any, current: any, meta: SortMetadata[], index: number) {
    const value1 = previous[meta[index].field];
    const value2 = current[meta[index].field];
    const result = (value1 < value2) ? -1 : 1;

    if (value1 === value2) {
      return (meta.length - 1) > (index) ? (this.multiSort(previous, current, meta, index + 1)) : 0;
    }

    return (meta[index].order * result);
  }

  clear() {
    this.sortMeta = [];
  }

}

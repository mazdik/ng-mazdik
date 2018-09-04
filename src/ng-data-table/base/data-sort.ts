import {SortMetadata} from './types';
import {Settings} from './settings';

export class DataSort {

  multiple: boolean;
  sortMeta: SortMetadata[] = [];

  constructor(private settings: Settings) {
    this.multiple = this.settings.multipleSort;
  }

  setOrder(columnName: string) {
    const index = this.sortMeta.findIndex((x: SortMetadata) => x.field === columnName);
    if (index === -1) {
      if (!this.multiple) {
        this.sortMeta = [];
      }
      this.sortMeta.push(<SortMetadata>{field: columnName, order: 1});
    } else if (this.sortMeta[index].order === 1) {
      this.sortMeta[index].order = -1;
    } else if (this.sortMeta[index].order === -1) {
      this.sortMeta.splice(index, 1);
    }
  }

  set(columnNames: string[]): void {
    columnNames.forEach(columnName => {
      const index = this.sortMeta.findIndex((x: SortMetadata) => x.field === columnName);
      if (index === -1) {
        if (!this.multiple) {
          this.sortMeta = [];
        }
        this.sortMeta.push(<SortMetadata>{field: columnName, order: 1});
      }
    });
  }

  getOrder(columnName: string) {
    const meta = this.findSortMeta(columnName);
    return (meta) ? meta.order : 0;
  }

  findSortMeta(columnName: string): SortMetadata {
    return this.sortMeta.find((meta: SortMetadata) => meta.field === columnName);
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

  multiSort(previous: any, current: any, meta: SortMetadata[], index: number) {
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

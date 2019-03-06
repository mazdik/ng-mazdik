import {FilterMeta, FilterMetadata, DataType} from './types';
import {isBlank} from '../../common/utils';

export enum FilterOperator {
  EQUALS = 'equals', // ==
  NOT_EQUAL = 'notEqual', // !=
  LESS_THAN = 'lessThan', // <
  LESS_THAN_OR_EQUAL = 'lessThanOrEqual', // <=
  GREATER_THAN = 'greaterThan', // >
  GREATER_THAN_OR_EQUAL = 'greaterThanOrEqual', // >=
  IN_RANGE = 'inRange', // 3-7
  IN = 'in', // in
  CONTAINS = 'contains', // like lower(%val%);
  NOT_CONTAINS = 'notContains', // not like lower(%val%);
  STARTS_WITH = 'startsWith', // like val%;
  ENDS_WITH = 'endsWith', // like %val;
  IS_EMPTY = 'isEmpty', // is null
  IS_NOT_EMPTY = 'isNotEmpty', // is not null
}

export class DataFilter {

  filters: FilterMetadata = <FilterMetadata>{};
  globalFilterValue: string;

  filterRows(data: any[]) {
    const filters = this.filters;
    let filteredRows: any[] = data;

    for (const key in filters) {
      if (filters[key]) {
        filteredRows = filteredRows.filter((row: any) => {
          return (key in row) ? this.compare(row[key], filters[key]) : false;
        });
      }
    }
    filteredRows = this.globalFilterRows(filteredRows);
    return filteredRows;
  }

  globalFilterRows(data: any[]) {
    if (this.globalFilterValue) {
      return data.filter(item => Object.keys(item).map((key) => {
        return this.startsWith(item[key], this.globalFilterValue);
      }).includes(true));
    } else {
      return data;
    }
  }

  compare(value: any, filter: FilterMeta) {
    if (filter.type === DataType.Date) {
      let filterValue;
      let filterValueTo;
      if (!isBlank(value)) {
        value = new Date(value).setSeconds(0, 0);
      }
      if (!isBlank(filter.value)) {
        filterValue = new Date(filter.value).setSeconds(0, 0);
      }
      if (!isBlank(filter.valueTo)) {
        filterValueTo = new Date(filter.valueTo).setSeconds(0, 0);
      }
      switch (filter.matchMode) {
        case FilterOperator.EQUALS:
          return this.dateEquals(value, filterValue);
        case FilterOperator.NOT_EQUAL:
          return !this.equals(value, filterValue);
        case FilterOperator.IN_RANGE:
          return this.inRange(value, filterValue, filterValueTo);
        case FilterOperator.LESS_THAN:
          return this.lessThan(value, filterValue);
        case FilterOperator.LESS_THAN_OR_EQUAL:
          return this.lessThanOrEqual(value, filterValue);
        case FilterOperator.GREATER_THAN:
          return this.greaterThan(value, filterValue);
        case FilterOperator.GREATER_THAN_OR_EQUAL:
          return this.greaterThanOrEqual(value, filterValue);
        case FilterOperator.IS_EMPTY:
          return isBlank(value);
        case FilterOperator.IS_NOT_EMPTY:
          return !isBlank(value);
        default:
          return this.dateEquals(value, filterValue);
      }
    } else {
      switch (filter.matchMode) {
        case FilterOperator.EQUALS:
          return this.equals(value, filter.value);
        case FilterOperator.NOT_EQUAL:
          return !this.equals(value, filter.value);
        case FilterOperator.IN_RANGE:
          return this.inRange(value, filter.value, filter.valueTo);
        case FilterOperator.IN:
          return this.in(value, filter.value);
        case FilterOperator.CONTAINS:
          return this.contains(value, filter.value);
        case FilterOperator.NOT_CONTAINS:
          return !this.contains(value, filter.value);
        case FilterOperator.STARTS_WITH:
          return this.startsWith(value, filter.value);
        case FilterOperator.ENDS_WITH:
          return this.endsWith(value, filter.value);
        case FilterOperator.LESS_THAN:
          return this.lessThan(value, filter.value);
        case FilterOperator.LESS_THAN_OR_EQUAL:
          return this.lessThanOrEqual(value, filter.value);
        case FilterOperator.GREATER_THAN:
          return this.greaterThan(value, filter.value);
        case FilterOperator.GREATER_THAN_OR_EQUAL:
          return this.greaterThanOrEqual(value, filter.value);
        case FilterOperator.IS_EMPTY:
          return isBlank(value);
        case FilterOperator.IS_NOT_EMPTY:
          return !isBlank(value);
        default:
          return this.equals(value, filter.value);
      }
    }
  }

  equals(value, filter): boolean {
    if (isBlank(filter)) {
      return true;
    }
    if (isBlank(value)) {
      return false;
    }
    return value.toString().toLowerCase() === filter.toString().toLowerCase();
  }

  in(value, filter: any[]): boolean {
    if (isBlank(filter)) {
      return true;
    }
    if (isBlank(value)) {
      return false;
    }
    for (let i = 0; i < filter.length; i++) {
      if (filter[i] === value) {
        return true;
      }
    }
    return false;
  }

  startsWith(value, filter): boolean {
    if (isBlank(filter)) {
      return true;
    }
    if (isBlank(value)) {
      return false;
    }
    const filterValue = filter.toLowerCase();
    return value.toString().toLowerCase().slice(0, filterValue.length) === filterValue;
  }

  endsWith(value, filter): boolean {
    if (isBlank(filter)) {
      return true;
    }
    if (isBlank(value)) {
      return false;
    }
    const filterValue = filter.toString().toLowerCase();
    return value.toString().toLowerCase().indexOf(filterValue, value.toString().length - filterValue.length) !== -1;
  }

  contains(value, filter): boolean {
    if (isBlank(filter)) {
      return true;
    }
    if (isBlank(value)) {
      return false;
    }
    return value.toString().toLowerCase().indexOf(filter.toLowerCase()) !== -1;
  }

  lessThan(value, filter): boolean {
    if (isBlank(filter)) {
      return true;
    }
    if (isBlank(value)) {
      return false;
    }
    return value < filter;
  }

  lessThanOrEqual(value, filter): boolean {
    if (isBlank(filter)) {
      return true;
    }
    if (isBlank(value)) {
      return false;
    }
    return value <= filter;
  }

  greaterThan(value, filter): boolean {
    if (isBlank(filter)) {
      return true;
    }
    if (isBlank(value)) {
      return false;
    }
    return value > filter;
  }

  greaterThanOrEqual(value, filter): boolean {
    if (isBlank(filter)) {
      return true;
    }
    if (isBlank(value)) {
      return false;
    }
    return value >= filter;
  }

  inRange(value, from, to): boolean {
    if (isBlank(from)) {
      return this.lessThan(value, to);
    }
    if (isBlank(to)) {
      return this.greaterThan(value, from);
    }
    if (isBlank(value)) {
      return false;
    }
    return value > from && value < to;
  }

  dateEquals(value, filter): boolean {
    if (isBlank(filter)) {
      return true;
    }
    if (isBlank(value)) {
      return false;
    }
    const dt1 = new Date(value).setSeconds(0, 0);
    const dt2 = new Date(filter).setSeconds(0, 0);
    return dt1 === dt2;
  }

  clear() {
    this.filters = <FilterMetadata>{};
    this.globalFilterValue = null;
  }

  hasFilter(columnName: string): boolean {
    return !isBlank(this.filters[columnName]);
  }

  hasFilters(): boolean {
    return !(Object.keys(this.filters).length === 0 && this.filters.constructor === Object) || !isBlank(this.globalFilterValue);
  }

  setFilter(value: any, field: string, matchMode: string, valueTo?: any, dataType?: DataType) {
    if (!isBlank(value) || !isBlank(valueTo)) {
      [value, valueTo] = this.toNumber(value, valueTo, dataType);
      this.filters[field] = {value: value, matchMode: matchMode, valueTo: valueTo, type: dataType};
    } else if (this.filters[field]) {
      delete this.filters[field];
    }
  }

  isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
  }

  toNumber(value: any, valueTo?: any, dataType?: DataType) {
    if (!isBlank(value) && dataType === DataType.Number && this.isNumeric(value)) {
      value = parseFloat(value);
    }
    if (!isBlank(valueTo) && dataType === DataType.Number && this.isNumeric(valueTo)) {
      valueTo = parseFloat(valueTo);
    }
    return [value, valueTo];
  }

  getFilterValue(columnName: string) {
    return this.filters[columnName] ? this.filters[columnName].value : null;
  }

  getFilterValueTo(columnName: string) {
    return this.filters[columnName] ? this.filters[columnName].valueTo : null;
  }

  getFilterMatchMode(columnName: string) {
    return this.filters[columnName] ? this.filters[columnName].matchMode : null;
  }

  isNonValueFilter(matchMode: string) {
    return (matchMode === FilterOperator.IS_EMPTY || matchMode === FilterOperator.IS_NOT_EMPTY);
  }

}

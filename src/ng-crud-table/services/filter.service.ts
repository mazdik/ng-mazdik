import {Injectable} from '@angular/core';
import {Filter} from '../types';

@Injectable()
export class FilterService {

  public static EQUALS = 'equals'; // =
  public static NOT_EQUAL = 'notEqual'; // !=
  public static LESS_THAN = 'lessThan'; // <
  public static LESS_THAN_OR_EQUAL = 'lessThanOrEqual'; // <=
  public static GREATER_THAN = 'greaterThan'; // >
  public static GREATER_THAN_OR_EQUAL = 'greaterThanOrEqual'; // >=
  public static IN_RANGE = 'inRange'; // in

  public static CONTAINS = 'contains'; // like lower(%val%);
  public static NOT_CONTAINS = 'notContains'; // not like lower(%val%);
  public static STARTS_WITH = 'startsWith'; // like val%;
  public static ENDS_WITH = 'endsWith'; // like %val;

  filter(data: any[], filters: Filter) {
    let filteredRows: any[] = data;
    for (const key in filters) {
      if (filters[key].value) {
        filteredRows = filteredRows.filter((row: any) => {
          if (key in row) {
            return this.comparator(filters[key].matchMode, row[key], filters[key].value);
          } else {
            return false;
          }
        });
      }
    }
    return filteredRows;
  }

  comparator(matchMode: string, value: any, filter: any) {
    switch (matchMode) {
      case FilterService.EQUALS:
        return this.equals(value, filter);
      case FilterService.NOT_EQUAL:
        return this.notEquals(value, filter);
      case FilterService.IN_RANGE:
        return this.in(value, filter);
      case FilterService.CONTAINS:
        return this.contains(value, filter);
      case FilterService.NOT_CONTAINS:
        return !this.contains(value, filter);
      case FilterService.STARTS_WITH:
        return this.startsWith(value, filter);
      case FilterService.ENDS_WITH:
        return this.endsWith(value, filter);
      default:
        return this.equals(value, filter);
    }
  }

  equals(value, filter): boolean {
    if (filter === undefined || filter === null || (typeof filter === 'string' && filter.trim() === '')) {
      return true;
    }
    if (value === undefined || value === null) {
      return false;
    }
    return value.toString().toLowerCase() === filter.toString().toLowerCase();
  }

  notEquals(value, filter): boolean {
    if (filter === undefined || filter === null || (typeof filter === 'string' && filter.trim() === '')) {
      return false;
    }
    if (value === undefined || value === null) {
      return true;
    }
    return value.toString().toLowerCase() !== filter.toString().toLowerCase();
  }

  in(value, filter: any[]): boolean {
    if (filter === undefined || filter === null || filter.length === 0) {
      return true;
    }
    if (value === undefined || value === null) {
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
    if (filter === undefined || filter === null || filter.trim() === '') {
      return true;
    }
    if (value === undefined || value === null) {
      return false;
    }
    const filterValue = filter.toLowerCase();
    return value.toString().toLowerCase().slice(0, filterValue.length) === filterValue;
  }

  endsWith(value, filter): boolean {
    if (filter === undefined || filter === null || filter.trim() === '') {
      return true;
    }
    if (value === undefined || value === null) {
      return false;
    }
    const filterValue = filter.toString().toLowerCase();
    return value.toString().toLowerCase().indexOf(filterValue, value.toString().length - filterValue.length) !== -1;
  }

  contains(value, filter): boolean {
    if (filter === undefined || filter === null || (typeof filter === 'string' && filter.trim() === '')) {
      return true;
    }
    if (value === undefined || value === null) {
      return false;
    }
    return value.toString().toLowerCase().indexOf(filter.toLowerCase()) !== -1;
  }

}

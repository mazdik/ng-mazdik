import {Injectable} from '@angular/core';
import {Filter} from '../types';
import {isBlank} from '../utils/util';

@Injectable()
export class FilterService {

  public static EQUALS = 'equals'; // ==
  public static NOT_EQUAL = 'notEqual'; // !=
  public static LESS_THAN = 'lessThan'; // <
  public static LESS_THAN_OR_EQUAL = 'lessThanOrEqual'; // <=
  public static GREATER_THAN = 'greaterThan'; // >
  public static GREATER_THAN_OR_EQUAL = 'greaterThanOrEqual'; // >=
  public static IN_RANGE = 'inRange'; // 3-7
  public static IN = 'in'; // in

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
            return this.compare(filters[key].matchMode, row[key], filters[key].value, filters[key].valueTo);
          } else {
            return false;
          }
        });
      }
    }
    return filteredRows;
  }

  compare(matchMode: string, value: any, filter: any, filterTo: any) {
    switch (matchMode) {
      case FilterService.EQUALS:
        return this.equals(value, filter);
      case FilterService.NOT_EQUAL:
        return this.notEquals(value, filter);
      case FilterService.IN_RANGE:
        return this.inRange(value, filter, filterTo);
      case FilterService.IN:
        return this.in(value, filter);
      case FilterService.CONTAINS:
        return this.contains(value, filter);
      case FilterService.NOT_CONTAINS:
        return !this.contains(value, filter);
      case FilterService.STARTS_WITH:
        return this.startsWith(value, filter);
      case FilterService.ENDS_WITH:
        return this.endsWith(value, filter);
      case FilterService.LESS_THAN:
        return this.lessThan(value, filter);
      case FilterService.LESS_THAN_OR_EQUAL:
        return this.lessThanOrEqual(value, filter);
      case FilterService.GREATER_THAN:
        return this.greaterThan(value, filter);
      case FilterService.GREATER_THAN_OR_EQUAL:
        return this.greaterThanOrEqual(value, filter);
      default:
        return this.equals(value, filter);
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

  notEquals(value, filter): boolean {
    if (isBlank(filter)) {
      return false;
    }
    if (isBlank(value)) {
      return true;
    }
    return value.toString().toLowerCase() !== filter.toString().toLowerCase();
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
      return true;
    }
    if (isBlank(to)) {
      return true;
    }
    if (isBlank(value)) {
      return false;
    }
    return value > from && value < to;
  }

}

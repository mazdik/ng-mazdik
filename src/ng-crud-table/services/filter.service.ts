import {Injectable} from '@angular/core';
import {Filter, FilterMetadata} from '../types';
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
      if (filters[key]) {
        filteredRows = filteredRows.filter((row: any) => {
          if (key in row) {
            return this.compare(row[key], filters[key]);
          } else {
            return false;
          }
        });
      }
    }
    return filteredRows;
  }

  compare(value: any, filter: FilterMetadata) {
    if (filter.type === 'date') {
      let filterValue;
      let filterValueTo;
      if (!isBlank(value)) {
        value = new Date(value);
      }
      if (!isBlank(filter.value)) {
        filterValue = new Date(filter.value);
      }
      if (!isBlank(filter.valueTo)) {
        filterValueTo = new Date(filter.valueTo);
      }
      switch (filter.matchMode) {
        case FilterService.EQUALS:
          return this.dateEquals(value, filterValue);
        case FilterService.NOT_EQUAL:
          return !this.equals(value, filterValue);
        case FilterService.IN_RANGE:
          return this.inRange(value, filterValue, filterValueTo);
        case FilterService.LESS_THAN:
          return this.lessThan(value, filterValue);
        case FilterService.LESS_THAN_OR_EQUAL:
          return this.lessThanOrEqual(value, filterValue);
        case FilterService.GREATER_THAN:
          return this.greaterThan(value, filterValue);
        case FilterService.GREATER_THAN_OR_EQUAL:
          return this.greaterThanOrEqual(value, filterValue);
        default:
          return this.dateEquals(value, filterValue);
      }
    } else {
      switch (filter.matchMode) {
        case FilterService.EQUALS:
          return this.equals(value, filter.value);
        case FilterService.NOT_EQUAL:
          return !this.equals(value, filter.value);
        case FilterService.IN_RANGE:
          return this.inRange(value, filter.value, filter.valueTo);
        case FilterService.IN:
          return this.in(value, filter.value);
        case FilterService.CONTAINS:
          return this.contains(value, filter.value);
        case FilterService.NOT_CONTAINS:
          return !this.contains(value, filter.value);
        case FilterService.STARTS_WITH:
          return this.startsWith(value, filter.value);
        case FilterService.ENDS_WITH:
          return this.endsWith(value, filter.value);
        case FilterService.LESS_THAN:
          return this.lessThan(value, filter.value);
        case FilterService.LESS_THAN_OR_EQUAL:
          return this.lessThanOrEqual(value, filter.value);
        case FilterService.GREATER_THAN:
          return this.greaterThan(value, filter.value);
        case FilterService.GREATER_THAN_OR_EQUAL:
          return this.greaterThanOrEqual(value, filter.value);
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

}

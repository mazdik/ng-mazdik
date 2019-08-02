export interface DtMessages {
  empty: string;
  loading: string;
  clearFilters: string;
  create: string;
  delete: string;
  save: string;
  close: string;
  titleCreate: string;
  titleUpdate: string;
  titleDetailView: string;
  search: string;
  selectAll: string;
  clear: string;
  equals: string;
  notEqual: string;
  lessThan: string;
  lessThanOrEqual: string;
  greaterThan: string;
  greaterThanOrEqual: string;
  inRange: string;
  contains: string;
  notContains: string;
  startsWith: string;
  endsWith: string;
  lastYear: string;
  lastMonth: string;
  lastDay: string;
  lastHour: string;
  go: string;
  column: string;
  value: string;
  export: string;
  refresh: string;
  revertChanges: string;
  duplicate: string;
  cancel: string;
  isEmpty: string;
  isNotEmpty: string;
  selectPlaceholder: string;
  ok: string;
  columns: string;
  actions: string;
}

export class DtMessagesEn implements DtMessages {
  empty = 'No data to display';
  loading = 'Loading...';
  clearFilters = 'Clear all filters';
  create = 'Create';
  delete = 'Delete';
  save = 'Save';
  close = 'Close';
  titleCreate = 'Create';
  titleUpdate = 'Update';
  titleDetailView = 'Detail view';
  search = 'Search...';
  selectAll = 'Select all';
  clear = 'Clear';
  equals = 'Equals';
  notEqual = 'Does not equal';
  lessThan = 'Is less than';
  lessThanOrEqual = 'Is less than or equal to';
  greaterThan = 'Is greater than';
  greaterThanOrEqual = 'Is greater than or equal to';
  inRange = 'In range';
  contains = 'Contains';
  notContains = 'Does not contain';
  startsWith = 'Begins with';
  endsWith = 'Ends with';
  lastYear = 'Last Year';
  lastMonth = 'Last Month';
  lastDay = 'Last Day';
  lastHour = 'Last Hour';
  go = 'Go';
  column = 'Column';
  value = 'Value';
  export = 'Export';
  refresh = 'Refresh';
  revertChanges = 'Revert Changes';
  duplicate = 'Duplicate';
  cancel = 'Cancel';
  isEmpty = 'Is empty';
  isNotEmpty = 'Is not empty';
  selectPlaceholder = 'Select...';
  ok = 'OK';
  columns = 'Columns';
  actions = 'Actions';

  constructor(init?: Partial<DtMessagesEn>) {
    if (init) {
      Object.assign(this, init);
    }
  }
}

export class Message {

  public empty?: string;
  public loading?: string;
  public clearFilters?: string;
  public create?: string;
  public delete?: string;
  public save?: string;
  public close?: string;
  public titleCreate?: string;
  public titleUpdate?: string;
  public titleDetailView?: string;
  public search?: string;
  public selectAll?: string;
  public clear?: string;
  public equals?: string;
  public notEqual?: string;
  public lessThan?: string;
  public lessThanOrEqual?: string;
  public greaterThan?: string;
  public greaterThanOrEqual?: string;
  public inRange?: string;
  public contains?: string;
  public notContains?: string;
  public startsWith?: string;
  public endsWith?: string;
  public lastYear?: string;
  public lastMonth?: string;
  public lastDay?: string;
  public lastHour?: string;

  constructor() {
    this.empty = 'No data to display';
    this.loading = 'Loading...';
    this.clearFilters = 'Clear all filters';
    this.create = 'Create';
    this.delete = 'Delete';
    this.save = 'Save';
    this.close = 'Close';
    this.titleCreate = 'Create';
    this.titleUpdate = 'Update';
    this.titleDetailView = 'Detail view';
    this.search = 'Search...';
    this.selectAll = 'Select all';
    this.clear = 'Clear';
    this.equals = 'Equals';
    this.notEqual = 'Does not equal';
    this.lessThan = 'Is less than';
    this.lessThanOrEqual = 'Is less than or equal to';
    this.greaterThan = 'Is greater than';
    this.greaterThanOrEqual = 'Is greater than or equal to';
    this.inRange = 'In range';
    this.contains = 'Contains';
    this.notContains = 'Does not contain';
    this.startsWith = 'Begins with';
    this.endsWith = 'Ends with';
    this.lastYear = 'Last Year';
    this.lastMonth = 'Last Month';
    this.lastDay = 'Last Day';
    this.lastHour = 'Last Hour';
  }

}

export interface Link {
  self:string;
  next:string;
  last:string;
}

export interface Meta {
  totalCount:number;
  pageCount:number;
  currentPage:number;
  perPage:number;
}

export interface Data {
  items:any[];
  _links:Link;
  _meta:Meta;
}


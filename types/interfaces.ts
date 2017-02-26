export interface Link {
    self: string;
    next: string;
    last: string;
}

export interface Meta {
    totalCount: number;
    pageCount: number;
    currentPage: number;
    perPage: number;
}

export interface Data {
    items: any[];
    links: Link;
    meta: Meta;
}

export interface ISelectOption {
    id: any;
    name: string;
}

export interface Column {
    title: string;
    name: string;
    sortable: boolean;
    filter: boolean;
    options?: ISelectOption[];
}

export interface Filter {
    [s: string]: any;
}

export interface Settings {
	api: string;
	crud: boolean;
	pageHeader?: string;
	primaryKey?: string;
}

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
    format?: string;
    width?: number;
    frozen?: boolean;
}

export interface Filter {
    [s: string]: any;
}

export interface Settings {
	api: string;
	crud: boolean;
	pageHeader?: string;
	primaryKey?: string;
    type?: string;
}

export interface ICrudService {
    url: string;
    primaryKey: string;
    getItems(page: number, filters?: Filter, sortField?: string, sortOrder?: number): Promise<any>;
    getItem(id: number): Promise<any>;
    save(item: any): Promise<any>;
    post(item: any): Promise<any>;
    put(item: any);
    delete(item: any);
}

import { Injectable } from '@angular/core';
import { Http, Response, URLSearchParams, Headers } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import { Filter, ICrudService } from '../types/interfaces';

@Injectable()
export class DemoService implements ICrudService {

    public url: string;
    public primaryKey: string = 'id';

    private itemsPerPage: number = 20;
    private data: any = {
        "items": [
            { "id": 1, "name": "Defunct", "race": "ASMODIANS", "gender": "MALE", "exp": 7734770, "last_online": 1367077316 },
            { "id": 2, "name": "Extaze", "race": "ASMODIANS", "gender": "MALE", "exp": 5231886, "last_online": 1367077376 },
            { "id": 3, "name": "Soer", "race": "ASMODIANS", "gender": "MALE", "exp": 1012433064, "last_online": 1367093343 },
            { "id": 4, "name": "Mmmm", "race": "ASMODIANS", "gender": "MALE", "exp": 1500, "last_online": 1367093368 },
            { "id": 5, "name": "Spartacus", "race": "ELYOS ", "gender": "MALE", "exp": 127866172, "last_online": 1367093504 },
            { "id": 6, "name": "Dendy", "race": "ASMODIANS", "gender": "FEMALE", "exp": 19740, "last_online": 1367093627 },
            { "id": 7, "name": "Sega", "race": "ELYOS", "gender": "FEMALE", "exp": 3750, "last_online": 1367093842 },
            { "id": 8, "name": "Chesterxd", "race": "ELYOS", "gender": "MALE", "exp": 5250, "last_online": 1367094014 },
            { "id": 9, "name": "Kpoxa", "race": "ELYOS", "gender": "FEMALE", "exp": 343, "last_online": 1367223323 },
            { "id": 10, "name": "Chester", "race": "ASMODIANS", "gender": "MALE", "exp": 1902523321, "last_online": 1368002013 },
            { "id": 11, "name": "Oumen", "race": "ASMODIANS", "gender": "MALE", "exp": 454, "last_online": 1368679384 },
            { "id": 12, "name": "Ganicus", "race": "ASMODIANS", "gender": "MALE", "exp": 454, "last_online": 1370243574 },
            { "id": 13, "name": "Wolvorin", "race": "ASMODIANS", "gender": "MALE", "exp": 454, "last_online": 1370243622 },
            { "id": 14, "name": "Inkognito", "race": "ASMODIANS", "gender": "MALE", "exp": 454, "last_online": 1370243643 },
            { "id": 15, "name": "Ultras", "race": "ASMODIANS", "gender": "MALE", "exp": 454, "last_online": 1370243673 },
            { "id": 16, "name": "Pandorum", "race": "ASMODIANS", "gender": "MALE", "exp": 454, "last_online": 1370243681 },
            { "id": 17, "name": "Ylolld", "race": "ASMODIANS", "gender": "MALE", "exp": 454, "last_online": 1370243777 },
            { "id": 18, "name": "Tratata", "race": "ASMODIANS", "gender": "MALE", "exp": 454, "last_online": 1370244306 }
        ],
        "_meta": { "totalCount": 18, "pageCount": 1, "currentPage": 1, "perPage": this.itemsPerPage }
    };

    getItems(page: number = 1, filters ? : Filter, sortField ? : string, sortOrder ? : number): Promise < any > {
        let filteredData = this.filter(this.data.items, filters);
        let sortedData = this.sort(filteredData, sortField, sortOrder);
        let pageData = this.page(sortedData, page);
        let totalCount = sortedData.length;
        let pageCount = pageData.length; 
        let result = {
            "items": pageData,
            "_meta": { "totalCount": totalCount, "pageCount": pageCount, "currentPage": page, "perPage": this.itemsPerPage }
        };
        return new Promise((resolve, ) => {
            // Simulate server latency with 2 second delay
            setTimeout(() => resolve(result), 1000);
        });
    }

    getItem(id: number): Promise<any> {
        let filterId = {
            [this.primaryKey]: { value: id }
        };
        return this.getItems(1, filterId)
            .then(data => data.items[0]);
    }

    filter(data: any, filters: Filter) {
        let filteredData: Array < any > = data;
        for (let key in filters) {
            if (filters[key]['value']) {
                filteredData = filteredData.filter((item: any) => {
                    return item[key].toString().match(filters[key]['value']);
                });
            }
        }
        return filteredData;
    }

    sort(data: any, sortField ? : string, sortOrder ? : number) {
        return data.sort((previous: any, current: any) => {
            if (previous[sortField] > current[sortField]) {
                return sortOrder === -1 ? -1 : 1;
            } else if (previous[sortField] < current[sortField]) {
                return sortOrder === 1 ? -1 : 1;
            }
            return 0;
        });
    }

    page(data: any, page: any): Array < any > {
        let start = (page - 1) * this.itemsPerPage;
        let end = this.itemsPerPage > -1 ? (start + this.itemsPerPage) : data.length;
        return data.slice(start, end);
    }

    save(item: any): Promise < any > {
        if (item[this.primaryKey]) {
            return this.put(item);
        }
        return this.post(item);
    }

    // Add new
    post(item: any): Promise < any > {
        //this.data.items.push(item); // exist in component
        return new Promise((resolve, ) => {
            // Simulate server latency with 2 second delay
            setTimeout(() => resolve(item), 1000);
        });
    }

    // Update existing
    put(item: any) {
        //this.data.items[this.findSelectedItemIndex(item)] = item; // exist in component
        return new Promise((resolve, ) => {
            // Simulate server latency with 2 second delay
            setTimeout(() => resolve(item), 1000);
        });
    }

    delete(item: any) {
        //this.data.items.splice(this.findSelectedItemIndex(item), 1); // exist in component
        return new Promise((resolve, ) => {
            // Simulate server latency with 2 second delay
            setTimeout(() => resolve(item), 1000);
        });
    }

    findSelectedItemIndex(item: any): number {
        let obj = this.data.items.find(x => JSON.stringify(x) === JSON.stringify(item));
        let index = this.data.items.indexOf(obj);
        return index;
    }

}

# Angular 5 CRUD table using REST backend

Simple CRUD table component for Angular using REST backend. (<a target="_blank" href="https://mazdik.github.io/ng2-crud-table/">Demo</a>)  
The module contains services for: Yii2 RESTful API, ORDS (Oracle REST Data Services), Flask-Restless

### Sample
```typescript
import {Component}  from '@angular/core';
import {Column, Settings, ICrudService, YiiService} from '../ng-crud-table';
import {HttpClient} from '@angular/common/http';


@Component({
  selector: 'my-app',
  template: `<crud-table [columns]="columns" [settings]="settings" [service]="service"></crud-table>`
})

export class PlayersComponent {
  
    public service: ICrudService;
  
    constructor(private http: HttpClient) {
      // YiiService | RestlessService | OrdsService | your custom service
      this.service = new YiiService(this.http);
    }

    public columns: Column[] = [
        {
            title: 'Id', 
            name: 'id', 
            sortable: true, 
            filter: true, 
            frozen: true,
            resizeable: false,
        },
        {
            title: 'Name', 
            name: 'name', 
            sortable: true, 
            filter: true, 
            frozen: true, 
            width: 250,
            validation: { pattern: '^[a-zA-Z ]+$' },
            editable: true,
            resizeable: false,
        },
        {
            title: 'Race',
            name: 'race',
            sortable: true,
            filter: true,
            type: 'select',
            options: [
                { id: 'ASMODIANS', name: 'ASMODIANS' },
                { id: 'ELYOS', name: 'ELYOS' },
            ],
            editable: true,
        },
        {
            title: 'Cascading Select',
            name: 'note',
            editable: true,
            type: 'select',
            options: [
                { id: 'ASM1', name: 'ASM note 1', parentId: 'ASMODIANS' },
                { id: 'ASM2', name: 'ASM note 2', parentId: 'ASMODIANS' },
                { id: 'ASM3', name: 'ASM note 3', parentId: 'ASMODIANS' },
                { id: 'ASM4', name: 'ASM note 4', parentId: 'ASMODIANS' },
                { id: 'ELY1', name: 'ELY note 1', parentId: 'ELYOS' },
                { id: 'ELY2', name: 'ELY note 2', parentId: 'ELYOS' },
                { id: 'ELY3', name: 'ELY note 3', parentId: 'ELYOS' },
            ],
            dependsColumn: 'race',
        },
        {
            title: 'Gender',
            name: 'gender',
            sortable: true,
            filter: true,
            type: 'radio',
            options: [
                { id: 'MALE', name: 'MALE' },
                { id: 'FEMALE', name: 'FEMALE' },
            ],
            editable: true,
        },
        {
            title: 'Exp',
            name: 'exp',
            sortable: true,
            filter: true,
            type: 'number',
            validation: { required: true, minLength: 2, maxLength: 10 },
            editable: true,
        },
        {
            title: 'Last online', 
            name: 'last_online', 
            sortable: true, 
            filter: true,
            type: 'date',
            editable: true,
        }
    ];

    public settings: Settings = {
        api: 'http://host3/players',
        crud: true,
        primaryKey: 'id',
        tableWidth: 820,
        scrollHeight: 380,
    };
}
```

## Features
* Filtering
* Sorting
* Pagination
* Modal (Draggable and Resizable)
* Create/Update/Delete
* Single row view
* Loading indicator
* MultiSelect
* Scrolling with fixed header horizontally and vertically
* Frozen columns
* Dynamic forms with validation
* Editable
* Tree view (Lazy Loading, client/server side filtering, context menu)
* Column Resizing
* Cascading Select (DropDown)
* Tree table
* No external dependencies

### Custom service
```typescript
interface ICrudService {
  url: string;
  primaryKey: any;
  getItems(page: number, filters?: Filter, sortField?: string, sortOrder?: number): Promise<any>;
  getItem(id: number): Promise<any>;
  post(item: any): Promise<any>;
  put(item: any): Promise<any>;
  delete(item: any): Promise<any>;
  getOptions?(url: string, parentId: any): Promise<any>;
}
```

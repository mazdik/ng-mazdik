# Angular 6 CRUD table using REST backend

Simple CRUD table component for Angular using REST backend. (<a target="_blank" href="https://mazdik.github.io/ng-crud-table/">Demo</a>)  
The module contains services for: Yii2 RESTful (php), ORDS (Oracle REST Data Services), Flask-Restless (python)

### Sample
```typescript
import {Component}  from '@angular/core';
import {Column, Settings, DataSource, YiiService} from '../ng-crud-table';
import {HttpClient} from '@angular/common/http';


@Component({
  selector: 'my-app',
  template: `<app-crud-table [columns]="columns" [settings]="settings" [service]="service"></app-crud-table>`
})

export class PlayersComponent {
  
    public service: DataSource;
  
    constructor(private http: HttpClient) {
      // YiiService | RestlessService | OrdsService | your custom service
      this.service = new YiiService(this.http);
    }

    public columns: Column[] = [
        {
            title: 'Id', 
            name: 'id', 
            sortable: false, 
            filter: false, 
            frozen: true,
            resizeable: false,
            formHidden: true,
        },
        {
            title: 'Name', 
            name: 'name', 
            frozen: true, 
            width: 250,
            validation: { required: true, pattern: '^[a-zA-Z ]+$' },
            editable: true,
        },
        {
            title: 'Race',
            name: 'race',
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
            selectionLimit: 5,
        },
        {
            title: 'Gender',
            name: 'gender',
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
            type: 'number',
            validation: { required: true, minLength: 2, maxLength: 10 },
            editable: true,
        },
        {
            title: 'Last online', 
            name: 'last_online', 
            type: 'date',
            editable: true,
        },
        {
          title: 'Account name',
          name: 'account_name',
          editable: true,
          type: 'select-popup',
          optionsUrl: 'assets/accounts.json',
          keyColumn: 'account_id',
        },
        {
          title: 'Account id',
          name: 'account_id',
          formHidden: true,
          tableHidden: true,
        }
    ];

    public settings: Settings = {
        api: 'http://host3/players',
        crud: true,
        primaryKeys: ['id'],
        tableWidth: 820,
        bodyHeight: 380,
        multipleSort: true
    };
}
```

## Features
* Filtering (column filters and an optional global filter)
* Sorting (multiple columns)
* Pagination
* Modal (draggable and resizable)
* Create/Update/Delete (composite primary keys)
* Single row view
* Loading indicator
* Row selection (single, multiple, checkbox, radio)
* Scrolling with fixed header horizontally and vertically
* Frozen columns
* Dynamic forms with validation
* Editable
* Localization
* Column resizing
* Cascading select (client/server side dynamic drop-down lists)
* Tree table
* No external dependencies
* Row Grouping (multiple columns)
* Summary Row (aggregation on a column)
* Live Updates
* Virtual scroll

### Custom service
```typescript
interface DataSource {
  url: string;
  primaryKeys: string[];
  getItems(page: number, filters: Filter, sortMeta: SortMeta[], globalFilterValue?: string): Promise<any>;
  getItem(row: any): Promise<any>;
  post(row: any): Promise<any>;
  put(row: any): Promise<any>;
  delete(row: any): Promise<any>;
  getOptions?(url: string, parentId: any): Promise<any>;
}
```

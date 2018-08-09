# Angular 6 CRUD data table using REST backend

Feature-rich CRUD data table component for Angular using REST backend. (<a target="_blank" href="https://mazdik.github.io/ng-crud-table/">Demo</a>)  
The module contains services for: Yii2 RESTful (php), ORDS (Oracle REST Data Services), Flask-Restless (python)

### Sample crud-table
```typescript
import {Component}  from '@angular/core';
import {Column, Settings, DataSource, YiiService, DataManager} from '../ng-crud-table';
import {HttpClient} from '@angular/common/http';


@Component({
  selector: 'my-app',
  template: `<app-crud-table [dataManager]="dataManager"></app-crud-table>`
})

export class PlayersComponent {
  
    service: DataSource;
    dataManager: DataManager;
  
    constructor(private http: HttpClient) {
      // YiiService | RestlessService | OrdsService | your custom service
      this.service = new YiiService(this.http);
      this.dataManager = new DataManager(this.columns, this.settings, this.service);
    }

    columns: Column[] = [
        {
            title: 'Id', 
            name: 'id', 
            sortable: false, 
            filter: false, 
            frozen: true,
            resizeable: false,
            formHidden: true,
            isPrimaryKey: true,
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

    settings: Settings = {
        api: 'http://host3/players',
        crud: true,
        tableWidth: 820,
        bodyHeight: 380,
        multipleSort: true
    };
}
```
### Sample data-table
```typescript
import {Column, Settings, DataTable} from '../ng-crud-table';

@Component({
  selector: 'app-data-table-demo',
  template: `<app-datatable [table]="table"></app-datatable>`
})

export class DataTableDemoComponent {

  table: DataTable;
  columns: Column[];
  settings: Settings;

  constructor() {
    this.table = new DataTable(this.columns, this.settings);
    this.table.rows = data[];
  }
}
```
### Sample tree-table
```typescript
import {TreeDataSource, Column, Settings, TreeTable} from '../ng-tree-table';

@Component({
  selector: 'app-tree-table-demo',
  template: `<app-tree-table [treeTable]="treeTable"></app-tree-table>`
})

export class TreeTableDemoComponent {

  treeService: TreeDataSource;
  treeTable: TreeTable;
  settings: Settings;
  columns: Column[];

  constructor() {
    this.treeService = new TreeDemoService(this.http);
    this.treeTable = new TreeTable(this.columns, this.settings, this.treeService);
  }
}
```


## Features
* Filtering (column filters and an optional global filter)
* Sorting (multiple columns)
* Pagination
* Modal (draggable and resizable)
* Create/Update/Delete (composite primary keys)
* Single row view (with sortable colums and values)
* Loading indicator
* Row selection (single, multiple, checkbox, radio)
* Scrolling with fixed header horizontally and vertically
* Frozen columns
* Dynamic forms with validation
* Modal select list (with search and pagination)
* Editable
* Localization
* Column resizing
* Cascading select (client/server side dynamic drop-down lists)
* Tree table
* No external dependencies
* Row Grouping (multiple columns)
* Summary Row (aggregation on a column)
* Live Updates
* Virtual scroll with dynamic row height
* Header and Cell Templates
* Keyboard navigation
* Export Data to CSV

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

### Column

| Attribute        | Type       | Default | Description |
|------------------|------------|---------|-------------|
| title            | string     | null    |             |
| name             | string     | null    |             |
| sortable         | boolean    | true    |             |
| filter           | boolean    | true    |             |
| options          | SelectOption[] | null | |
| optionsUrl       | string     | null    |             |
| width            | number     | null    |             |
| frozen           | boolean    | false   |             |
| type             | text / password / number / select / radio / checkbox / textarea / date / datetime-local / select-popup | null    |             |
| validation       | Validation | null    |             |
| editable         | boolean    | false   |             |
| resizeable       | boolean    | true    |             |
| dependsColumn    | string     | null    |             |
| cellTemplate     | TemplateRef | null   |             |
| headerCellTemplate | TemplateRef | null |             |
| formHidden       | boolean    | false   |             |
| tableHidden      | boolean    | false   |             |
| cellClass        | string / Function | null |         |
| isPrimaryKey     | boolean    | false   |             |
| keyColumn        | string     | null    |             |
| selectionLimit   | number     | 1       |             |
| minWidth         | number     | 50      |             |
| maxWidth         | number     | 500     |             |
| aggregation      | sum / average / max / min / count | null |             |
| filterValuesFunc | (columnName: string) => Promise<SelectOption[]> | null |             |

### Settings

| Attribute        | Type       | Default | Description |
|------------------|------------|---------|-------------|
| api              | string     | null    |             |
| crud             | boolean    | false   |             |
| tableWidth       | number     | null    |             |
| bodyHeight       | number     | null    |             |
| sortable         | boolean    | true    |             |
| filter           | boolean    | true    |             |
| initLoad         | boolean    | true    |             |
| clientSide       | boolean    | true    |             |
| multipleSort     | boolean    | false   |             |
| trackByProp      | string     | null    |             |
| groupRowsBy      | string[]   | null    |             |
| filterDelay      | number     | 500     |             |
| globalFilter     | boolean    | false   |             |
| columnResizeMode | simple / aminated | simple |       |
| selectionMultiple | boolean   | false   |             |
| selectionMode    | checkbox / radio | null |          |
| singleRowView    | boolean    | true    |             |
| virtualScroll    | boolean    | false   |             |
| rowClass         | string / Function | false |        |
| headerTemplate   | TemplateRef | null |               |
| headerRowHeight  | number     | 40      | px, 0 - hide header |
| rowHeight        | number     | 30      | px          |
| rowNumber        | boolean    | true    |             |
| zIndexModal      | number     | null    |             |
| hoverEvents      | boolean    | false   | mouseover/mouseout |
| contextMenu      | boolean    | false   | event       |
| exportAction     | boolean    | false   | csv         |
| editMode         | editCellOnDblClick / editProgrammatically | editCellOnDblClick |             |
| actionColumnWidth | number    | 40      | px, 0 - hide |
| rowActionTemplate | TemplateRef | null  |              |

```typescript
interface SelectOption {
  id: any;
  name: string;
  parentId?: any;
}
interface Validation {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: string | RegExp;
}
```

### Sample event subscriptions
```typescript
import {Subscription} from 'rxjs';

private subscriptions: Subscription[] = [];

  ngOnInit() {
    const subSelection = this.table.events.selectionSource$.subscribe(() => {
      this.table.getSelection();
    });
    this.subscriptions.push(subSelection);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }
```

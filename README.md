# Angular 7 CRUD data table using REST backend

Feature-rich CRUD data table component for Angular using REST backend. (<a target="_blank" href="https://mazdik.github.io/ng-crud-table/">Demo</a>)  
The module contains services for: Yii2 RESTful (php), ORDS (Oracle REST Data Services), Flask-Restless (python)

### Sample crud-table
```typescript
import {Component}  from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Column, CdtSettings, DataSource, YiiService, DataManager} from '../ng-crud-table';
import {Validators} from '../../lib/validation/validators';

@Component({
  selector: 'my-app',
  template: `<app-crud-table [dataManager]="dataManager"></app-crud-table>
  <app-notify></app-notify>`
})

export class PlayersComponent {

    dataManager: DataManager;
  
    constructor(private http: HttpClient) {
      // YiiService | RestlessService | OrdsService | your custom service
      this.service = new YiiService(this.http);
      this.service.url = 'http://host3/players';
      this.service.primaryKeys = ['id'];
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
        },
        {
            title: 'Name', 
            name: 'name', 
            frozen: true, 
            width: 250,
            validatorFunc: Validators.get({required: true, minLength: 2, pattern: '^[a-zA-Z ]+$'}),
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
            type: 'select-dropdown',
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
            multiSelectFilter: true,
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
            validatorFunc: Validators.get({required: true, minLength: 2, maxLength: 10}),
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

    settings: CdtSettings = {
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
  template: `<app-data-table [table]="table"></app-data-table>`
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
import {Column, Settings, TreeTable} from '../ng-tree-table';
import {TreeDemoService} from './tree-demo.service';

@Component({
  selector: 'app-tree-table-demo',
  template: `<app-tree-table [treeTable]="treeTable"></app-tree-table>`
})

export class TreeTableDemoComponent {

  treeTable: TreeTable;
  settings: Settings;
  columns: Column[];

  constructor(private treeService: TreeDemoService) {
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
* Tree table (flatten/unflatten tree, lazy loading)
* Row Grouping (multiple columns)
* Summary Row (aggregation on a column)
* Live Updates
* Virtual scroll with dynamic row height
* Header and Cell Templates
* Keyboard navigation
* Export Data to CSV
* No external dependencies

### Custom service
```typescript
interface DataSource {
  getItems(requestMeta: RequestMetadata): Promise<PagedResult>;
  getItem(row: any): Promise<any>;
  post(row: any): Promise<any>;
  put(row: any): Promise<any>;
  delete(row: any): Promise<any>;
  getOptions?(url: string, parentId: any): Promise<any>;
}
export interface RequestMetadata {
  pageMeta: PageMetadata;
  sortMeta: SortMetadata[];
  filters: Filter;
  globalFilterValue?: string;
}
export interface PagedResult {
  items: any[];
  _meta: PageMetadata;
}
export interface PageMetadata {
  currentPage: number;
  perPage: number;
  totalCount?: number;
  pageCount?: number;
  maxRowCount?: number;
}
```

### Column

| Attribute        | Type       | Default | Description |
|------------------|------------|---------|-------------|
| title            | string     | null    |             |
| name             | string     | null    |             |
| sortable         | boolean    | true    |             |
| filter           | boolean    | true    |             |
| options          | SelectItem[] | null | |
| optionsUrl       | string     | null    |             |
| width            | number     | null    |             |
| frozen           | boolean    | false   |             |
| type             | text / password / number / select / radio / checkbox / textarea / date / datetime-local / month / select-popup / select-dropdown | null | |
| validatorFunc    | (name: string, value: any) => string[] | null | |
| editable         | boolean    | false   |             |
| resizeable       | boolean    | true    |             |
| dependsColumn    | string     | null    |             |
| cellTemplate     | TemplateRef | null   |             |
| headerCellTemplate | TemplateRef | null |             |
| formHidden       | boolean    | false   |             |
| tableHidden      | boolean    | false   |             |
| cellClass        | string / Function | null |         |
| headerCellClass  | string     | null    |             |
| keyColumn        | string     | null    |             |
| multiSelectFilter | boolean   | false   |             |
| minWidth         | number     | 50      |             |
| maxWidth         | number     | 500     |             |
| aggregation      | sum / average / max / min / count | null | |
| filterValuesFunc | (columnName: string) => Promise<SelectItem[]> | null | |
| dataType         | string /number /date | null |      |
| formDisableOnEdit | boolean   | false   |             |
| pipe             | PipeTransform | null |             |

### Settings

| Attribute        | Type       | Default | Description |
|------------------|------------|---------|-------------|
| tableWidth       | number     | null    |             |
| bodyHeight       | number     | null    |             |
| sortable         | boolean    | true    |             |
| filter           | boolean    | true    |             |
| clientSide       | boolean    | true    |             |
| multipleSort     | boolean    | false   |             |
| trackByProp      | string     | null    |             |
| groupRowsBy      | string[]   | null    |             |
| clearAllFiltersIcon | boolean | true    |             |
| columnResizeMode | simple / aminated | simple |       |
| selectionMultiple | boolean   | false   |             |
| selectionMode    | checkbox / radio | null |          |
| virtualScroll    | boolean    | false   |             |
| rowClass         | string / Function | false |        |
| headerTemplate   | TemplateRef | null |               |
| headerRowHeight  | number     | null    | px, 0 - hide header |
| rowHeight        | number     | 30      | px          |
| rowNumber        | boolean    | true    |             |
| hoverEvents      | boolean    | false   | mouseover/mouseout |
| contextMenu      | boolean    | false   | event       |
| editMode         | editCellOnDblClick / editProgrammatically | editCellOnDblClick |             |
| actionColumnWidth | number    | 40      | px, 0 - hide |
| rowActionTemplate | TemplateRef | null  |              |
| paginator        | boolean    | true    |              |
| rowHeightProp    | string     | null    |              |

### CdtSettings extends Settings
| Attribute        | Type       | Default | Description |
|------------------|------------|---------|-------------|
| crud             | boolean    | false   |             |
| initLoad         | boolean    | true    |             |
| globalFilter     | boolean    | false   |             |
| singleRowView    | boolean    | true    |             |
| zIndexModal      | number     | null    |             |
| exportAction     | boolean    | false   | csv         |


```typescript
export class SelectItem {
  id: any;
  name: string;
  parentId?: any;
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

### Sample add ngx-translate
```typescript
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { DtTranslateModule, DtTranslateService } from '../lib/dt-translate';

  DtTranslateModule.forRoot({
    service: {
      provide: DtTranslateService,
      useClass: TranslateService,
    }
  })
```
### Sample lang.json (full list in lib/dt-translate/dt-messages)
```json
{
  "DT": {
    "empty": "No data to display",
    ...
  }
}
```

### Lib
| Componnent                     | Description        |
|--------------------------------|--------------------|
| app-context-menu               |                    |
| app-dropdown-select            |                    |
| app-dynamic-form               |                    |
| export                         | csv                |
| app-inline-edit, [inline-edit] |                    |
| app-notify                     | with NotifyService |
| app-modal                      |                    |
| app-modal-edit-form            |                    |
| app-modal-select               |                    |
| app-pagination                 |                    |
| app-row-view                   |                    |
| app-scroller, [scroller]       | virtual scroll     |
| app-select-list                |                    |
| dt-toolbar                     |                    |
| tree                           |                    |
| app-tree-view                  |                    |
| validation                     |                    |
| app-sort-header, [sort-header] |                    |
| [appResizable]                 |                    |
| app-dual-list-box              |                    |

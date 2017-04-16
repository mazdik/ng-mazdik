# Angular 2 CRUD table using REST backend

Simple CRUD table component for Angular 2 using REST backend and Bootstrap 3 CSS. (<a target="_blank" href="https://mazdik.github.io/ng2-crud-table/">Demo</a>)  
Supports Yii2 RESTful API and ORDS (Oracle REST Data Services)

### Configuration
```typescript
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CrudTableModule } from './crud-table';
import { AppComponent } from './app.component';

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        CrudTableModule
    ],
    bootstrap: [
        AppComponent
    ]
})
export class AppModule {}
```

### Sample
```typescript
import { Component }  from '@angular/core';

@Component({
  selector: 'my-app',
  template: `<crud-table [columns]="columns" [settings]="settings"></crud-table>`
})

export class PlayersComponent {

    public columns: any[] = [
        { 
            title: 'Id', 
            name: 'id', 
            sortable: true, 
            filter: true, 
            frozen: true
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
        },
        {
            title: 'Race',
            name: 'race',
            sortable: true,
            filter: true,
            type: 'dropdown',
            options: [
                { id: 'ASMODIANS', name: 'ASMODIANS' },
                { id: 'ELYOS', name: 'ELYOS' },
            ],
            editable: true,
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
            format: 'date',
            editable: true,
        }
    ];
    public settings: any = {
        api: 'http://host3/players',
        crud: true,
        pageHeader: 'Players',
        primaryKey: 'id',
        type: 'yii', // ords or yii (default)
        tableWidth: 820,
        scrollHeight: 380,
    };

}
```

You will need bootstrap styles

```
<!-- index.html -->
<link href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" rel="stylesheet">
```

## Features
* Filtering
* Sorting
* Pagination
* Modal
* Create/Update/Delete
* Single row view
* Loading indicator
* MultiSelect
* Scrolling with fixed header horizontally and vertically
* Frozen columns
* Dynamic forms with validation
* Editable

# Angular 2 CRUD table using Yii 2 REST

CRUD table component for Angular 2 using Yii 2 REST backend and bootstrap 3.

### Configuration
```typescript
import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {CrudTableModule} from './crud-table';

import {AppComponent} from './app.component';

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
import {Component, OnInit, Inject}  from '@angular/core';

@Component({
  selector: 'my-app',
  template: `<crud-table [api]="api" [columns]="columns" [settings]="settings"></crud-table>`
})

export class PlayersComponent {

  public api: string = 'http://host3/players'; 
  public columns: Array<any> = [
    {title: 'Id', name: 'id', sortable: true, filter: true},
    {title: 'Name', name: 'name', sortable: true, filter: true},
    {title: 'Race', name: 'race', sortable: true, filter: true},
    {title: 'Gender', name: 'gender', sortable: true, filter: true},
    {title: 'Exp', name: 'exp', sortable: true, filter: true},
  ];
  public settings:any = {
    crud: true,
    pageHeader: 'Players',
  };

}
```

```typescript
```

```typescript
```
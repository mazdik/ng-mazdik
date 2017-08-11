import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'basic-demo',
  template: `<crud-table [columns]="columns" [settings]="settings"></crud-table>`
})

export class BasicDemoComponent implements OnInit {

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
        primaryKey: 'id',
        type: 'demo', // ords or yii (default)
        tableWidth: 820,
        scrollHeight: 380,
        treeViewWidth: 150,
    };

    constructor() {
    }

    ngOnInit() {
    }

}

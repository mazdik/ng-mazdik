import { Component, OnInit, ViewChild, Input } from '@angular/core';

import { CrudService } from './services/crud.service';
import { ModalComponent } from './modal/modal.component';
import { Column, Filter, Settings } from './types/interfaces';

@Component({
    selector: 'crud-table',
    templateUrl: './crud-table.component.html',
    styleUrls: ['./crud-table.css'],
    providers: [CrudService]
})

export class CrudTableComponent implements OnInit {

    @ViewChild('childModal')
    public readonly childModal: ModalComponent;

    @Input() public columns: Column[];
    @Input() public settings: Settings;

    items: any[];
    item: any;
    selectedItem: any;
    newItem: boolean;
    errors: any;
    onDetailView: boolean = false;

    public loading: boolean = false;

    public itemsPerPage: number = 10;
    public totalItems: number = 0;
    public currentPage: number = 1;

    public filters: Filter = {};
    public sortField: string;
    public sortOrder: number;

    constructor(private service: CrudService) {}

    ngOnInit() {
        this.service.url = this.settings.api;
        this.service.primaryKey = (this.settings['primaryKey']) ? this.settings['primaryKey'].toLowerCase() : 'id';
        this.getItems();
    }

    loadingShow() {
        this.loading = true;
    }

    loadingHide() {
        this.loading = false;
    }

    getItems() {
        this.loadingShow();
        this.errors = null;
        this.service.getItems(this.currentPage, this.filters, this.sortField, this.sortOrder)
            .then(data => {
                this.loadingHide();
                this.items = data.items;
                this.totalItems = data._meta.totalCount;
                this.itemsPerPage = data._meta.perPage;
            })
            .catch(error => {
                this.loadingHide();
                this.errors = error;
            });
    }

    public pageChanged(event: any): void {
        this.currentPage = event;
        this.getItems();
    }

    save() {
        this.loadingShow();
        this.errors = null;
        if (this.newItem) {
            this.service
                .post(this.item)
                .then(item => {
                    this.loadingHide();
                    this.item = item;
                    this.items.push(this.item);
                })
                .catch(error => {
                    this.loadingHide();
                    this.errors = error;
                });
        } else {
            this.service
                .put(this.item)
                .then(item => {
                    this.loadingHide();
                    this.items[this.findSelectedItemIndex()] = item;
                })
                .catch(error => {
                    this.loadingHide();
                    this.errors = error;
                });
        }
        this.childModal.hide();
    }

    delete() {
        this.loadingShow();
        this.errors = null;
        this.service
            .delete(this.item)
            .then(res => {
                this.loadingHide();
                this.items.splice(this.findSelectedItemIndex(), 1);
                this.item = null;
                this.onDetailView = false;
            })
            .catch(error => {
                this.loadingHide();
                this.errors = error;
            });
        this.childModal.hide();
    }

    onRowSelect(item: any) {
        this.newItem = false;
        this.item = this.cloneItem(item);
    }

    cloneItem(item: any) {
        let clone = Object.assign({}, item);
        this.selectedItem = Object.assign({}, item);
        return clone;
    }

    findSelectedItemIndex(): number {
        let obj = this.items.find(x => JSON.stringify(x) === JSON.stringify(this.selectedItem));
        let index = this.items.indexOf(obj);
        return index;
    }

    createItem() {
        this.newItem = true;
        this.item = {};
        this.childModal.show();
    }

    updateItem(item: any) {
        this.newItem = false;
        this.item = this.cloneItem(item);
        this.childModal.show();
    }

    deleteItem(item: any) {
        this.item = this.cloneItem(item);
        this.delete();
    }

    viewDetails(item: any) {
        this.errors = null;
        this.item = this.cloneItem(item);
        this.onDetailView = true;
    }

    closeDetails() {
        this.onDetailView = false;
    }

    filter(event) {
    	this.filters = event;
        this.getItems();
    }

    sort(event) {
        this.sortField = event.field;
        this.sortOrder = event.order;
        this.getItems();
    }

    public modalTitle() {
        return (this.newItem) ? 'Добавить' : 'Редактировать';
    }

}

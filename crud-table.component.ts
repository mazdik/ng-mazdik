import { Component, OnInit, ViewChild, Input, ViewEncapsulation, ElementRef, Renderer, AfterViewInit, OnDestroy, HostListener } from '@angular/core';

import { YiiService } from './services/yii.service';
import { OrdsService } from './services/ords.service';
import { DemoService } from './services/demo.service';
import { ModalComponent } from './modal/modal.component';
import { Column, Filter, Settings, ICrudService, SortMeta } from './types/interfaces';
import { ITreeNode } from './tree-view';

@Component({
    selector: 'crud-table',
    templateUrl: './crud-table.component.html',
    styleUrls: ['./crud-table.css'],
    encapsulation: ViewEncapsulation.None,
    providers: [YiiService, OrdsService, DemoService]
})

export class CrudTableComponent implements OnInit, AfterViewInit, OnDestroy {

    @ViewChild('childModal')
    public readonly childModal: ModalComponent;
    @ViewChild('selectFilter') selectFilter: any;

    @Input() public columns: Column[];
    @Input() public settings: Settings;
    @Input() public treeNodes: ITreeNode[];

    public items: any[];
    public item: any;
    public selectedItem: any;
    public selectedRowIndex: number;
    public newItem: boolean;
    public errors: any;
    public onDetailView: boolean = false;

    public loading: boolean = false;

    public itemsPerPage: number = 10;
    public totalItems: number = 0;
    public currentPage: number = 1;

    public filters: Filter = {};
    public sortMeta: SortMeta = <SortMeta>{};
    private service: ICrudService;

    public scrollHeight: number = 380;
    public tableWidth: number = 820;
    public letterWidth: number = 10;
    public actionColumnWidth: number = 40;
    @ViewChild('dataTable') dataTable: ElementRef;
    @ViewChild('tableContent') tableContent: ElementRef;
    listenFunc: Function;
    headerLockedWidth: number;
    headerWrapWidth: number;
    contentLockedWidth: number;
    contentWidth: number;
    contentLockedHeight: number;
    contentHeight: number;

    frozenColumns: Column[];
    scrollableColumns: Column[];
    frozenWidth: number = 0;
    scrollableColumnsWidth: number = 0;
    scrollBarWidth: number;

    treeViewWidth: number = 150;
    selectedNode: ITreeNode;

    constructor(private renderer: Renderer, private yiiService: YiiService, private ordsService: OrdsService, private demoService: DemoService) {}

    ngOnInit() {
        this.initService();
        this.initColumns();
        this.initTableSize() ;
        this.getItems();
    }

    ngAfterViewInit() {
        this.initScrolling();
        this.setContentHeight();
    }

    ngOnDestroy() {
        // Removes "listen" listener
        this.listenFunc();
    }

    initColumns(): void {
        this.letterWidth = this.getTextWidth('M', 'bold 14px arial');
        this.setColumnsDefaults(this.columns);
       
        this.scrollableColumns = [];
        this.columns.forEach((column) => {
            if(column.frozen) {
                this.frozenColumns = this.frozenColumns||[];
                this.frozenColumns.push(column);
                this.frozenWidth = this.frozenWidth + column.width;
            } 
            else {
                this.scrollableColumns.push(column);
                this.scrollableColumnsWidth = this.scrollableColumnsWidth + column.width;
            }
        });
    }

    initTableSize() {
        if (this.treeNodes) {
            this.treeViewWidth = this.settings.treeViewWidth || this.treeViewWidth;
        } else {
            this.treeViewWidth = 0;
        }
    	this.scrollHeight = this.settings.scrollHeight || this.scrollHeight;
     	this.tableWidth = this.settings.tableWidth || this.tableWidth;
        this.scrollBarWidth = this.calculateScrollbarWidth();
        this.headerLockedWidth = this.frozenWidth + this.actionColumnWidth;
        this.headerWrapWidth = this.tableWidth - this.headerLockedWidth - this.treeViewWidth;
        this.contentLockedWidth = this.headerLockedWidth;
        this.contentWidth = this.headerWrapWidth + this.scrollBarWidth;
        this.contentLockedHeight = this.scrollHeight;
        this.contentHeight = this.contentLockedHeight + this.scrollBarWidth;;
    }

    initScrolling() {
        let rcBody = this.dataTable.nativeElement.querySelector('.k-grid-content');
        let fcBody = this.dataTable.nativeElement.querySelector('.k-grid-content-locked');
        let rcHead = this.dataTable.nativeElement.querySelector('.k-grid-header-wrap');
        this.listenFunc = this.renderer.listen(rcBody, 'scroll', (event) => {
            fcBody.scrollTop = rcBody.scrollTop;
            rcHead.scrollLeft = rcBody.scrollLeft;
            this.selectFilter.hide();
        });
    }

    initService() {
        if (this.settings.type === 'yii') {
          this.service = this.yiiService;
        } else if (this.settings.type === 'ords') {
          this.service = this.ordsService;
        } else if (this.settings.type === 'demo') {
          this.service = this.demoService;
        } else {
          this.service = this.yiiService;
        }
        this.service.url = this.settings.api;
        this.service.primaryKey = (this.settings.primaryKey) ? this.settings.primaryKey.toLowerCase() : 'id';
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
        this.service.getItems(this.currentPage, this.filters, this.sortMeta.field, this.sortMeta.order)
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

    pageChanged(event: any): void {
        this.currentPage = event;
        this.getItems();
    }

    save() {
        this.loadingShow();
        this.errors = null;
        if (this.newItem) {
            this.service
                .post(this.item)
                .then(res => {
                    this.loadingHide();
                    this.item = res;
                    this.items.push(this.item);
                })
                .catch(error => {
                    this.loadingHide();
                    this.errors = error;
                });
        } else {
            this.service
                .put(this.item)
                .then(res => {
                    this.loadingHide();
                    this.items[this.findSelectedItemIndex()] = res;
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

    onRowSelect(event) {
        this.selectedRowIndex = event;
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

    editItem(item: any) {
        this.newItem = false;
        this.item = this.cloneItem(item);
        this.save();
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
        this.syncNode();
    }

    sort(event) {
        this.sortMeta = event.sortMeta;
        this.getItems();
    }

    modalTitle() {
        return (this.newItem) ? 'Добавить' : 'Редактировать';
    }

    calculateScrollbarWidth(): number {
        let scrollDiv = document.createElement("div");
        scrollDiv.className = "scrollbar-measure";
        document.body.appendChild(scrollDiv);

        let scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;
        document.body.removeChild(scrollDiv);
        
        return scrollbarWidth;
    }

    showColumnMenu(event) {
        this.selectFilter.show(200, event.top, event.left, event.column);
    }

    setColumnDefaults(column: Column): Column {
        if (!column.hasOwnProperty('sortable')) {
            column.sortable = true;
        }
        if (!column.hasOwnProperty('filter')) {
            column.filter = true;
        }
        if (!column.hasOwnProperty('width')) {
            column.width = (column.name.length * this.letterWidth) + 50;
            if(column.width < 150) {
                column.width = 150;
            }
        }
        if (!column.hasOwnProperty('frozen')) {
            column.frozen = false;
        }
        if (!column.hasOwnProperty('type')) {
            column.type = 'text';
        }
        return column;
    }

    setColumnsDefaults(columns: Column[]): Column[] {
        if (!columns) return;

        let result = columns.map(this.setColumnDefaults, this);
        return result;
    }

    columnsTotalWidth(columns: Column[]): number {
        let totalWidth = 0;
        for (let column of columns) {
            totalWidth = totalWidth + column.width;
        }
        return totalWidth;
    }

	getTextWidth(text, font) {
	    let canvas = document.createElement("canvas");
	    let context = canvas.getContext("2d");
	    context.font = font;
	    let metrics = context.measureText(text);
	    return metrics.width;
	}

    setContentHeight() {
        let hasHorizontalScrollbar = this.tableContent.nativeElement.scrollWidth > this.tableContent.nativeElement.clientWidth;
        if(hasHorizontalScrollbar) {
           this.contentHeight = this.contentLockedHeight + this.scrollBarWidth;
        } else {
            this.contentHeight = this.contentLockedHeight;
        }
    }

    @HostListener('window:resize', ['$event'])
    onResize(event) {
      this.setContentHeight();
    }

    selectNode(node: ITreeNode) {
        if(node) {
            if (node.id) {
                this.filters[node.column] = { value: node.id, matchMode: null };
            }
            else if (this.filters[node.column]) {
                delete this.filters[node.column];
            }
            this.selectFilter.setColumnSelectedOption(node.id, node.column, null);
            //console.log('node.id ' + node.id);

            if(node.parent) {
                this.selectNode(node.parent); 
            }
        }
    }

    onSelectNode(node: ITreeNode) {
        this.selectedNode = node;
        this.selectNode(node);
        if(node.children) {
            for (let childNode of node.children) {
                if (this.filters[childNode.column]) {
                    delete this.filters[childNode.column];
                    this.selectFilter.setColumnSelectedOption(null, childNode.column, null);
                    //console.log('childNode.id ' + childNode.id);
                }
            }
        }
        this.getItems();
    }

    setNode(field: string, value: string) {
        for (let node of this.treeNodes) {
            if(node.column === field && node.id === value) {
                this.selectedNode = node;
            }
        } 
    }

    syncNode() {
        if(Object.keys(this.filters).length === 0) {
            this.selectedNode = null;
        } else {
            for (let key in this.filters) {
                if (this.filters[key]['value']) {
                    this.setNode(key, this.filters[key]['value']);
                }
            }
        }
    }

}

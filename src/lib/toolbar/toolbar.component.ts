import {
    Component, Input, Output, EventEmitter, HostBinding, ElementRef, OnInit, OnDestroy, ViewEncapsulation,
    ChangeDetectionStrategy, ChangeDetectorRef,
} from '@angular/core';
import {DataTable} from '../../ng-data-table/base';
import {Subscription} from 'rxjs';
import {ExportCSV} from '../export/export-csv';

@Component({
    selector: 'dt-toolbar',
    templateUrl: './toolbar.component.html',
    styleUrls: ['toolbar.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
})
export class ToolbarComponent implements OnInit, OnDestroy {

    @Input() table: DataTable;
    @Output() createAction: EventEmitter<any> = new EventEmitter();

    @HostBinding('class') cssClass = 'datatable-toolbar';

    private subscriptions: Subscription[] = [];

    constructor(private element: ElementRef, private cd: ChangeDetectorRef, private exportCSV: ExportCSV) {
    }

    ngOnInit() {
        const subFilter = this.table.events.filterSource$.subscribe(() => {
          this.cd.markForCheck();
        });
        this.subscriptions.push(subFilter);
    }

    ngOnDestroy() {
        this.subscriptions.forEach(s => s.unsubscribe());
    }

    globalFilter() {
        this.table.dataFilter.filters = {};
        this.table.dataFilter.isGlobal = true;
        this.table.events.onFilter();
    }

    onClickGlobalSearch() {
        this.globalFilter();
    }

    onKeyPressGlobalSearch(event: KeyboardEvent) {
        if (event.which === 13) {
          this.globalFilter();
        }
    }

    downloadCsv() {
        this.exportCSV.downloadCSV(this.table.rows, null);
    }

    createActionClick() {
        this.createAction.emit();
    }

    getHeight() {
        return this.element.nativeElement.offsetHeight;
    }

}

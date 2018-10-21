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
    styleUrls: [
      'toolbar.component.css',
      '../styles/input-group.css',
      '../styles/buttons.css',
      '../styles/input.css'
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
})
export class ToolbarComponent implements OnInit, OnDestroy {

    @Input() table: DataTable;
    @Input() createAction: boolean;
    @Input() globalFilter: boolean = true;
    @Input() exportAction: boolean;
    @Input() createMessage: string = 'Create';
    @Input() goMessage: string = 'Go';
    @Input() exportMessage: string = 'Export';
    @Input() searchMessage: string = 'Search...';

    @Output() create: EventEmitter<any> = new EventEmitter();

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

    onClickGlobalSearch() {
        this.table.events.onFilter();
    }

    onKeyPressGlobalSearch(event: KeyboardEvent) {
        if (event.which === 13) {
            this.table.events.onFilter();
        }
    }

    downloadCsv() {
        const keys = this.table.columns.map(col => col.name);
        const titles = this.table.columns.map(col => col.title);
        this.exportCSV.downloadCSV(this.table.rows, null, keys, titles);
    }

    createActionClick() {
        this.create.emit();
    }

    getHeight() {
        return this.element.nativeElement.offsetHeight;
    }

}

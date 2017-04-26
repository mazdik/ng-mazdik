import { Component, OnInit, Input, Output, EventEmitter, Renderer, AfterViewInit, OnDestroy } from '@angular/core';
import { Column } from '../types/interfaces';

@Component({
  selector: '[datatable-body]',
  templateUrl: './body.component.html',
  styleUrls: ['./body.component.css']
})
export class BodyComponent implements OnInit, AfterViewInit, OnDestroy {

	@Input() public columns: Column[];
	@Input() public items: any;
	@Input() public enableAction: boolean;
	@Input() public crud: boolean;
    @Input() public selectedRowIndex: number;
	@Output() onViewAction: EventEmitter<any> = new EventEmitter();
	@Output() onUpdateAction: EventEmitter<any> = new EventEmitter();
    @Output() onEditComplete: EventEmitter<any> = new EventEmitter();
    @Output() onRowSelect: EventEmitter<any> = new EventEmitter();
	public editingCell: any;
    public editorClick: boolean;
    public documentClickListener: Function;
    public editable: boolean = false;

	constructor(private renderer: Renderer) { }

	ngOnInit() {
        if(this.columns) {
            this.columns.forEach((column) => {
                if(column.editable) {
                    this.editable = true;
                }
            });
        }
	}

    ngAfterViewInit() {
        if(this.editable) {
            this.documentClickListener = this.renderer.listenGlobal('body', 'click', (event) => {
                if(!this.editorClick) {
                    this.closeCell();
                }
                this.editorClick = false;
            });
        }
    }

    ngOnDestroy() {
        if(this.documentClickListener) {
            this.documentClickListener();
        }
    }

    format(value: any, column: Column) {
        if(column.format &&  column.format === 'date') {
            let d = new Date(value*1000);
            value = d.toLocaleString('ru');
        }
        return value;
    }

    findCell(event) {
        let cell = event.target;
        while(cell.tagName != 'TD') {
            cell = cell.parentElement;
        }
        return cell;
    }

    switchCellToEditMode(event: any, column: Column) {
        if(column.editable) {
            this.editorClick = true;
            let cell = this.findCell(event);
            if(cell != this.editingCell) {
                if(this.editingCell) {
                    this.renderer.setElementClass(this.editingCell, "cell-editing", false);    
                }
                this.renderer.setElementClass(cell, "cell-editing", true);
                this.editingCell = cell;
                let focusable;
                if(column.options) {
                    focusable = cell.querySelector('.cell-editor select');
                } else {
                    focusable = cell.querySelector('.cell-editor input');
                }
                if(focusable) {
                    setTimeout(() => this.renderer.invokeElementMethod(focusable, 'focus'), 50);
                }
            }
        }
    }

    switchCellToViewMode(event: any) {
        this.editingCell = null;
        let cell = this.findCell(event);
        this.renderer.setElementClass(cell, "cell-editing", false);
    }

    closeCell() {
        if(this.editingCell) {
            this.renderer.setElementClass(this.editingCell, "cell-editing", false);
            this.editingCell = null;
        }
    }

    onCellEditorKeydown(event: any, column: Column, item: any, colIndex: number) {
        //enter
        if(event.keyCode == 13) {
            this.onEditComplete.emit(item);
            this.renderer.invokeElementMethod(event.target, 'blur');
            this.switchCellToViewMode(event);
            event.preventDefault();
        }
        //escape
        else if(event.keyCode == 27) {
            //this.onEditCancel.emit({column: column, data: rowData});
            this.renderer.invokeElementMethod(event.target, 'blur');
            this.switchCellToViewMode(event);
            event.preventDefault();
        }
        //tab
        else if(event.keyCode == 9) {
            let currentCell = this.findCell(event);
            let row = currentCell.parentElement;
            let targetCell;
            
            if(event.shiftKey) {
                if(colIndex == 0) {
                    let previousRow = row.previousElementSibling;
                    if(previousRow) {
                        targetCell = previousRow.lastElementChild;
                    }
                }
                else {
                    targetCell = row.children[colIndex - 1];
                }
            }
            else {
                if(colIndex == (row.children.length - 1)) {
                    let nextRow = row.nextElementSibling;
                    if(nextRow) {
                        targetCell = nextRow.firstElementChild;
                    }
                }
                else {
                    targetCell = row.children[colIndex + 1];
                }
            }
            
            if(targetCell) {
                this.renderer.invokeElementMethod(targetCell, 'click');
                event.preventDefault();
            }
        }
    }

    viewAction(item: any) {
    	this.onViewAction.emit(item);
    }

    updateAction(item: any) {
    	this.onUpdateAction.emit(item);
    }

    handleRowClick(event: any, rowIndex: number) {
        this.selectedRowIndex = rowIndex;
        this.onRowSelect.emit(this.selectedRowIndex);
    }

}

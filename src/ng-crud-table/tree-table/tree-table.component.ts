import {Component, OnInit, Input, Output, EventEmitter, ViewEncapsulation} from '@angular/core';
import {ITreeNode, ITreeService, Column, Settings} from '../types';
import {DataTable} from '../models/data-table';


@Component({
  selector: 'tree-table',
  templateUrl: './tree-table.component.html',
  styleUrls: ['../tree-view/tree-view.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class TreeTableComponent implements OnInit {

  @Input() public nodes: ITreeNode[];
  @Input() public service: ITreeService;
  @Output() requestNodes: EventEmitter<ITreeNode> = new EventEmitter();
  @Output() editComplete: EventEmitter<any> = new EventEmitter();

  @Input()
  set columns(val: Column[]) {
    this._columns = val;
    this.table.createColumns(this._columns);
  }

  get columns(): Column[] {
    return this._columns;
  }

  @Input()
  set settings(val: Settings) {
    this._settings = val;
    this.table.setSettings(this._settings);
  }

  get settings(): Settings {
    return this._settings;
  }

  public table: DataTable;
  public offsetX: number = 0;
  private _columns: Column[];
  private _settings: Settings;

  constructor() {
    this.table = new DataTable();
  }

  ngOnInit() {
    if (this.service && !this.nodes) {
      this.service.getNodes().then(data => {
        this.nodes = data;
      });
    }
    this.table.actionColumnWidth = 250;
  }

  onBodyScroll(event: any): void {
    const scrollYPos: number = event.scrollYPos;
    const scrollXPos: number = event.scrollXPos;
    this.offsetX = scrollXPos;
  }

  onCellEditComplete(event) {
    this.editComplete.emit(event);
  }

  onRequestNodes(event) {
    this.requestNodes.emit(event);
  }

}

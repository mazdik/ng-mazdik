import {Component, OnInit, Input, Output, EventEmitter, ViewEncapsulation} from '@angular/core';
import {ITreeNode, ITreeService, Column, Settings} from '../types/interfaces';

@Component({
  selector: 'tree-table',
  templateUrl: './tree-table.component.html',
  styleUrls: ['../crud-table.css'],
  encapsulation: ViewEncapsulation.None,
})
export class TreeTableComponent implements OnInit {

  @Input() public nodes: ITreeNode[];
  @Input() public service: ITreeService;
  @Input() public columns: Column[];
  @Input() public headerHeight: number = 30;
  @Input() public settings: Settings = <Settings> {};
  @Output() requestNodes: EventEmitter<ITreeNode> = new EventEmitter();
  @Output() editComplete: EventEmitter<any> = new EventEmitter();

  offsetX: number = 0;

  constructor() {
  }

  ngOnInit() {
    if (this.service && !this.nodes) {
      this.service.getNodes().then(data => {
        this.nodes = data;
      });
    }
    this.settings.sortable = (this.settings.hasOwnProperty('sortable')) ? this.settings.sortable : true;
    this.settings.filter = (this.settings.hasOwnProperty('filter')) ? this.settings.filter : true;
    this.settings.initLoad = (this.settings.initLoad !== undefined) ? this.settings.initLoad : true;
  }

  resizeColumn({column, newValue}: any) {
    for (const col of this.columns) {
      if (col.name === column.name) {
        col.width = newValue;
      }
    }
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

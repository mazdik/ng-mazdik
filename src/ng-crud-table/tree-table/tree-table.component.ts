import {Component, OnInit, Input, Output, EventEmitter, ViewEncapsulation} from '@angular/core';
import {TreeNode, TreeDataSource} from '../types';
import {DataTable} from '../base/data-table';

@Component({
  selector: 'app-tree-table',
  templateUrl: './tree-table.component.html',
  styleUrls: ['../styles/index.css'],
  encapsulation: ViewEncapsulation.None,
})
export class TreeTableComponent implements OnInit {

  @Input() public nodes: TreeNode[];
  @Input() public service: TreeDataSource;
  @Input() public table: DataTable;
  @Output() requestNodes: EventEmitter<TreeNode> = new EventEmitter();
  @Output() editComplete: EventEmitter<any> = new EventEmitter();

  constructor() {
  }

  ngOnInit() {
    if (this.service && !this.nodes) {
      this.service.getNodes().then(data => {
        this.nodes = data;
      });
    }
    this.table.dimensions.actionColumnWidth = 250;
    this.table.settings.columnResizeMode = 'aminated';
  }

  onCellEditComplete(event) {
    this.editComplete.emit(event);
  }

  onRequestNodes(event) {
    this.requestNodes.emit(event);
  }

}

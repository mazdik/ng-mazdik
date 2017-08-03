import {Component, OnInit, Input, Output, EventEmitter, ViewEncapsulation} from '@angular/core';
import {ITreeNode, Column} from '../types/interfaces';

@Component({
  selector: 'tree-table',
  templateUrl: './tree-table.component.html',
  styleUrls: ['../crud-table.css'],
  encapsulation: ViewEncapsulation.None,
})
export class TreeTableComponent implements OnInit {

  @Input() nodes: ITreeNode[];
  @Input() columns: Column[];

  @Output() onRequestNodes: EventEmitter<ITreeNode> = new EventEmitter();

  constructor() {
  }

  ngOnInit() {
  }

}

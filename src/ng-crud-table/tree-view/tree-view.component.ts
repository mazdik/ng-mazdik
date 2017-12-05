import {Component, Input, Output, EventEmitter, OnInit} from '@angular/core';
import {ITreeNode, ITreeService} from '../types/interfaces';

@Component({
  selector: 'tree-view',
  styleUrls: ['./tree-view.component.css'],
  template: `
    <ul class="tree-container">
      <tree-view-node
        *ngFor="let node of nodes"
        [node]="node"
        [service]="service"
        [selectedNode]="selectedNode"
        (selectedChanged)="selectedChanged.emit($event)"
        (requestNodes)="requestNodes.emit($event)">
      </tree-view-node>
    </ul>
  `
})
export class TreeViewComponent implements OnInit {

  @Input() public nodes: ITreeNode[];
  @Input() public selectedNode: ITreeNode;
  @Input() public service: ITreeService;

  @Output() selectedChanged: EventEmitter<ITreeNode> = new EventEmitter<ITreeNode>();
  @Output() requestNodes: EventEmitter<ITreeNode> = new EventEmitter();

  constructor() {
  }

  ngOnInit() {
  }

}

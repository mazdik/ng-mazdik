import {Component, Input, Output, EventEmitter, OnInit} from '@angular/core';
import {ITreeNode, ITreeService} from '../types/interfaces';

@Component({
  selector: 'tree-view',
  templateUrl: './tree-view.component.html',
  styleUrls: ['./tree-view.component.css']
})
export class TreeViewComponent implements OnInit {

  @Input() public nodes: ITreeNode[];
  @Input() public selectedNode: ITreeNode;
  @Input() public service: ITreeService;

  @Output() selectedChanged: EventEmitter<ITreeNode> = new EventEmitter<ITreeNode>();
  @Output() requestNodes: EventEmitter<ITreeNode> = new EventEmitter();

  loading: boolean = false;

  constructor() {
  }

  ngOnInit() {
  }

  isLeaf(node: ITreeNode) {
    return node.leaf === false ? false : !(node.children && node.children.length);
  }

  isSelected(node: ITreeNode) {
    return node === this.selectedNode;
  }

  onSelectNode(node: ITreeNode) {
    if (this.selectedNode !== node) {
      this.selectedNode = node;
      this.selectedChanged.emit(node);
    }
  }

  onExpand(node: ITreeNode) {
    node.expanded = !node.expanded;
    if (node.expanded && (!node.children || node.children.length === 0) && node.leaf === false) {
      this.requestNodes.emit(node);

      if (this.service) {
        this.loading = true;
        this.service.getNodes(node).then(data => {
          node.children = data;
          this.loading = false;
        }).catch(err => {
          this.loading = false;
        });
      }
    }
  }

  onRequestLocal(node: ITreeNode) {
    this.requestNodes.emit(node);
  }

  getIcon(node: ITreeNode) {
    let icon: string;
    if (this.loading) {
      return 'icon-collapsing';
    }
    if (node.icon) {
      icon = node.icon;
    } else if (!this.isLeaf(node) && node.expanded) {
      icon = 'icon-node icon-collapsed';
    } else if (!this.isLeaf(node)) {
      icon = 'icon-node';
    }
    return icon;
  }

}

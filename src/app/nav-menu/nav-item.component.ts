import { Component, Input, Output, EventEmitter, HostBinding } from '@angular/core';
import { TreeNode } from 'ng-mazdik-lib';

@Component({
  selector: 'app-nav-item',
  templateUrl: 'nav-item.component.html',
})
export class NavItemComponent {

  @Input() node: TreeNode;
  @Input() set expandedNode(val: TreeNode) {
    if (val && val.$$level === this.node.$$level && val !== this.node) {
      this.node.expanded = false;
    }
  }
  @Input() getIconFunc: (node?: TreeNode) => string;

  @Output() expand: EventEmitter<TreeNode> = new EventEmitter();

  @HostBinding('class.nav-item') cssClass = true;

  constructor() {}

  get classes() {
    return {
      ['level-' + (this.node.$$level + 1)]: true,
      collapsed: !this.node.expanded,
      expanded: this.node.expanded
    };
  }

  headerClicked() {
    this.node.expanded = !this.node.expanded;
    this.expand.emit(this.node);
  }

  getIcon(node: TreeNode) {
    if (this.getIconFunc) {
      return this.getIconFunc(node);
    } else {
      return node.icon;
    }
  }

}

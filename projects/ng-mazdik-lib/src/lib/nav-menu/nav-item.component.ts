import { Component, Input, Output, EventEmitter, HostBinding } from '@angular/core';
import { TreeNode } from '../tree-lib';
import { isBlank } from '../common';

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
  @Output() linkClicked: EventEmitter<string> = new EventEmitter();

  @HostBinding('class.nav-item') cssClass = true;

  constructor() {}

  get classes() {
    return {
      ['level-' + (this.node.$$level + 1)]: true,
      collapsed: !this.node.expanded,
      expanded: this.node.expanded,
      active: this.node.isSelected
    };
  }

  get headingChildrenClasses() {
    return {
      collapsed: !this.node.expanded,
      expanded: this.node.expanded
    };
  }

  getIcon(node: TreeNode) {
    if (this.getIconFunc) {
      return this.getIconFunc(node);
    } else {
      return node.icon;
    }
  }

  onClickHeader(event: MouseEvent) {
    event.preventDefault();
    this.node.expanded = !this.node.expanded;
    this.expand.emit(this.node);
    if (!isBlank(this.node.id)) {
      this.linkClicked.emit(this.node.id);
    }
  }

  onClickLink(event: MouseEvent) {
    event.preventDefault();
    this.node.setSelected();
    this.linkClicked.emit(this.node.id);
  }

}

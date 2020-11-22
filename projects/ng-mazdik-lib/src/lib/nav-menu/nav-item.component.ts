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
  @Output() expand: EventEmitter<TreeNode> = new EventEmitter();
  @Output() linkClicked: EventEmitter<string> = new EventEmitter();

  @HostBinding('class.nav-item') cssClass = true;

  constructor() {}

  get classes(): any {
    return {
      ['level-' + (this.node.$$level + 1)]: true,
      collapsed: !this.node.expanded,
      expanded: this.node.expanded,
      active: this.node.isSelected,
      heading: this.node.hasChildren
    };
  }

  get headingChildrenClasses(): any {
    return {
      collapsed: !this.node.expanded,
      expanded: this.node.expanded
    };
  }

  onClickLink(event: MouseEvent): void  {
    event.preventDefault();
    if (this.node.hasChildren) {
      this.node.expanded = !this.node.expanded;
      this.expand.emit(this.node);
    } else {
      this.node.setSelected();
    }
    if (!isBlank(this.node.id)) {
      this.linkClicked.emit(this.node.id);
    }
  }

}

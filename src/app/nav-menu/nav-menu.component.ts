import { Component, Input, HostBinding, HostListener } from '@angular/core';
import { TreeNode, Tree } from 'ng-mazdik-lib';

@Component({
  selector: 'app-nav-menu',
  template: `<app-nav-item *ngFor="let node of nodes"
    [node]="node"
    [expandedNode]="expandedNode"
    [getIconFunc]="getIconFunc"
    (expand)="expandedNode = $event">
  </app-nav-item>`,
})
export class NavMenuComponent {

  @Input()
  get nodes(): TreeNode[] { return this.tree.nodes; }
  set nodes(val: TreeNode[]) {
    this.tree.nodes = val;
  }
  @Input() getIconFunc: (node?: TreeNode) => string;
  @Input() minimize: boolean;

  tree: Tree = new Tree();
  expandedNode: TreeNode;
  private collapsed: boolean = true;

  @HostBinding('class.nav-menu') cssClass = true;

  @HostBinding('class.nav-expanded') get cssClassExp() {
    return (this.minimize) ? !this.collapsed : true;
  }
  @HostBinding('class.nav-collapsed') get cssClassCol() {
    return (this.minimize) && this.collapsed;
  }

  @HostListener('mouseenter')
  onMouseEnter() {
    this.collapsed = false;
  }

  @HostListener('mouseleave')
  onMouseLeave() {
    this.collapsed = true;
  }

  constructor() {}

}

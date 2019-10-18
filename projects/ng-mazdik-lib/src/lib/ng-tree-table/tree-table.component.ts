import {
  Component, OnInit, OnDestroy, Input, HostBinding, ViewChild, TemplateRef,
  ChangeDetectionStrategy
} from '@angular/core';
import {TreeTable} from './tree-table';
import {Row} from '../ng-data-table/base/row';
import {Subscription} from 'rxjs';
import {TreeNode, TreeHelper} from '../tree-lib';

@Component({
  selector: 'app-tree-table',
  templateUrl: './tree-table.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TreeTableComponent implements OnInit, OnDestroy {

  @Input() treeTable: TreeTable;

  @HostBinding('class.datatable') cssClass = true;
  @ViewChild('cellTemplate', {static: true}) cellTemplate: TemplateRef<any>;

  private subscriptions: Subscription[] = [];

  constructor() {}

  ngOnInit() {
    const index = this.treeTable.settings.selectionMode ? 1 : 0;
    this.treeTable.columns[index].cellTemplate = this.cellTemplate;
    this.initGetNodes();

    const subCheckbox = this.treeTable.events.checkboxSource$.subscribe((event) => {
      this.treeTable.selectionToggle(event);
    });
    this.subscriptions.push(subCheckbox);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  initGetNodes() {
    this.treeTable.events.onLoading(true);
    this.treeTable.tree.initLoadNodes()
      .then(() => {
        this.treeTable.flatten();
      })
      .finally(() => { this.treeTable.events.onLoading(false); });
  }

  onExpand(node: TreeNode) {
    node.expanded = !node.expanded;
    if (node.expanded) {
      node.$$loading = true;
      this.treeTable.tree.loadNode(node)
        .then(() => {
          this.treeTable.flatten();
        })
        .finally(() => { node.$$loading = false; });
    } else {
      this.treeTable.flatten();
    }
  }

  getExpanderIcon(node: TreeNode) {
    return TreeHelper.getExpanderIcon(node);
  }

  getIcon(node: TreeNode) {
    if (this.treeTable.getIconFunc) {
      return this.treeTable.getIconFunc(node);
    } else {
      return node.icon;
    }
  }

  paddingIndent(row: Row): number {
    return row.$$level * this.treeTable.indent;
  }

}

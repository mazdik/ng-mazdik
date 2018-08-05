import {
  Component, OnInit, OnDestroy, Input, ViewEncapsulation, ChangeDetectorRef, HostBinding, ViewChild, TemplateRef
} from '@angular/core';
import {TreeTable} from '../../base';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-tree-table',
  templateUrl: './tree-table.component.html',
  styleUrls: ['../../../ng-data-table/styles/index.css'],
  encapsulation: ViewEncapsulation.None,
})
export class TreeTableComponent implements OnInit, OnDestroy {

  @Input() public treeTable: TreeTable;

  @HostBinding('class') cssClass = 'datatable';
  @ViewChild('cellTemplate') cellTemplate: TemplateRef<any>;

  private subscriptions: Subscription[] = [];

  constructor(private cd: ChangeDetectorRef) {
  }

  ngOnInit() {
    this.treeTable.columns[0].cellTemplate = this.cellTemplate;
    this.initGetNodes();

    const subScroll = this.treeTable.events.scrollSource$.subscribe((event) => {
      requestAnimationFrame(() => {
        this.cd.detectChanges();
      });
    });
    this.subscriptions.push(subScroll);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  initGetNodes() {
    this.treeTable.events.onLoading(true);
    this.treeTable.tree.initLoadNodes().then(() => {
      this.treeTable.flatten();
      this.treeTable.events.onLoading(false);
    }).catch(() => {
      this.treeTable.events.onLoading(false);
    });
  }

  onExpand(node: any) {
    node.expanded = !node.expanded;
    if (node.expanded) {
      node.loading = true;
      this.treeTable.tree.loadNode(node).then(() => {
        this.treeTable.flatten();
        node.loading = false;
      }).catch(() => {
        node.loading = false;
      });
    } else {
      this.treeTable.flatten();
    }
  }

  getIcon(node: any) {
    let icon: string;
    if (node.loading && !this.isLeaf(node)) {
      return 'icon-collapsing';
    }
    if (!this.isLeaf(node) && node.expanded) {
      icon = 'icon-node icon-collapsed';
    } else if (!this.isLeaf(node)) {
      icon = 'icon-node';
    }
    return icon;
  }

  isLeaf(node: any) {
    return node.leaf === false ? false : !(node.children && node.children.length);
  }

}

import {
  Component, OnInit, OnDestroy, Input, ViewEncapsulation, HostBinding, ViewChild, TemplateRef,
  ChangeDetectionStrategy, ChangeDetectorRef
} from '@angular/core';
import {TreeTable, Row} from '../../base';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-tree-table',
  templateUrl: './tree-table.component.html',
  styleUrls: ['../../../ng-data-table/styles/index.css'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TreeTableComponent implements OnInit, OnDestroy {

  @Input() treeTable: TreeTable;

  @HostBinding('class') cssClass = 'datatable';
  @ViewChild('cellTemplate') cellTemplate: TemplateRef<any>;

  private subscriptions: Subscription[] = [];

  constructor(private cd: ChangeDetectorRef) {
  }

  ngOnInit() {
    this.treeTable.columns[0].cellTemplate = this.cellTemplate;
    this.initGetNodes();

    const subScroll = this.treeTable.events.scrollSource$.subscribe(() => {
      requestAnimationFrame(() => {
        this.cd.detectChanges();
      });
    });
    const subCheckbox = this.treeTable.events.checkboxSource$.subscribe((event) => {
      this.selectionToggle(event);
    });
    this.subscriptions.push(subScroll);
    this.subscriptions.push(subCheckbox);
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
    if (node.loading && !node.isLeaf()) {
      return 'icon-collapsing';
    }
    if (!node.isLeaf() && node.expanded) {
      icon = 'icon-node icon-collapsed';
    } else if (!node.isLeaf()) {
      icon = 'icon-node';
    }
    return icon;
  }

  selectionToggle(row: Row): void {
    const descendants = this.treeTable.getDescendants(row);
    this.treeTable.selection.isRowSelected(row.$$index)
      ? this.treeTable.selection.select(...descendants)
      : this.treeTable.selection.deselect(...descendants);
  }

}

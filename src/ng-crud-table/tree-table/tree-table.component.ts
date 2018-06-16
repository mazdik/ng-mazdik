import {
  Component, OnInit, OnDestroy, Input, Output, EventEmitter, ViewEncapsulation, ChangeDetectorRef
} from '@angular/core';
import {TreeNode, TreeDataSource} from '../types';
import {DataTable} from '../base';
import {getUidRow} from '../base/util';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-tree-table',
  templateUrl: './tree-table.component.html',
  styleUrls: ['../styles/index.css'],
  encapsulation: ViewEncapsulation.None,
})
export class TreeTableComponent implements OnInit, OnDestroy {

  @Input() public nodes: TreeNode[];
  @Input() public service: TreeDataSource;
  @Input() public table: DataTable;
  @Output() requestNodes: EventEmitter<TreeNode> = new EventEmitter();
  @Output() editComplete: EventEmitter<any> = new EventEmitter();

  private subscriptions: Subscription[] = [];

  constructor(private cd: ChangeDetectorRef) {
  }

  ngOnInit() {
    if (this.service && !this.nodes) {
      this.service.getNodes().then(data => {
        this.nodes = data;
        this.setRowIndexes(this.nodes);
      });
    } else {
      this.setRowIndexes(this.nodes);
    }
    this.table.dimensions.actionColumnWidth = 250;
    this.table.settings.columnResizeMode = 'aminated';

    const subScroll = this.table.events.scrollSource$.subscribe((event) => {
      this.cd.detectChanges();
    });
    this.subscriptions.push(subScroll);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  onCellEditComplete(event) {
    this.editComplete.emit(event);
  }

  onRequestNodes(event) {
    this.requestNodes.emit(event);
  }

  setRowIndexes(nodes: TreeNode[]) {
    if (nodes && nodes.length) {
      nodes.forEach(n => {
        n.data.index = getUidRow();
        if (n.children) {
          this.setRowIndexes(n.children);
        }
      });
    }
  }

}

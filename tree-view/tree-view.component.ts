import { Component, Input, Output, EventEmitter, OnInit, HostBinding } from "@angular/core";

export interface ITreeNode {
    id: string;
    name: string;
    column: string; 
    children?: ITreeNode[];
    isExpanded?: boolean;
    leaf?: boolean;
    parent?: ITreeNode;
}

@Component({
	selector: 'treeNode',
    templateUrl: './tree-node.component.html',
    styleUrls: ['./tree-node.component.css'],
})
export class TreeNodeComponent implements OnInit {

	@Input() node: any;
    @Input() selectedNode: ITreeNode;
    @Input() parentNode: ITreeNode;
    @Output() onSelectedChanged: EventEmitter<ITreeNode> = new EventEmitter<ITreeNode>();

	ngOnInit() {
        if(this.node !== this.parentNode) {
            this.node.parent = this.parentNode;
        }
	}

	toggle() {
        this.node.isExpanded = !this.node.isExpanded;
	}

    isLeaf() {
        return this.node.leaf == false ? false : !(this.node.children && this.node.children.length);
    }

    onSelectNode(node: ITreeNode) {
        if(this.selectedNode !== node) {
            this.selectedNode = node;
            this.onSelectedChanged.emit(node);
        }
    }

    isSelected() {
        return this.node === this.selectedNode;
    }

}

@Component({
    selector: "tree-view",
    templateUrl: './tree-view.component.html',
    styleUrls: ['./tree-view.component.css'],
    host: {
        'style': 'overflow: auto;'
    }
})
export class TreeViewComponent {

    @Input() nodes: ITreeNode[];
    @Input() selectedNode: ITreeNode;

    @HostBinding('style.height.px')
    @Input() height: number;

    @HostBinding('style.width.px')
    @Input() width: number;

    @Output() onSelectedChanged: EventEmitter<ITreeNode> = new EventEmitter<ITreeNode>();
    @Output() onRequestNodes: EventEmitter<ITreeNode> = new EventEmitter<ITreeNode>();

    constructor() { }

    onSelectNode(node: ITreeNode) {
        if(this.selectedNode !== node) {
            this.selectedNode = node;
            this.onSelectedChanged.emit(node);
        }
    }

    onExpand(node: ITreeNode) {

        node.isExpanded = !node.isExpanded;

        if (node.isExpanded && (!node.children || node.children.length === 0)) {
            this.onRequestNodes.emit(node);
        }
    }

    onRequestLocal(node: ITreeNode) {
        this.onRequestNodes.emit(node);
    }
}

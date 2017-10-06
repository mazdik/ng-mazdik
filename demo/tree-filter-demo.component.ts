import {Component, ViewChild} from '@angular/core';
import {ITreeNode, Column, Settings, Filter, ICrudService} from '../index';
import {DemoService} from '../services/demo.service';

@Component({
  selector: 'tree-filter-demo',
  template: `
    <tree-view style="float: left; overflow: auto;"
               [ngStyle]="{'width.px': treeViewWidth, 'height.px': scrollHeight}"
               *ngIf="treeNodes"
               [nodes]="treeNodes"
               [selectedNode]="selectedNode"
               (onSelectedChanged)="onSelectNode($event)">
    </tree-view>
    <crud-table
      #table
      [columns]="columns"
      [settings]="settings"
      [filters]="filters"
      [service]="service"
      (filterChanged)="onFilterChanged($event)">
    </crud-table>`
})
export class TreeFilterDemoComponent {

  selectedNode: ITreeNode;
  filters: Filter = {};
  @ViewChild('table') table: any;
  treeViewWidth: number = 150;

  public service: ICrudService;

  constructor() {
    this.service = new DemoService();
  }

  public columns: Column[] = [
    {
      title: 'Id',
      name: 'id',
      sortable: true,
      filter: true,
      frozen: true
    },
    {
      title: 'Name',
      name: 'name',
      sortable: true,
      filter: true,
      frozen: true,
      width: 250,
      validation: {pattern: '^[a-zA-Z ]+$'},
      editable: true,
    },
    {
      title: 'Race',
      name: 'race',
      sortable: true,
      filter: true,
      type: 'dropdown',
      options: [
        {id: 'ASMODIANS', name: 'ASMODIANS'},
        {id: 'ELYOS', name: 'ELYOS'},
      ],
      editable: true,
    },
    {
      title: 'Gender',
      name: 'gender',
      sortable: true,
      filter: true,
      type: 'radio',
      options: [
        {id: 'MALE', name: 'MALE'},
        {id: 'FEMALE', name: 'FEMALE'},
      ],
      editable: true,
    },
    {
      title: 'Exp',
      name: 'exp',
      sortable: true,
      filter: true,
      type: 'number',
      validation: {required: true, minLength: 2, maxLength: 10},
      editable: true,
    },
    {
      title: 'Last online',
      name: 'last_online',
      sortable: true,
      filter: true,
      type: 'date',
      editable: true,
    }
  ];

  public settings: Settings = {
    api: 'http://host3/players',
    crud: true,
    primaryKey: 'id',
    type: 'demo', // ords or yii (default)
    tableWidth: 820,
    scrollHeight: 380
  };

  public treeNodes: ITreeNode[] = [
    {
      id: 'ASMODIANS',
      name: 'ASMODIANS',
      data: {column: 'race'},
      children: [
        {
          id: 'MALE',
          name: 'MALE',
          data: {column: 'gender'},
        },
        {
          id: 'FEMALE',
          name: 'FEMALE',
          data: {column: 'gender'},
        }],
    },
    {
      id: 'ELYOS',
      name: 'ELYOS',
      data: {column: 'race'},
      children: [
        {
          id: 'MALE',
          name: 'MALE',
          data: {column: 'gender'},
        },
        {
          id: 'FEMALE',
          name: 'FEMALE',
          data: {column: 'gender'},
        }],
    }
  ];

  selectNode(node: ITreeNode) {
    if (node) {
      if (node.id) {
        this.filters[node.data['column']] = {value: node.id, matchMode: null};
      } else if (this.filters[node.data['column']]) {
        delete this.filters[node.data['column']];
      }

      if (node.parent) {
        this.selectNode(node.parent);
      }
    }
  }

  onSelectNode(node: ITreeNode) {
    this.selectedNode = node;
    this.selectNode(node);
    if (node.children) {
      for (const childNode of node.children) {
        if (this.filters[childNode.data['column']]) {
          delete this.filters[childNode.data['column']];
        }
      }
    }
    this.table.getItems();
  }

  setNode(field: string, value: string) {
    if (this.treeNodes) {
      for (const node of this.treeNodes) {
        if (node.data['column'] === field && node.id === value) {
          this.selectedNode = node;
        }
      }
    }
  }

  syncNode() {
    if (Object.keys(this.filters).length === 0) {
      this.selectedNode = null;
    } else {
      for (const key in this.filters) {
        if (this.filters[key]['value']) {
          this.setNode(key, this.filters[key]['value']);
        }
      }
    }
  }

  onFilterChanged(event) {
    this.filters = event;
    this.syncNode();
  }

}

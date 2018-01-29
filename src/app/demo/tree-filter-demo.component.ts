import {Component, ViewChild, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ITreeNode, ITreeService, Column, Settings, ICrudService, MenuItem} from '../../ng-crud-table';
import {DemoService} from './demo.service';
import {TreeDemoService} from './tree-demo.service';

@Component({
  selector: 'app-tree-filter-demo',
  template: `
    <div style="display: flex;">
      <app-tree-view
        #tree
        [ngStyle]="{'width.px': 210, 'height.px': settings.scrollHeight + 70}"
        [service]="treeService"
        [selectedNode]="selectedNode"
        (selectedChanged)="onSelectNode($event)"
        [serverSideFiltering]="true"
        [contextMenu]="contextMenu">
      </app-tree-view>
      <app-crud-table
        #table
        [columns]="columns"
        [settings]="settings"
        [service]="service"
        (filterChanged)="onFilterChanged($event)">
      </app-crud-table>
    </div>
    <app-context-menu #contextMenu [items]="items"></app-context-menu>
  `
})
export class TreeFilterDemoComponent implements OnInit {

  public columns: Column[] = [
    {
      title: 'Id',
      name: 'id',
      sortable: true,
      filter: true,
      frozen: true,
      formHidden: true,
    },
    {
      title: 'Name',
      name: 'name',
      sortable: true,
      filter: true,
      frozen: true,
      width: 250,
      validation: {required: true, pattern: '^[a-zA-Z ]+$'},
      editable: true,
    },
    {
      title: 'Race',
      name: 'race',
      sortable: true,
      filter: true,
      type: 'select',
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
      type: 'datetime-local',
      editable: true,
    }
  ];

  public settings: Settings = {
    api: 'assets/players.json',
    crud: true,
    primaryKeys: ['id'],
    tableWidth: 820,
    scrollHeight: 380
  };

  public service: ICrudService;
  public treeService: ITreeService;

  selectedNode: ITreeNode;
  items: MenuItem[];
  @ViewChild('table') dt: any;
  @ViewChild('tree') tree: any;

  constructor(private http: HttpClient) {
    this.service = new DemoService(this.http);
    this.treeService = new TreeDemoService(this.http);
  }

  ngOnInit() {
    this.items = [
      {label: 'View Task', command: (event) => console.log(this.selectedNode)},
      {label: 'Edit Task', command: (event) => console.log(event)},
      {label: 'Delete Task', command: (event) => console.log(event), disabled: true}
    ];
  }

  selectNode(node: ITreeNode) {
    if (node) {
      if (node.id) {
        this.dt.table.filters[node.data['column']] = {value: node.id, matchMode: null};
      } else if (this.dt.table.filters[node.data['column']]) {
        delete this.dt.table.filters[node.data['column']];
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
        if (this.dt.table.filters[childNode.data['column']]) {
          delete this.dt.table.filters[childNode.data['column']];
        }
      }
    }
    this.dt.getItems();
  }

  setNode(field: string, value: string) {
    if (this.tree.nodes) {
      for (const node of this.tree.nodes) {
        if (node.data['column'] === field && node.id === value) {
          this.selectedNode = node;
        }
      }
    }
  }

  syncNode() {
    if (Object.keys(this.dt.table.filters).length === 0) {
      if (this.selectedNode) {
        this.selectedNode = null;
      }
    } else {
      for (const key in this.dt.table.filters) {
        if (this.dt.table.filters[key]['value']) {
          this.setNode(key, this.dt.table.filters[key]['value']);
        }
      }
    }
  }

  onFilterChanged(event) {
    this.dt.table.filters = event;
    this.syncNode();
  }

}

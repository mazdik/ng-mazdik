import {Component, ViewChild, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ITreeNode, ITreeService, Column, Settings, Filter, ICrudService, MenuItem} from '../../ng-crud-table';
import {DemoService} from './demo.service';
import {TreeDemoService} from './tree-demo.service';

@Component({
  selector: 'tree-filter-demo',
  template: `
    <div style="display: flex;">
      <tree-view style="overflow: auto;"
                 [ngStyle]="{'width.px': 250, 'height.px': settings.scrollHeight + 70}"
                 [nodes]="treeNodes"
                 [service]="treeService"
                 [selectedNode]="selectedNode"
                 (selectedChanged)="onSelectNode($event)"
                 [serverSideFiltering]="true"
                 [contextMenu]="contextMenu">
      </tree-view>
      <crud-table
        #table
        [columns]="columns"
        [settings]="settings"
        [filters]="filters"
        [service]="service"
        (filterChanged)="onFilterChanged($event)">
      </crud-table>
    </div>
    <context-menu #contextMenu [items]="items"></context-menu>
  `
})
export class TreeFilterDemoComponent implements OnInit {

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
      type: 'date',
      editable: true,
    }
  ];

  public settings: Settings = {
    api: 'assets/players.json',
    crud: true,
    primaryKey: 'id',
    tableWidth: 820,
    scrollHeight: 380
  };

  public treeNodes: ITreeNode[] = [];
  public service: ICrudService;
  public treeService: ITreeService;

  selectedNode: ITreeNode;
  filters: Filter = {};
  items: MenuItem[];
  @ViewChild('table') table: any;

  constructor(private http: HttpClient) {
    this.service = new DemoService(this.http);
    this.treeService = new TreeDemoService(this.http);
  }

  ngOnInit() {
    if (this.treeService) {
      this.treeService.getNodes().then(data => {
        this.treeNodes = data;
      });
    }
    this.items = [
      {label: 'View Task', command: (event) => console.log(event)},
      {label: 'Edit Task', command: (event) => console.log(event)},
      {label: 'Delete Task', command: (event) => console.log(event)}
    ];
  }

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
      if (this.selectedNode) {
        this.selectedNode = null;
      }
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

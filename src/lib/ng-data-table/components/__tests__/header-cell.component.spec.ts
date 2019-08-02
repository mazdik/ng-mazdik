import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';

import { ColumnBase, Column, Settings, DataTable } from '../../base';
import { HeaderCellComponent } from '../header/header-cell.component';

@Component({
  template: `<dt-header-cell [table]="dataTable" [column]="column"></dt-header-cell>`
})
class TestFixtureComponent {
  dataTable: DataTable;
  settings = new Settings({});
  columns: ColumnBase[] = [
    { name: 'date', title: '', editable: true },
    { name: 'gender', title: '', frozen: true },
  ];
  column: Column;
  constructor() {
    this.dataTable = new DataTable(this.columns, this.settings);
    this.dataTable.rows = [
      { date: new Date(2017, 8, 5), gender: 'f' },
    ];
    this.column = this.dataTable.columns[0];
  }
}

describe('HeaderCellComponent', () => {
  let component: TestFixtureComponent;
  let fixture: ComponentFixture<TestFixtureComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        TestFixtureComponent,
        HeaderCellComponent,
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestFixtureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should be able to render header cell', () => {
    const element = fixture.nativeElement.querySelector('dt-header-cell');
    expect(element.classList).toContain('datatable-header-cell');
  });

});

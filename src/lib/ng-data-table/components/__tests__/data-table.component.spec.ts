import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';

import { DataTableModule, Column, Settings, DataTable } from '../../index';

@Component({
  template: `<app-data-table [table]="dataTable"></app-data-table>`
})
class TestFixtureComponent {
  dataTable: DataTable;
  settings = new Settings({});
  columns = [
    <Column>{ name: 'date', frozen: true },
    <Column>{ name: 'gender', frozen: true },
    <Column>{ name: 'test1', frozen: false },
    <Column>{ name: 'test2', frozen: false },
    <Column>{ name: 'test3', frozen: false },
  ];
  constructor() {
    this.dataTable = new DataTable(this.columns, this.settings);
    this.dataTable.rows = [
      { date: new Date(2017, 8, 5), gender: 'f' },
      { date: new Date(2016, 11, 1), gender: 'm' },
      { date: new Date(2019, 3, 7), gender: 'f' },
      { date: new Date(2018, 4, 3), gender: 'm' }
    ];
  }
}

describe('DataTableComponent', () => {
  let component: TestFixtureComponent;
  let fixture: ComponentFixture<TestFixtureComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TestFixtureComponent],
      imports: [DataTableModule],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestFixtureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    document.body.removeChild(fixture.debugElement.nativeElement);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});


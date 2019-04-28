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
    { name: 'date', frozen: true } as Column,
    { name: 'gender', frozen: true } as Column,
    { name: 'test1', frozen: false } as Column,
    { name: 'test2', frozen: false } as Column,
    { name: 'test3', frozen: false } as Column,
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

  it('should be able to render header', () => {
    const header = fixture.nativeElement.querySelector('dt-header');
    expect(header).toBeTruthy();
    expect(header.classList).toContain('datatable-header');

    const headerRow = header.querySelector('.datatable-header-row');
    expect(headerRow).toBeTruthy();

    const headerRowLeft = headerRow.querySelector('.datatable-row-left');
    expect(headerRowLeft).toBeTruthy();

    const headerRowCenter = headerRow.querySelector('.datatable-row-center');
    expect(headerRowCenter).toBeTruthy();
  });

  it('should be able to render header with the right number of cells', () => {
    let cells = fixture.nativeElement.querySelectorAll('.datatable-row-left dt-header-cell');
    expect(cells).toBeTruthy();
    expect(cells.length).toBe(2);

    cells = fixture.nativeElement.querySelectorAll('.datatable-row-center dt-header-cell');
    expect(cells).toBeTruthy();
    expect(cells.length).toBe(3);
  });

  it('should be able to render body', () => {
    const body = fixture.nativeElement.querySelector('dt-body');
    expect(body).toBeTruthy();
    expect(body.classList).toContain('datatable-body');
  });

  it('should be able to render body with the right number of rows', () => {
    const rows = fixture.nativeElement.querySelectorAll('dt-body-row');
    expect(rows).toBeTruthy();
    expect(rows.length).toBe(component.dataTable.rows.length);
  });

});


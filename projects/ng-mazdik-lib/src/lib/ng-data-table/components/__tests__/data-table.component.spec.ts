import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { ColumnBase } from '../../base';
import { Settings, DataTable } from '../../base';
import { DataTableModule } from '../../data-table-module';

@Component({
  template: `<app-data-table [table]="dataTable"></app-data-table>`
})
class TestFixtureComponent {
  dataTable: DataTable;
  settings = new Settings({});
  columns: ColumnBase[] = [
    { name: 'date', title: '', frozen: true },
    { name: 'gender', title: '', frozen: true },
    { name: 'test1', title: '', frozen: false },
    { name: 'test2', title: '', frozen: false },
    { name: 'test3', title: '', frozen: false },
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
  });

  it('should be able to render header with the right number of cells', () => {
    let cells = fixture.nativeElement.querySelectorAll('.datatable-header-row .dt-sticky:not(.action-cell)');
    expect(cells).toBeTruthy();
    expect(cells.length).toBe(2);

    cells = fixture.nativeElement.querySelectorAll('.datatable-header-row .dt-sticky');
    expect(cells).toBeTruthy();
    expect(cells.length).toBe(2);
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


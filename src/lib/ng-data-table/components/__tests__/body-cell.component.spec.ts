import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';

import { Column, Settings, DataTable, Row } from '../../index';
import { BodyCellComponent } from '../body/body-cell.component';

@Component({
  template: `<dt-body-cell [table]="dataTable" [row]="row" [column]="column"></dt-body-cell>`
})
class TestFixtureComponent {
  dataTable: DataTable;
  settings = new Settings({});
  columns = [
    <Column>{ name: 'date'},
  ];
  row: Row;
  column: Column;
  constructor() {
    this.dataTable = new DataTable(this.columns, this.settings);
    this.dataTable.rows = [
      { date: new Date(2017, 8, 5) },
    ];
    this.row = this.dataTable.rows[0];
    this.column = this.dataTable.columns[0];
    this.column.validatorFunc = (title, value) => (!value) ? [title + ' is not valid'] : [];
  }
}

describe('BodyCellComponent', () => {
  let component: TestFixtureComponent;
  let fixture: ComponentFixture<TestFixtureComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TestFixtureComponent, BodyCellComponent],
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

  it('should be able to render cell data', () => {
    const cell = fixture.nativeElement.querySelector('.cell-data');

    expect(cell).toBeTruthy();
    expect(cell.innerText === component.row[component.column.name].toString()).toBe(true);
  });

  it('should be able to detect changes via event rowsChanged', () => {
    component.row[component.column.name] = new Date(2019, 8, 5);
    component.dataTable.events.onRowsChanged();
    fixture.detectChanges();
    const cell = fixture.nativeElement.querySelector('.cell-data');

    expect(cell.innerText === component.row[component.column.name].toString()).toBe(true);
  });

  it('should contain error class after validate', () => {
    const cell = fixture.nativeElement.querySelector('dt-body-cell');
    expect(cell.classList).not.toContain('cell-error');

    component.row[component.column.name] = undefined;
    component.dataTable.events.onRowsChanged();
    fixture.detectChanges();
    expect(cell.classList).toContain('cell-error');
  });

});

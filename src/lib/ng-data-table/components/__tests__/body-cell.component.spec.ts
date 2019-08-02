import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';

import { ColumnBase, Settings, DataTable, Cell } from '../../base';
import { BodyCellComponent } from '../body/body-cell.component';

@Component({
  template: `<dt-body-cell [table]="dataTable" [cell]="cell"></dt-body-cell>`
})
class TestFixtureComponent {
  dataTable: DataTable;
  settings = new Settings({});
  columns: ColumnBase[] = [
    { name: 'date', title: '', editable: true },
  ];
  cell: Cell;
  constructor() {
    this.dataTable = new DataTable(this.columns, this.settings);
    this.dataTable.rows = [
      { date: new Date(2017, 8, 5) },
    ];
    const column = this.dataTable.columns[0];
    column.validatorFunc = (title, value) => (!value) ? [title + ' is not valid'] : [];
    this.cell = new Cell(this.dataTable.rows[0], column);
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
    expect(cell.innerText === component.cell.value.toString()).toBe(true);
  });

  it('should be able to detect changes via event rowsChanged', () => {
    component.cell.value = new Date(2019, 8, 5);
    component.dataTable.events.onRowsChanged();
    fixture.detectChanges();
    const cell = fixture.nativeElement.querySelector('.cell-data');

    expect(cell.innerText === component.cell.value.toString()).toBe(true);
  });

  it('should contain error class after validate', () => {
    const cell = fixture.nativeElement.querySelector('dt-body-cell');
    expect(cell.classList).not.toContain('cell-error');

    component.cell.value = undefined;
    component.dataTable.events.onRowsChanged();
    fixture.detectChanges();
    expect(cell.classList).toContain('cell-error');
  });

});

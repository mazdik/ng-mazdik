import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';

import { ColumnBase, Settings, DataTable, Row } from '../../base';
import { BodyRowComponent } from '../body/body-row.component';
import { BodyCellActionComponent } from '../body/body-cell-action.component';
import { BodyCellEditComponent } from '../body/body-cell-edit.component';
import { BodyCellComponent } from '../body/body-cell.component';
import { InlineEditModule } from '../../../inline-edit';

@Component({
  template: `<dt-body-row [table]="dataTable" [row]="row"></dt-body-row>`
})
class TestFixtureComponent {
  dataTable: DataTable;
  settings = new Settings({});
  columns = [
    { name: 'date', editable: true } as ColumnBase,
    { name: 'gender', frozen: true } as ColumnBase,
  ];
  row: Row;
  constructor() {
    this.dataTable = new DataTable(this.columns, this.settings);
    this.dataTable.rows = [
      { date: new Date(2017, 8, 5), gender: 'f' },
    ];
    this.row = this.dataTable.rows[0];
  }
}

describe('BodyRowComponent', () => {
  let component: TestFixtureComponent;
  let fixture: ComponentFixture<TestFixtureComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        TestFixtureComponent,
        BodyRowComponent,
        BodyCellActionComponent,
        BodyCellEditComponent,
        BodyCellComponent
      ],
      imports: [InlineEditModule]
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

  it('should be able to render row', () => {
    const element = fixture.nativeElement.querySelector('dt-body-row');
    expect(element.classList).toContain('datatable-body-row');
  });

});

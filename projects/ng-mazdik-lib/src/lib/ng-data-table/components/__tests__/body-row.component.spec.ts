import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';

import { ColumnBase, Settings, DataTable, Row } from '../../base';
import { BodyRowComponent } from '../body/body-row.component';
import { BodyCellEditComponent } from '../body/body-cell-edit.component';
import { BodyCellComponent } from '../body/body-cell.component';
import { InlineEditModule } from '../../../inline-edit/inline-edit-module';

@Component({
  template: `<dt-body-row [table]="dataTable" [row]="row"></dt-body-row>`
})
class TestFixtureComponent {
  dataTable: DataTable;
  settings = new Settings({});
  columns: ColumnBase[] = [
    { name: 'date', title: '', editable: true },
    { name: 'gender', title: '', frozen: true },
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

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';

import { ColumnBase, Settings, DataTable } from '../../base';
import { BodyComponent } from '../body/body.component';
import { BodyRowComponent } from '../body/body-row.component';
import { BodyCellEditComponent } from '../body/body-cell-edit.component';
import { BodyCellComponent } from '../body/body-cell.component';
import { InlineEditModule } from '../../../inline-edit/inline-edit-module';
import { ScrollerModule } from '../../../scroller/scroller-module';

@Component({
  template: `<dt-body [table]="dataTable"></dt-body>`
})
class TestFixtureComponent {
  dataTable: DataTable;
  settings = new Settings({});
  columns: ColumnBase[] = [
    { name: 'date', title: '', editable: true },
    { name: 'gender', title: '', frozen: true },
  ];
  constructor() {
    this.dataTable = new DataTable(this.columns, this.settings);
    this.dataTable.rows = [
      { date: new Date(2017, 8, 5), gender: 'f' },
    ];
  }
}

describe('BodyComponent', () => {
  let component: TestFixtureComponent;
  let fixture: ComponentFixture<TestFixtureComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        TestFixtureComponent,
        BodyComponent,
        BodyRowComponent,
        BodyCellEditComponent,
        BodyCellComponent
      ],
      imports: [
        InlineEditModule,
        ScrollerModule,
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

  it('should be able to render body', () => {
    const element = fixture.nativeElement.querySelector('dt-body');
    expect(element.classList).toContain('datatable-body');
  });

});

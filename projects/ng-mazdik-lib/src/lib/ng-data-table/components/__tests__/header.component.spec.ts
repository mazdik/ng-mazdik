import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';

import { ColumnBase, Settings, DataTable } from '../../base';
import { HeaderComponent } from '../header/header.component';
import { HeaderCellComponent } from '../header/header-cell.component';
import { ResizableModule } from '../../../resizable/resizable-module';

@Component({
  template: `<dt-header [table]="dataTable"></dt-header>`
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

describe('HeaderComponent', () => {
  let component: TestFixtureComponent;
  let fixture: ComponentFixture<TestFixtureComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        TestFixtureComponent,
        HeaderComponent,
        HeaderCellComponent,
      ],
      imports: [ResizableModule]
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

  it('should be able to render header', () => {
    const element = fixture.nativeElement.querySelector('dt-header');
    expect(element.classList).toContain('datatable-header');
  });

});

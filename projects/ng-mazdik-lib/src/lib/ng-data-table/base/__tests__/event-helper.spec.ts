import { async, TestBed, ComponentFixture } from '@angular/core/testing';
import { Component } from '@angular/core';
import { By } from '@angular/platform-browser';

import {EventHelper} from '../event-helper';

@Component({
  template: `
  <div class="datatable-body-row">
    <div class="datatable-body-cell" data-column-index="1" data-row-index="4">
      <div class="dt-inline-data" (click)="evt=$event"></div>
    </div>
  </div>
  `
})
class TestFixtureComponent {
  evt: any;
}

@Component({
  template: `
  <div class="datatable">
    <div class="datatable-header" style="height: 40px;">
      <div class="datatable-header-row">
        <div class="datatable-header-cell" style="width: 200px;">
          <div class="col-test1" (click)="evt=$event"></div>
        </div>
        <div class="datatable-header-cell" style="width: 200px;">
          <div class="col-test2" (click)="evt=$event"></div>
        </div>
      </div>
    </div>
    <div class="datatable-body">
      <div class="dt-scroller" style="height: 60px;">
        <div class="datatable-body-row" style="height: 30px;">
          <div class="datatable-body-cell" style="width: 200px;">
            <div class="test1" (click)="evt=$event"></div>
          </div>
          <div class="datatable-body-cell" style="width: 200px;">
            <div class="test2" (click)="evt=$event"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
  `,
  styleUrls: [
    '../../components/data-table/data-table.component.css',
  ],
})
class TestDtFixtureComponent {
  evt: any;
}

describe('EventHelper', () => {
  let component: TestFixtureComponent;
  let fixture: ComponentFixture<TestFixtureComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TestFixtureComponent],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestFixtureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be able to find cell event', () => {
    const debugElement = fixture.debugElement.query(By.css('.dt-inline-data'));
    debugElement.nativeElement.click();

    const result = EventHelper.findCellEvent(component.evt, fixture.nativeElement);
    expect(result.columnIndex).toBe(1);
    expect(result.rowIndex).toBe(4);
  });

});

describe('EventHelper datatable', () => {
  let component: TestDtFixtureComponent;
  let fixture: ComponentFixture<TestDtFixtureComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TestDtFixtureComponent],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestDtFixtureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be able to get row position top', () => {
    const debugElement = fixture.debugElement.query(By.css('.test1'));
    debugElement.nativeElement.click();

    const {left, top} = EventHelper.getRowPosition(component.evt);
    expect(left).toBe(0);
    expect(top).toBe(70);
  });

  it('should be able to get row position left', () => {
    const debugElement = fixture.debugElement.query(By.css('.test2'));
    debugElement.nativeElement.click();

    const {left, top} = EventHelper.getRowPosition(component.evt);
    expect(left).toBe(200);
    expect(top).toBe(70);
  });

  it('should be able to get first column position', () => {
    const debugElement = fixture.debugElement.query(By.css('.col-test1'));
    debugElement.nativeElement.click();

    const {left, top} = EventHelper.getColumnPosition(component.evt, 100);
    expect(left).toBe(0);
    expect(top).toBe(40);
  });

  it('should be able to get second column position', () => {
    const debugElement = fixture.debugElement.query(By.css('.col-test2'));
    debugElement.nativeElement.click();

    const {left, top} = EventHelper.getColumnPosition(component.evt, 100);
    expect(left).toBe(200);
    expect(top).toBe(40);
  });

});

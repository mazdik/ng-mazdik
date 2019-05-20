import { async, TestBed, ComponentFixture } from '@angular/core/testing';
import { Component } from '@angular/core';
import { By } from '@angular/platform-browser';

import {EventHelper} from '../event-helper';

@Component({
  template: `
  <div class="datatable-row">
    <div class="datatable-body-cell" data-column-index="1" data-row-index="4">
      <div class="dt-inline-data" (click)="evt=$event"></div>
    </div>
  </div>
  `
})
class TestFixtureComponent {
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

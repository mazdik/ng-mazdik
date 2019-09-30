import { async, TestBed, ComponentFixture } from '@angular/core/testing';
import { Component, DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

import { KeyboardAction } from '../keyboard-action';
import { Events } from '../events';
import { DataSelection } from '../data-selection';
import { Keys } from '../../../common';

@Component({
  template: `
  <div class="datatable-row">
    <div class="datatable-body-cell" data-column-index="1" data-row-index="4">
      <div class="dt-inline-data" (keydown)="evt=$event"></div>
    </div>
  </div>
  `
})
class TestFixtureComponent {
  evt: any;
}

describe('KeyboardAction', () => {
  let component: TestFixtureComponent;
  let fixture: ComponentFixture<TestFixtureComponent>;
  let debugElement: DebugElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TestFixtureComponent],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestFixtureComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement.query(By.css('.dt-inline-data'));
    fixture.detectChanges();
  });

  const events = new Events();
  const dataSelection = new DataSelection<number>(false, events.selectionSource);
  const keyboardAction = new KeyboardAction(events, dataSelection);

  describe('action keys', () => {
    const spy = jasmine.createSpy('changed spy');
    events.cellSource$.subscribe(spy);

    it('should be able to handle event Keys.ENTER', () => {
      triggerKeydown(Keys.ENTER);
      testKey(spy, 0, 0);
    });

    it('should be able to handle event Keys.ESCAPE', () => {
      triggerKeydown(Keys.ESCAPE);
      testKey(spy, 0, 0);
    });

    it('should be able to handle event Keys.KEY_F2', () => {
      triggerKeydown(Keys.KEY_F2);
      testKey(spy, 0, 0);
    });

  });

  describe('navigation keys', () => {
    const spy = jasmine.createSpy('changed spy');
    events.cellSource$.subscribe(spy);

    it('should be able to handle event Keys.TAB', () => {
      triggerKeydown(Keys.TAB);
      testKey(spy, 1, 0);
    });

    it('should be able to handle event Keys.RIGHT', () => {
      triggerKeydown(Keys.RIGHT);
      testKey(spy, 1, 0);
    });

    it('should be able to handle event Keys.TAB + shiftKey', () => {
      triggerKeydown(Keys.TAB, true);
      testKey(spy, -1, 0);
    });

    it('should be able to handle event Keys.LEFT', () => {
      triggerKeydown(Keys.LEFT);
      testKey(spy, -1, 0);
    });

    it('should be able to handle event Keys.UP', () => {
      triggerKeydown(Keys.UP);
      testKey(spy, 0, -1);
    });

    it('should be able to handle event Keys.DOWN', () => {
      triggerKeydown(Keys.DOWN);
      testKey(spy, 0, 1);
    });

  });

  function testKey(spy, col: number, row: number) {
    keyboardAction.handleEvent(component.evt, fixture.nativeElement, 6, 6);
    const event = spy.calls.mostRecent().args[0];

    expect(spy).toHaveBeenCalled();
    expect(event.columnIndex).toBe(1 + col);
    expect(event.rowIndex).toBe(4 + row);
    expect(event.event).toBeDefined();
    expect(event.fromCell).toBeDefined();
  }

  function triggerKeydown(keyCode: number, shiftKey: boolean = false) {
    debugElement.triggerEventHandler('keydown', {
      target: debugElement.nativeElement,
      keyCode,
      shiftKey,
      preventDefault: () => null,
      stopPropagation: () => null,
    });
  }

});

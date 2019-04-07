import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, ElementRef, ChangeDetectorRef } from '@angular/core';

import { Dropdown } from '../dropdown';

@Component({
  template: `<div style="width: 100px; height: 100px;"></div>`
})
class TestFixtureComponent {
  dropdown: Dropdown;
  constructor(private element: ElementRef, cd: ChangeDetectorRef) {
    this.dropdown = new Dropdown(this.element.nativeElement, cd);
  }
}

describe('Dropdown', () => {
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

  it('should be able open dropdown', () => {
    component.dropdown.openDropdown();
    expect(component.dropdown.isOpen).toBe(true);
  });

  it('should be able close dropdown', () => {
    component.dropdown.isOpen = true;
    component.dropdown.closeDropdown();
    expect(component.dropdown.isOpen).toBe(false);
  });

  it('should be selectContainerClicked = true on click', () => {
    component.dropdown.isOpen = true;
    fixture.nativeElement.dispatchEvent(new MouseEvent('click'));

    expect(component.dropdown.selectContainerClicked).toBe(true);
  });

  it('should be dropdown closed on click window', () => {
    component.dropdown.isOpen = true;
    document.dispatchEvent(new MouseEvent('click'));

    expect(component.dropdown.isOpen).toBe(false);
    expect(component.dropdown.selectContainerClicked).toBe(false);
  });

  it('should be dropdown closed on keydown esc', () => {
    component.dropdown.isOpen = true;
    document.dispatchEvent(new KeyboardEvent('keydown', {'key': 'Escape'}));

    expect(component.dropdown.isOpen).toBe(false);
  });

  it('should be remove event listeners', () => {
    component.dropdown.removeEventListeners();
  });

});

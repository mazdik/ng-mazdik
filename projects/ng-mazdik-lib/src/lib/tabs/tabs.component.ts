import { Component, OnChanges, ChangeDetectionStrategy, Input, Output, EventEmitter, HostBinding } from '@angular/core';
import { SelectItem } from '../common';

@Component({
  selector: 'app-tabs',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
  <span *ngFor="let tab of tabs" (click)="onClickTab(tab)" [ngClass]="{'active': isActive(tab)}">
    {{tab.name}}
  </span>`,
})
export class TabsComponent implements OnChanges {

  @Input() tabs: SelectItem[];
  @Input() localStorageName: string;
  @Output() selectTab: EventEmitter<any> = new EventEmitter();

  @HostBinding('class.dt-tab') cssClass = true;
  private selected: any;

  constructor() { }

  ngOnChanges(): void {
    if (this.localStorageName) {
      this.selected = localStorage.getItem(this.localStorageName);
      if (this.selected) {
        this.selectTab.emit(this.selected);
      }
    }
    if (!this.selected && this.tabs && this.tabs.length) {
      this.selected = this.tabs[0].id;
      this.selectTab.emit(this.selected);
    }
  }

  onClickTab(event: SelectItem): void {
    this.selected = event.id;
    this.selectTab.emit(this.selected);
    if (this.localStorageName) {
      localStorage.setItem(this.localStorageName, this.selected);
    }
  }

  isActive(tab: SelectItem): boolean {
    return this.selected === tab.id;
  }

}

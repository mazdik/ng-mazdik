import {
  Component, Input, ViewChild, ViewContainerRef, OnInit, OnDestroy, Output, EventEmitter, ViewEncapsulation,
  ChangeDetectionStrategy
} from '@angular/core';
import {getOptionsFunction} from './types';
import {DynamicFormElement} from './dynamic-form-element';

@Component({
  selector: 'app-dynamic-form',
  templateUrl: 'dynamic-form.component.html',
  styleUrls: [
    '../styles/input.css',
    '../styles/checkbox.css',
    '../styles/radio.css',
    '../styles/spinners.css',
  ],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class DynamicFormComponent implements OnInit, OnDestroy {

  @Input() dynElements: DynamicFormElement[];
  @Input() item: any;
  @Input() isNewItem: boolean = true;
  @Input() getOptionsFunc: getOptionsFunction;
  @Input() selectPlaceholder: string;
  @Input() searchInputPlaceholder: string;

  @Output() valid: EventEmitter<boolean> = new EventEmitter();
  @Output() loaded: EventEmitter<any> = new EventEmitter();

  @ViewChild('cellTemplate', {read: ViewContainerRef}) cellTemplate: ViewContainerRef;
  private validElements: any = {};

  constructor() {
  }

  ngOnInit() {
  }

  ngOnDestroy(): void {
    if (this.cellTemplate) {
      this.cellTemplate.clear();
    }
  }

  elemEnabled(dynElement: DynamicFormElement): boolean {
    return (!dynElement.hidden);
  }

  onValid(event: any, dynElement: DynamicFormElement) {
    this.validElements[dynElement.name] = event;
    this.isValid();
  }

  isValid() {
    let result: boolean;
    for (const key of Object.keys(this.validElements)) {
      result = this.validElements[key];
      if (!result) {
        break;
      }
    }
    this.valid.emit(result);
  }

  onKeyElementChange(event) {
    this.item[event.keyElementName] = event.keyElementValue;
    this.item[event.elementName] = event.elementValue;
  }

  isDisabled(dynElement: DynamicFormElement) {
    return (!this.isNewItem && dynElement.disableOnEdit);
  }

  onSelectPopupNameChanged(value: any, dynElement: DynamicFormElement) {
    if (dynElement.keyElement) {
      this.item[dynElement.name] = value;
    }
  }

}

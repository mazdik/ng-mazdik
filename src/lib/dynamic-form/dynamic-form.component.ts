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
    '../styles/radio.css'
  ],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class DynamicFormComponent implements OnInit, OnDestroy {

  @Input() dynElements: DynamicFormElement[];
  @Input() item: any;
  @Input() isNewItem: boolean = true;
  @Input() getOptionsFunc: getOptionsFunction;

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
    if (dynElement.formHidden) {
      return false;
    }
    if (!this.isNewItem && dynElement.isPrimaryKey) {
      return false;
    }
    return true;
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
    this.item[event.dynElement] = event.value;
  }

  isDisabled(dynElement: DynamicFormElement) {
    if (dynElement.keyElement && !this.isNewItem) {
      const fkElement = this.dynElements.find(x => x.name === dynElement.keyElement);
      return (fkElement && fkElement.isPrimaryKey === true);
    }
    return false;
  }

  onSelectPopupNameChanged(value: any, dynElement: DynamicFormElement) {
    if (dynElement.keyElement) {
      this.item[dynElement.name] = value;
    }
  }

}

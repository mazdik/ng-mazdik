import {
  Component, Input, Output, EventEmitter, ChangeDetectionStrategy, HostBinding, HostListener
} from '@angular/core';

@Component({
  selector: 'app-sort-header, [sort-header]',
  template: `<ng-content></ng-content>
  <i class="icon" *ngIf="sortable" [ngClass]="direction"></i>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SortHeaderComponent {

  @Input() sortable: boolean = true;
  @Input() order: number = 0;

  @Output() sortChange: EventEmitter<any> = new EventEmitter();

  @HostBinding('class.dt-sort-header') cssClass = true;

  get direction() {
    return (this.order === -1) ? 'desc' : (this.order === 1) ? 'asc' : '';
  }

  constructor() {
  }

  @HostListener('click', ['$event'])
  onClick(event: MouseEvent): void {
    if (this.sortable) {
      this.sortChange.emit();
    }
  }

}

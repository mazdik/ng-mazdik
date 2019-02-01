import {Component, ChangeDetectorRef} from '@angular/core';
import {DragObjectEvent} from '../../lib/drag-drop/drag-object.directive';

@Component({
  selector: 'app-drag-drop-demo',
  template: `
    <div class="drag-drop">
      <div #box1 class="drag-box">
        <div class="drag-elem"
            *ngFor="let item of todo; index as i"
            appDragObject
            [dropTarget]="box2"
            [model]="item"
            (dropped)="onDropped1($event)"
            (reorder)="onReorder1($event, i)">
            {{item}}
        </div>
      </div>
      <div #box2 class="drag-box">
        <div class="drag-elem"
            *ngFor="let item of done; index as i"
            appDragObject
            [dropTarget]="box1"
            [model]="item"
            (dropped)="onDropped2($event)"
            (reorder)="onReorder2($event, i)">
            {{item}}
        </div>
      </div>
    </div>
  `
})

export class DragDropDemoComponent {

  todo = [
    'Defunct',
    'Extaze',
    'Winger',
    'Spartacus'
  ];

  done = [
    'Chester',
    'Rubble',
    'Oumen',
    'Pandorum',
    'Wolverine'
  ];

  constructor(private cd: ChangeDetectorRef) {}

  onDropped1(event: DragObjectEvent) {
    this.done = [...this.done, event.model];
    this.todo = this.todo.filter(x => x !== event.model);
    this.moveItemInArray(this.done, this.done.length - 1, event.position);
    this.cd.detectChanges();
  }

  onDropped2(event: DragObjectEvent) {
    this.todo = [...this.todo, event.model];
    this.done = this.done.filter(x => x !== event.model);
    this.moveItemInArray(this.todo, this.todo.length - 1, event.position);
    this.cd.detectChanges();
  }

  onReorder1(event: DragObjectEvent, index: number) {
    this.moveItemInArray(this.todo, index, event.position);
    this.cd.detectChanges();
  }

  onReorder2(event: DragObjectEvent, index: number) {
    this.moveItemInArray(this.done, index, event.position);
    this.cd.detectChanges();
  }

  moveItemInArray<T = any>(array: T[], fromIndex: number, toIndex: number): void {
    const from = this.clamp(fromIndex, array.length - 1);
    const to = this.clamp(toIndex, array.length - 1);

    if (from === to) {
      return;
    }

    const target = array[from];
    const delta = to < from ? -1 : 1;

    for (let i = from; i !== to; i += delta) {
      array[i] = array[i + delta];
    }

    array[to] = target;
  }

  clamp(value: number, max: number): number {
    return Math.max(0, Math.min(max, value));
  }

}

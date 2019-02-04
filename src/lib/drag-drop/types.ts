export interface DragElementEvent {
  event: DragEvent;
  model: any;
  index: number;
}

export interface DropElementEvent {
  model: any;
  previousIndex: number;
  currentIndex: number;
  type: 'move' | 'reorder';
}

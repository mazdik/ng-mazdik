export interface ResizableEvent {
  width: number;
  height: number;
  event?: MouseEvent | Touch;
  direction?: 'horizontal' | 'vertical';
}

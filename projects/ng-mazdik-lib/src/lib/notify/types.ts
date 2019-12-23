export interface Message {
  title: string;
  text: string;
  severity?: 'info' | 'success' | 'warning' | 'error' | 'notify';
  life?: number;
  sticky?: boolean;
}

export type PositionType = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'center';

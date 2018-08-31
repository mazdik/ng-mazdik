export interface MenuItem {
  label?: string;
  icon?: string;
  command?: (event?: any) => void;
  url?: string;
  routerLink?: any;
  disabled?: boolean;
}

export interface MenuEventArgs {
  left: number;
  top: number;
  data: any;
  rowHeight: number;
}

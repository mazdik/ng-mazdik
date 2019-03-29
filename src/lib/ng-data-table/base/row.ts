export class Row {

  $$uid: number;
  $$index: number;
  $$data: Object;
  $$height: number;
  $$editable: boolean;
  $$level: number;

  constructor(options: { [x: string]: Object }) {
    Object.assign(this, options);
  }

}

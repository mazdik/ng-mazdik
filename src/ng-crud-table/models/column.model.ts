import {Column} from './column';
import {getUid} from '../utils/id';


export class ColumnModel extends Column {

  public id: number;

  constructor(init: Partial<Column>) {
    super();
    Object.assign(this, init);
    this.id = getUid();
    this.setDefaults();
  }

  setDefaults() {
    if (!this.width) {
      this.width = (this.name.length * 10) + 50;
      if (this.width < 150) {
        this.width = 150;
      }
    }
    if (!this.type) {
      if (this.options) {
        this.type = 'select';
      } else {
        this.type = 'text';
      }
    }
  }


}

export class RowHeightCache {

  private cache: number[] = [];

  calcScrollLength(totalRecords: number) {
    return this.cache[totalRecords - 1];
  }

  initCache(rows: any[], rowHeightProp: string) {
    const size = rows.length;
    this.cache = new Array(size);
    for (let i = 0; i < size; ++i) {
      this.cache[i] = 0;
    }
    rows.forEach((row, i) => {
      for (let index = i; index < size; index++) {
        this.cache[index] += row[rowHeightProp];
      }
    });
  }

  calcRowIndex(offsetY: number): number {
    if (offsetY === 0) {
      return 0;
    }
    let pos = -1;
    const dataLength = this.cache.length;

    for (let i = dataLength; i >= 0; i--) {
      const nextPos = pos + i;
      if (nextPos < dataLength && offsetY >= this.cache[nextPos]) {
        offsetY -= this.cache[nextPos];
        pos = nextPos;
      }
    }
    return pos + 1;
  }

  getRowOffset(rowIndex: number) {
    if (rowIndex < 0) {
      return 0;
    }
    return this.cache[rowIndex];
  }

}

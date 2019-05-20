import { Column } from '../column';
import { Row } from '../row';
import { Cell } from '../cell';

describe('Cell', () => {

  const column = new Column({
    name: 'column1',
    title: 'column1',
    options: [
      { id: 'ASM1', name: 'ASM note 1', parentId: 'ASMODIANS' },
      { id: 'ASM2', name: 'ASM note 2', parentId: 'ASMODIANS' },
      { id: 'ASM3', name: 'ASM note 3', parentId: 'ASMODIANS' },
      { id: 'ASM4', name: 'ASM note 4', parentId: 'ASMODIANS' },
      { id: 'ELY1', name: 'ELY note 1', parentId: 'ELYOS' },
      { id: 'ELY2', name: 'ELY note 2', parentId: 'ELYOS' },
      { id: 'ELY3', name: 'ELY note 3', parentId: 'ELYOS' },
    ],
    dependsColumn: 'race',
    editable: true,
    validatorFunc: (title, value) => (!value) ? [title + ' is not valid'] : []
  });
  column.index = 0;
  const row = new Row({column1: 'ELY1', race: 'ELYOS', $$index: 3, $$uid: 3, $$data: {column1: 'ELY1'}});
  const cell = new Cell(row, column);

  it('should cell value', () => {
    expect(cell.value).toBe('ELY1');
  });

  it('should cell view value', () => {
    expect(cell.viewValue).toBe('ELY note 1');
  });

  it('should cell is changed', () => {
    cell.value = 'ELY2';
    expect(cell.isChanged).toBe(true);

    cell.value = 'ELY1';
    expect(cell.isChanged).toBe(false);
  });

  it('should cell is error', () => {
    cell.value = undefined;
    cell.validate();
    expect(cell.hasError).toBe(true);

    cell.value = 'ELY1';
    cell.validate();
    expect(cell.hasError).toBe(false);
  });

  it('should cell exist', () => {
    expect(cell.exist(3, 0)).toBe(true);
    expect(cell.exist(1, 1)).toBe(false);
  });

  it('should be able to get dependent option values', () => {
    const result = cell.getOptions();
    expect(result.length).toBe(3);
  });

});

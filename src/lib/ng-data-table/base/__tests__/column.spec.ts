import { Column } from '../column';
import { UpperCasePipe } from '@angular/common';

describe('Column', () => {

  let column: Column;
  const row = {column1: 'ELY1', race: 'ELYOS', quest: {status: 'COMPLETE'}};

  beforeEach(() => {
    column = new Column({
      name: 'column1',
      title: 'column1',
      frozen: true,
      width: 150,
      minWidth: 100,
      maxWidth: 300,
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
  });

  it('should be able to get options', () => {
    let result = column.getOptions();
    expect(result.length).toBe(7);

    result = column.getOptions('ELYOS');
    expect(result.length).toBe(3);
  });

  it('should be able to get option name', () => {
    let result = column.getOptionName('ASM1');
    expect(result).toBe('ASM note 1');

    result = column.getOptionName('ELY1');
    expect(result).toBe('ELY note 1');
  });

  it('should be able to get option name with depends value', () => {
    let result = column.getOptionName('ASM1', 'ASMODIANS');
    expect(result).toBe('ASM note 1');

    result = column.getOptionName('ELY1', 'ELYOS');
    expect(result).toBe('ELY note 1');

    result = column.getOptionName('ASM1', 'ELYOS');
    expect(result).toBeNull();

    result = column.getOptionName('ELY1', 'ASMODIANS');
    expect(result).toBeNull();
  });

  it('should be able to validate', () => {
    let result = column.validate(null);
    expect(result).toEqual(['column1 is not valid']);

    result = column.validate('ASM1');
    expect(result).toEqual([]);
  });

  it('should be able to set width (min-max control)', () => {
    column.setWidth(50);
    expect(column.width).toBe(100);

    column.setWidth(500);
    expect(column.width).toBe(300);
  });

  it('should be able to get value', () => {
    const result = column.getValue(row);
    expect(result).toBe('ELY1');
  });

  it('should be able to get deep value', () => {
    column.name = 'quest.status';
    const result = column.getValue(row);
    expect(result).toBe('COMPLETE');
    column.name = 'column1';
  });

  it('should be able to get value view', () => {
    const result = column.getValueView(row);
    expect(result).toBe('ELY note 1');
  });

  it('should be able to use pipe', () => {
    column.pipe = new UpperCasePipe();
    const result = column.getValueView(row);
    expect(result).toBe('ELY NOTE 1');
  });

  it('should be able to get filter values (options)', (done) => {
    column.getFilterValues().then(result => {
      expect(result.length).toBe(7);
      done();
    });
  });

  it('should be able to get filter values (array)', (done) => {
    column.filterValues = [{id: 1, name: 'test1'}];
    column.getFilterValues().then(result => {
      expect(result.length).toBe(1);
      done();
    });
  });

  it('should be able to get filter values (function)', (done) => {
    column.filterValues = () => Promise.resolve([
      {id: 1, name: 'test1'},
      {id: 2, name: 'test2'}
    ]);
    column.getFilterValues().then(result => {
      expect(result.length).toBe(2);
      done();
    });
  });

});

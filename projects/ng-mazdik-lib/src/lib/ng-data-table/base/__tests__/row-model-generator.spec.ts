import { RowModelGenerator } from '../row-model-generator';
import { Column } from '../column';
import { Settings } from '../settings';
import { Row } from '../row';

describe('RowModelGenerator', () => {

  const settings = new Settings({});
  const columns = [
    new Column({ name: 'date' }),
    new Column({ name: 'gender' }),
  ];
  let rowModelGenerator: RowModelGenerator;
  const rows = [
    { date: new Date(2017, 8, 5), gender: 'f' },
    { date: new Date(2016, 11, 1), gender: 'm' },
    { date: new Date(2019, 3, 7), gender: 'f' },
    { date: new Date(2018, 4, 3), gender: 'm' }
  ];

  beforeEach(() => {
    rowModelGenerator = new RowModelGenerator(settings, columns);
  });

  it('should be able to generate row', () => {
    const result = rowModelGenerator.generateRow(rows[0]);
    expect(result instanceof Row).toBe(true);
  });

  it('should be able to generate rows', () => {
    const result = rowModelGenerator.generateRows(rows);
    expect(result.length).toBe(4);
    expect(result[0] instanceof Row).toBe(true);
  });

  it('should be uid (start with 1)', () => {
    const result = rowModelGenerator.generateRows(rows);

    expect(result.length).toBe(4);
    expect(result[0] instanceof Row).toBe(true);
    expect(result[0].$$uid).toBe(1);
    expect(result[3].$$uid).toBe(4);
  });

  it('should be able to set row indexes (start with 0)', () => {
    const result = rowModelGenerator.generateRows(rows);
    result[0].$$index = 333;
    expect(result[0].$$index).toBe(333);

    rowModelGenerator.setRowIndexes(result);
    expect(result[0].$$index).toBe(0);
    expect(result[3].$$index).toBe(3);
  });

});

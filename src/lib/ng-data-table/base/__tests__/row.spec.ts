import { Row } from '../row';

describe('Row', () => {

  it('should create', () => {
    const data = { id: 10, name: 'Anastasia' };
    const row = new Row(data);
    expect(row['id']).toBe(data.id);
    expect(row['name']).toBe(data.name);
  });

  it('should be able to merge properties', () => {
    const row = new Row({ $$uid: 9999, $$height: 40 });
    expect(row.$$uid).toBe(9999);
    expect(row.$$height).toBe(40);
  });

});

import { DataSelection } from '../data-selection';
import { Subject } from 'rxjs';

describe('DataSelection', () => {

  describe('single selection', () => {
    let model: DataSelection<any>;
    const selectionSource: Subject<any> = new Subject();

    beforeEach(() => model = new DataSelection(false, selectionSource));

    it('should be able to select a single value', () => {
      model.select(1);

      expect(model.getSelection().length).toBe(1);
      expect(model.isSelected(1)).toBe(true);
    });

    it('should deselect the previously selected value', () => {
      model.select(1);
      model.select(2);

      expect(model.isSelected(1)).toBe(false);
      expect(model.isSelected(2)).toBe(true);
    });

    it('should be able to determine whether it is empty', () => {
      expect(model.isEmpty()).toBe(true);
      model.select(1);
      expect(model.isEmpty()).toBe(false);
    });

    it('should be able to toggle an option', () => {
      model.toggle(1);
      expect(model.isSelected(1)).toBe(true);

      model.toggle(1);
      expect(model.isSelected(1)).toBe(false);
    });
  });

  describe('multiple selection', () => {
    let model: DataSelection<any>;
    const selectionSource: Subject<any> = new Subject();

    beforeEach(() => model = new DataSelection(true, selectionSource));

    it('should be able to select multiple options', () => {
      const changedSpy = jasmine.createSpy('changed spy');

      selectionSource.subscribe(changedSpy);
      model.select(1);
      model.select(2);

      expect(model.getSelection().length).toBe(2);
      expect(model.isSelected(1)).toBe(true);
      expect(model.isSelected(2)).toBe(true);
      expect(changedSpy).toHaveBeenCalledTimes(2);
    });

    it('should be able to select multiple options at the same time', () => {
      const changedSpy = jasmine.createSpy('changed spy');

      selectionSource.subscribe(changedSpy);
      model.select(1, 2);

      expect(model.getSelection().length).toBe(2);
      expect(model.isSelected(1)).toBe(true);
      expect(model.isSelected(2)).toBe(true);
      expect(changedSpy).toHaveBeenCalledTimes(1);
    });

    it('should be able to clear the selected options', () => {
      model.select(1);
      model.select(2);
      expect(model.getSelection().length).toBe(2);

      model.clearSelection();
      expect(model.getSelection().length).toBe(0);
      expect(model.isEmpty()).toBe(true);
    });
  });

  describe('selection', () => {
    let model: DataSelection<any>;
    const selectionSource: Subject<any> = new Subject();
    let spy: jasmine.Spy;

    beforeEach(() => {
      model = new DataSelection(true, selectionSource);
      spy = jasmine.createSpy('SelectionModel change event');

      selectionSource.subscribe(spy);
    });

    it('should emit an event when a value is selected', () => {
      model.selectValue(1);

      expect(spy).toHaveBeenCalled();
    });

    it('should not emit multiple events for the same value', () => {
      model.selectValue(1);
      model.selectValue(1);

      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  describe('deselection', () => {
    let model: DataSelection<any>;
    const selectionSource: Subject<any> = new Subject();
    let spy: jasmine.Spy;

    beforeEach(() => {
      model = new DataSelection(true, selectionSource);
      model.select(1, 2);
      spy = jasmine.createSpy('SelectionModel change event');

      selectionSource.subscribe(spy);
    });

    it('should emit an event when a value is deselected', () => {
      model.deselect(1);

      expect(spy).toHaveBeenCalled();
      expect(model.getSelection()).toEqual([2]);
    });
  });

});

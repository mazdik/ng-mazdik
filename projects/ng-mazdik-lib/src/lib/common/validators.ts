import {isBlank} from './utils';

export interface Validation {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: string | RegExp;
}

export class Validators {

  static get(validation: Validation): (name: string, value: any) => string[] {
    const result = (name: string, value: any) => Validators.validate(name, value, validation);
    return result;
  }

  static validate(name: string, value: any, validation: Validation): string[] {
    const temp: string[] = [];
    if (!validation) {
      return temp;
    }
    const length: number = !isBlank(value) ? value.toString().length : 0;

    if (validation.required && isBlank(value)) {
      temp.push(`${name} is required.`);
    }
    if (validation.minLength && length < validation.minLength) {
      temp.push(`${name} has to be at least ${validation.minLength} characters long. ActualLength: ${length}`);
    }
    if (validation.maxLength && length > validation.maxLength) {
      temp.push(`${name} can't be longer then ${validation.maxLength} characters. ActualLength: ${length}`);
    }
    if (validation.pattern && value) {
      const patternResult = Validators.patternValidate(name, value, validation.pattern);
      if (patternResult) {
        temp.push(patternResult);
      }
    }
    return temp;
  }

  static patternValidate(name: string, value: any, pattern: string | RegExp): string {
    let regex: RegExp;
    let regexStr: string;
    if (typeof pattern === 'string') {
      regexStr = pattern;
      regex = new RegExp(regexStr);
    } else {
      regexStr = pattern.toString();
      regex = pattern;
    }
    return regex.test(value) ? null : `${name} must match this pattern: ${regexStr}.`;
  }

}

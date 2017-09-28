import {
  Input,
  Output,
  Component,
  ElementRef,
  ViewEncapsulation,
  ChangeDetectorRef,
  EventEmitter,
  ViewChild
} from '@angular/core';
import {NguiDatetime} from './datetime';

declare var moment: any;

//@TODO
// . display currently selected day

/**
 * show a selected date in monthly calendar
 */
@Component({
  providers: [NguiDatetime],
  selector: 'ngui-datetime-picker',
  templateUrl: 'datetime-picker.component.html',
  styleUrls: ['datetime-picker.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class NguiDatetimePickerComponent {
  @Input('date-format') dateFormat: string;
  @Input('date-only') dateOnly: boolean;
  @Input('time-only') timeOnly: boolean;
  @Input('selected-date') selectedDate: Date;
  @Input('hour') hour: number;
  @Input('minute') minute: number;
  @Input('minuteStep') minuteStep: number = 1;
  @Input('default-value') defaultValue: Date;
  @Input('min-date') minDate: Date;
  @Input('max-date') maxDate: Date;
  @Input('min-hour') minHour: number;
  @Input('max-hour') maxHour: number;
  @Input('disabled-dates') disabledDates: Date[];
  @Input('show-close-button') showCloseButton: boolean;
  @Input('show-close-layer') showCloseLayer: boolean;
  @Input('show-week-numbers') showWeekNumbers: boolean = false;
  @Input('show-today-shortcut') showTodayShortcut: boolean = false;
  @Input('show-am-pm') showAmPm: boolean = false;

  @Output('selected$') selected$: EventEmitter<any> = new EventEmitter();
  @Output('closing$') closing$: EventEmitter<any> = new EventEmitter();

  @ViewChild('hours') hours: ElementRef;
  @ViewChild('minutes') minutes: ElementRef;

  public el: HTMLElement; // this component element
  public disabledDatesInTime: number[];
  public locale = NguiDatetime.locale;
  public showYearSelector = false;

  private _monthData: any;
  private timeSuffix: string;

  public constructor(elementRef: ElementRef,
                     public nguiDatetime: NguiDatetime,
                     public cdRef: ChangeDetectorRef) {
    this.el = elementRef.nativeElement;
  }

  public get yearsSelectable(): number[] {
    let startYear = this.year - 100;
    let endYear = this.year + 50;
    let years: number[] = [];
    for (let year = startYear; year < endYear; year++) {
      years.push(year);
    }
    return years;
  }

  public get year(): number {
    return this.selectedDate.getFullYear();
  }

  public get month(): number {
    return this.selectedDate.getMonth();
  }

  public get day(): number {
    return this.selectedDate.getDate();
  }

  public get monthData(): any {
    return this._monthData;
  }

  public get today(): Date {
    let dt = new Date();
    dt.setHours(0);
    dt.setMinutes(0);
    dt.setSeconds(0);
    dt.setMilliseconds(0);
    return dt;
  }

  public set year(year) {
  }

  public set month(month) {
  }

  public set day(day) {
  }

  public set today(today) {
  }

  public ngOnInit() {
    if (!this.defaultValue || isNaN(this.defaultValue.getTime())) {
      this.defaultValue = new Date();
    }
    this.selectedDate = this.defaultValue;

    // set hour and minute using moment if available to avoid having Javascript change timezones
    if (typeof moment === 'undefined') {
      this.hour = this.selectedDate.getHours();
      this.minute = this.selectedDate.getMinutes();
    } else {
      let m = moment(this.selectedDate);
      this.hour = m.hours();
      this.minute = m.minute();
    }

    this._monthData = this.nguiDatetime.getMonthData(this.year, this.month);
  }

  public isWeekend(dayNum: number, month?: number): boolean {
    if (typeof month === 'undefined') {
      return NguiDatetime.weekends.indexOf(dayNum % 7) !== -1; //weekday index
    } else {
      let weekday = this.toDate(dayNum, month).getDay();
      return NguiDatetime.weekends.indexOf(weekday) !== -1;
    }
  }

  public selectYear(year) {
    this._monthData = this.nguiDatetime.getMonthData(year, this._monthData.month);
    this.showYearSelector = false;
  }

  public toDate(day: number, month?: number): Date {
    return new Date(this._monthData.year, month || this._monthData.month, day);
  }

  public toDateOnly(date: Date) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0);
  }

  public selectCurrentTime() {
    this.hour = (new Date()).getHours();
    this.minute = (new Date()).getMinutes();
    this.selectDateTime();
  }

  /**
   * set the hour and minute
   * @param hour {string}
   * @param minute {string}
   */
  public selectTime(hour, minute) {
    //NOTE: must get hour & minute because 2-way binding does not work with range input in IE <= 11
    this.hour = parseInt(hour, 10) || 0;
    this.minute = parseInt(minute, 10) || 0;
    this.selectDateTime();
  }

  /**
   * set the selected date and close it when closeOnSelect is true
   * @param date {Date}
   */
  public selectDateTime(date?: Date) {
    this.selectedDate = date || this.selectedDate;
    if (this.isDateDisabled(this.selectedDate)) {
      return false;
    }

    // editing hours and minutes via javascript date methods causes date to lose timezone info,
    // so edit using moment if available
    let hour = parseInt('' + this.hour || '0', 10);
    let minute = parseInt('' + this.minute || '0', 10);

    if (typeof moment !== 'undefined') {
      // here selected date has a time of 00:00 in local time,
      // so build moment by getting year/month/day separately
      // to avoid it saving as a day earlier
      let m = moment([this.selectedDate.getFullYear(), this.selectedDate.getMonth(), this.selectedDate.getDate()]);
      m.hours(hour);
      m.minutes(minute);
      this.selectedDate = m.toDate();
    } else {
      this.selectedDate.setHours(hour);
      this.selectedDate.setMinutes(minute);
    }
    //console.log('this.selectedDate', this.selectedDate)

    this.selectedDate.toString = () => {
      return NguiDatetime.formatDate(this.selectedDate, this.dateFormat, this.dateOnly);
    };
    this.selected$.emit(this.selectedDate);
  };

  /**
   * show prev/next month calendar
   */
  public updateMonthData(num: number) {
    this._monthData = this.nguiDatetime.getMonthData(this._monthData.year, this._monthData.month + num);
  }

  public isDateDisabled(date: Date) {
    let dateInTime = date.getTime();
    this.disabledDatesInTime =
      this.disabledDatesInTime || (this.disabledDates || []).map(d => d.getTime());

    if (this.minDate && (dateInTime < this.minDate.getTime())) {
      return true;
    } else if (this.maxDate && (dateInTime > this.maxDate.getTime())) {
      return true;
    } else if (this.disabledDatesInTime.indexOf(dateInTime) >= 0) {
      return true
    }

    return false;
  }

  public close() {
    this.closing$.emit(true);
  }

  public selectToday() {
    this.selectDateTime(new Date());
  }

  private convertHours(hours) {
    if (this.showAmPm) {
      this.timeSuffix = (hours >= 12) ? 'PM' : 'AM';
      hours = (hours == 0) ? 12 : (hours > 12) ? hours - 12 : hours;
    } else {
      this.timeSuffix = null;
    }
    return ("0" + hours).slice(-2);
  }
}

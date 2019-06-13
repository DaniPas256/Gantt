import { Directive, AfterContentInit, ElementRef, Input, OnChanges, SimpleChanges } from '@angular/core';
import * as Pikaday from 'pikaday'

@Directive({
  selector: '[ganttDatepicker]'
})
export class DatepickerDirective implements OnChanges {
  @Input('minDate') minDate = null;
  private picker;
  private id = 'datepicker_' + Math.floor(Math.random() * 100000000);

  constructor(private el: ElementRef) { }

  /**
   * Init pikadata datepicker
   *
   * @memberof DatepickerDirective
   */
  ngAfterContentInit() {
    this.el.nativeElement.id = this.el.nativeElement.id ? this.el.nativeElement.id : this.id;
    this.el.nativeElement.readOnly = true;

    setTimeout(() => {
      const element = document.getElementById(this.el.nativeElement.id);
      if (this.minDate) {
        this.picker = new Pikaday({
          field: element, minDate: new Date(this.minDate), onSelect: () => {
            this.el.nativeElement.dispatchEvent(new Event('input'))
          }
        });
      } else {
        this.picker = new Pikaday({
          field: element, onSelect: () => {
            this.el.nativeElement.dispatchEvent(new Event('input'))
          }
        });
      }
    }, 0)
  }

  /**
   * If there is a min date param passed will valid date
   *
   * @param {SimpleChanges} changes
   * @memberof DatepickerDirective
   */
  ngOnChanges(changes: SimpleChanges) {
    const min = this.minDate;
    const current = this.el.nativeElement.value

    if (min != "" && current != "") {
      const d1p = new Date(min);
      const d2c = new Date(current);

      if (d1p.getTime() > d2c.getTime()) {
        this.el.nativeElement.value = min;
      }
    }

    if (this.picker) {
      if (this.minDate) {
        this.picker.setMinDate(new Date(this.minDate));
      }
    }
  }
}

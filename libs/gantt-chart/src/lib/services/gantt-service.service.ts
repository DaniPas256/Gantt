import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GanttService {
  private chart_start_date = '2019-05-01';
  private chart_end_date = '2019-05-31';
  private day_size = 40;

  public get get_day_size() {
    return this.day_size < 1 ? 1 : this.day_size;
  }
  public get chart_dates() {
    return { start: this.chart_start_date, end: this.chart_end_date };
  }

  constructor() { }

}

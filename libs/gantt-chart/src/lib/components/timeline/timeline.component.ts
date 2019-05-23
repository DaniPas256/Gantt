import { Component, OnInit } from '@angular/core';
import { Helpers } from './../../classes/helpers';
import { GanttService } from './../../services/gantt-service.service';

@Component({
  selector: 'gantt-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss']
})
export class TimelineComponent implements OnInit {
  constructor(public ganttService: GanttService) { }

  public scales = null;
  public number_of_displayed_scales = 0;
  public keys = Object.keys;

  public get config() {
    return this.ganttService.config.timeline;
  }

  ngOnInit() {
    this.scales = Helpers.generateDates(this.ganttService.chart_dates.start, this.ganttService.chart_dates.end);
    this.config.number_of_displayed_scales = Object.keys(this.scales).filter(name => this.isScaleVisible(name)).length - 1;
    this.config.number_of_days = this.scales.totalNoD;
  }

  isScaleVisible(name) {
    return true;
  }

  reDrawScale() {
    this.ngOnInit();
  }
}
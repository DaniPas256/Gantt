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
  public keys = Object.keys;

  ngOnInit() {
    this.scales = Helpers.generateDates(this.ganttService.chart_dates.start, this.ganttService.chart_dates.end)
  }

  isScaleVisible(name) {
    return true;
  }
}
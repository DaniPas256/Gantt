import { Component, OnInit } from '@angular/core';
import { Helpers } from './classes/helpers';
import { GanttService } from './services/gantt-service.service';

@Component({
  selector: 'gantt-entry',
  templateUrl: './entry.component.html'
})

export class EntryComponent implements OnInit {
  constructor(public ganttService: GanttService) { }

  public get task_list_width() {
    return this.ganttService.config.task_list.width();
  }

  ngOnInit() {
    console.log();
  }
}

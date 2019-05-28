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

  public get edit_task_data() {
    return this.ganttService.edit_task;
  }

  public get show_modal() {
    return this.ganttService.show_modal;
  }

  ngOnInit() {
    console.log();
  }
}

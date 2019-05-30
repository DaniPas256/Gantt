import { Component, OnInit } from '@angular/core';
import { Helpers } from './classes/helpers';
import { GanttService } from './services/gantt-service.service';
import { generateTask } from './interfaces/ITask';

@Component({
  selector: 'gantt-entry',
  templateUrl: './entry.component.html',
  styleUrls: ['./entry.component.scss']
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

  public get timeline_config() {
    return this.ganttService.config.timeline;
  }

  public get task_list_config() {
    return this.ganttService.config.task_list;
  }

  public get day_size() {
    return this.ganttService.get_day_size;
  }

  public get visible_tasks() {
    return this.ganttService.calc_visible_tasks();
  }

  ngOnInit() {
    for (let i = 0; i < 10; i++) {
      this.ganttService.tasks.push(generateTask(i));
    }
  }
} 

import { Component, OnInit } from '@angular/core';
import { GanttService } from './../../services/gantt-service.service';

@Component({
  selector: 'gantt-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss']
})
export class TaskListComponent implements OnInit {

  constructor(public ganttService: GanttService) { }

  public get tasks() {
    return this.ganttService.tasks;
  }

  public get config() {
    return this.ganttService.config.task_list;
  }

  public get timeline_config() {
    return this.ganttService.config.timeline;
  }

  ngOnInit() {
    console.log(this.config);
  }

}

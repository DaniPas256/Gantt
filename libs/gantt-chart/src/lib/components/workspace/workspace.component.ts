import { Component, OnInit } from '@angular/core';
import { GanttService } from './../../services/gantt-service.service';
import { ITask } from '../../interfaces/ITask';

@Component({
  selector: 'gantt-workspace',
  templateUrl: './workspace.component.html',
  styleUrls: ['./workspace.component.scss']
})
export class WorkspaceComponent implements OnInit {

  constructor(public ganttService: GanttService) { }

  ngOnInit() {
    this.ganttService.calc_tasks_details();
  }

  public get tasks() {
    return this.ganttService.tasks;
  }

  public get config() {
    return this.ganttService.config.workspace;
  }

  public get day() {
    return this.ganttService.get_day_size;
  }

  public get task_list_config() {
    return this.ganttService.config.task_list;
  }

  public get timeline_config() {
    return this.ganttService.config.timeline;
  }

  public taskPosition(task: ITask) {
    return `translate( ${task.props.left * this.day}px, ${this.config.task_padding_top}px )`;
  }
}

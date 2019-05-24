import { Component, OnInit } from '@angular/core';
import { GanttService } from './../../services/gantt-service.service';
import { ITask } from '../../interfaces/ITask';
import * as moment from 'moment';

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

  public taskPosition(task: ITask, additional__offset = 0) {
    const drag_offset = task.props.drag;
    const left_offset = task.props.left * this.day;
    const task_offset = drag_offset + left_offset < 0 ? 0 : drag_offset + left_offset;

    return `translate( ${task_offset + additional__offset}px, ${this.config.task_padding_top}px )`;
  }

  public endTaskDrag(payload: { drag: number, task_id: number }) {
    let task = this.tasks.find(item => item.id == payload.task_id);

    const days = Math.floor(payload.drag / task.props.day_size);
    task.start_date = moment(task.start_date).add(days, 'days').format('YYYY-MM-DD');
    task.end_date = moment(task.end_date).add(days, 'days').format('YYYY-MM-DD');
    task.props = this.ganttService.task_details(task);
  }

  public endTaskResize(payload: { resize: number, task_id: number }, resize_edge) {
    let task = this.tasks.find(item => item.id == payload.task_id);
    const days = Math.floor(payload.resize / task.props.day_size);

    if (resize_edge == 'left') {
      task.start_date = moment(task.start_date).add(days, 'days').format('YYYY-MM-DD');
    } else {
      task.end_date = moment(task.end_date).add(days, 'days').format('YYYY-MM-DD');
    }

    task.props = this.ganttService.task_details(task);
  }
}

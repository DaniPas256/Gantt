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

  public taskPosition(task: ITask) {
    const drag_offset = Math.floor(task.props.drag / this.day) * this.day;
    const resize_offset = Math.floor(task.props.resize_left / this.day) * this.day;

    const left_offset = task.props.left * this.day;
    const task_offset = drag_offset + left_offset < 0 ? 0 : drag_offset + left_offset;

    return `translate( ${task_offset + resize_offset}px, ${this.config.task_padding_top}px )`;
  }

  public taskWidth(task: ITask) {
    const resize_left_offset = Math.floor(task.props.resize_left / this.day) * this.day;
    const resize_right_offset = Math.floor(task.props.resize_right / this.day) * this.day;

    const sum = this.taskDuration(task) * this.day - resize_left_offset + resize_right_offset;
    const task_width = sum < this.day ? this.day : sum;
    return task_width;
  }

  public taskDuration(task: ITask) {
    return moment(task.end_date).diff(moment(task.start_date), 'day') + 1
  }

  public taskRightEdge(task) {
    const drag_offset = Math.floor(task.props.drag / this.day) * this.day;
    const left_offset = task.props.left * this.day;
    const task_offset = drag_offset + left_offset < 0 ? 0 : drag_offset + left_offset;
    const task_width = this.taskDuration(task) * this.day;
    const resize_right_offset = Math.floor(task.props.resize_right / this.day) * this.day;

    const sum = task_offset + task_width + resize_right_offset;
    const translate = sum < left_offset + this.day ? left_offset + this.day : sum;

    return `translate( ${translate}px, ${this.config.task_padding_top}px )`;
  }

  public endTaskDrag(payload: { drag: number, task_id: number }) {
    let task = this.tasks.find(item => item.id == payload.task_id);

    const days = Math.floor(payload.drag / this.day);
    task.start_date = moment(task.start_date).add(days, 'days').format('YYYY-MM-DD');
    task.end_date = moment(task.end_date).add(days, 'days').format('YYYY-MM-DD');

    this.ganttService.task_details(task);
  }

  public endTaskResize(payload: { resize: number, task_id: number, edge: string }) {
    let task = this.tasks.find(item => item.id == payload.task_id);

    if (payload.edge === 'left') {
      let days = Math.floor(task.props.resize_left / this.day);
      task.start_date = moment(task.start_date).add(days, 'days').format('YYYY-MM-DD');
    } else {
      let days = Math.floor(task.props.resize_right / this.day);
      task.end_date = moment(task.end_date).add(days, 'days').format('YYYY-MM-DD');
    }

    this.ganttService.task_details(task);
  }
}

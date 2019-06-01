import { Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { GanttService } from './../../services/gantt-service.service';
import { ITask, emptyTask } from '../../interfaces/ITask';

@Component({
  selector: 'gantt-task-list',
  templateUrl: './task-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./task-list.component.scss']
})
export class TaskListComponent implements OnInit {

  constructor(public ganttService: GanttService, public cd: ChangeDetectorRef) { }

  public get tasks() {
    return this.ganttService.tasks;
  }

  public get tasks_object() {
    return this.ganttService.tasks_object;
  }

  public get config() {
    return this.ganttService.config.task_list;
  }

  public get timeline_config() {
    return this.ganttService.config.timeline;
  }

  public isTaskVisible(task) {
    return this.ganttService.isTaskVisible(task);
  }

  ngOnInit() {
    this.ganttService.task_list_cd = this.cd;
  }

  addTask(task: ITask | null = null) {
    const task_e = emptyTask();
    if (task)
      task_e.parent = task.id;

    this.ganttService.showCreateTask(task_e);
  }

  editTask(task: ITask) {
    this.ganttService.showCreateTask(task);
  }

  deleteTask(task: ITask) {
    const confirm_answer = confirm(`Delete task ${task.name}?`);

    if (confirm_answer) {
      this.ganttService.findAllChildren(task).forEach(task_id => {
        const task_ix = this.tasks.findIndex(item => item.id === task_id);
        this.tasks.splice(task_ix, 1);
        delete this.tasks_object[task.id];
        this.ganttService.dcWorkspace();
      })
    }
  }

}

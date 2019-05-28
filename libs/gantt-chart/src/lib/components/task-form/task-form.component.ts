import { Component, OnInit, Input } from '@angular/core';
import { AfterViewInit } from '@angular/core';
import { ITask } from '../../interfaces/ITask';
import { emptyTask } from './../../interfaces/ITask';
import { GanttService } from './../../services/gantt-service.service';

@Component({
  selector: 'gantt-task-form',
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.scss']
})
export class TaskFormComponent implements OnInit, AfterViewInit {
  public viewInit = false;
  @Input() editData: ITask;

  constructor(public ganttService: GanttService) { }

  ngOnInit() {
    this.editData = { ...this.editData };
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.viewInit = true;
    }, 0);
  }

  closeModal() {
    this.viewInit = false;
    setTimeout(() => {
      this.ganttService.hideModal();
    }, 500);
  }

  onSubmit(form) {

  }
}

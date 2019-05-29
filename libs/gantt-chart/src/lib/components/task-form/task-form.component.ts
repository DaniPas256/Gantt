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
  public validation_error = false;

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

  closeModal(payload = null) {
    this.viewInit = false;
    setTimeout(() => {
      this.ganttService.hideModal(payload);
    }, 500);
  }

  onSubmit() {
    if (!this.editData.name.length || !this.editData.start_date.length || !this.editData.end_date.length) {
      this.validation_error = true;
      return false;
    }

    this.closeModal(this.editData);
  }
}

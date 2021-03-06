import { Component, OnInit, ChangeDetectorRef, AfterContentInit } from '@angular/core';
import { GanttService } from './../../services/gantt-service.service';
import { AfterViewInit } from '@angular/core';

@Component({
  selector: 'gantt-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit, AfterViewInit {

  constructor(public ganttService: GanttService, public cd: ChangeDetectorRef) { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.cd.detach();
  }

  public get timeline_config() {
    return this.ganttService.config.timeline;
  }

  public get task_list_config() {
    return this.ganttService.config.task_list;
  }


  lockTimeline() {
    this.timeline_config.options.lock_scale = !this.timeline_config.options.lock_scale;
    this.cd.detectChanges();
  }

  shrinkTimeline() {
    this.timeline_config.options.resize_oo = !this.timeline_config.options.resize_oo;
    this.cd.detectChanges();
  }

  fitTimeline() {
    this.ganttService.fitScaleSubject.next();
  }

  zoomOut() {
    this.ganttService.zoomScaleSubject.next('out');
  }

  zoomIn() {
    this.ganttService.zoomScaleSubject.next('in');
  }

  expand() {
    this.ganttService.excolScaleSubject.next('expand');
  }

  collapse() {
    this.ganttService.excolScaleSubject.next('collapse');
  }

  detectChanges() {
    setTimeout(() => {
      this.ganttService.dcTaskList();
    }, 0);
  }
}

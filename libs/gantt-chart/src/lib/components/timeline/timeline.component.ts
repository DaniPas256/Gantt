import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { Helpers } from './../../classes/helpers';
import { GanttService } from './../../services/gantt-service.service';
import { takeUntil } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { ITask } from './../../interfaces/ITask';

@Component({
  selector: 'gantt-timeline',
  templateUrl: './timeline.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./timeline.component.scss']
})
export class TimelineComponent implements OnInit, OnDestroy {
  constructor(public ganttService: GanttService, public cd: ChangeDetectorRef) { }

  public subjectSubscription: Subscription = new Subscription();
  public scales = null;
  public keys = Object.keys;

  public get day_size() {
    return this.ganttService.get_day_size;
  }

  public get config() {
    return this.ganttService.config.timeline;
  }

  public get workspace_config() {
    return this.ganttService.config.workspace;
  }

  public get tasks() {
    return this.ganttService.tasks;
  }

  /**
   * Set up initial dates and subscriptions for redrawing, fitting and zooming scale
   *
   * @memberof TimelineComponent
   */
  ngOnInit() {
    this.ganttService.chart_dates = this.ganttService.tasks.length ? Helpers.findDatesRange(this.ganttService.tasks, this.config.timeline_offset) : Helpers.startingDates();
    this.scales = Helpers.generateDates(this.ganttService.chart_dates.start, this.ganttService.chart_dates.end);

    this.config.number_of_displayed_scales = Object.keys(this.scales).filter(name => this.isScaleVisible(name)).length - 1;
    this.config.number_of_days = this.scales.totalNoD;

    this.ganttService.timeline_cd = this.cd;

    this.subjectSubscription.add(
      this.ganttService.reDrawScaleSubject.pipe(takeUntil(Helpers.componentDestroyed(this))).subscribe((payload) => {
        this.reDrawScale(payload);
        this.ganttService.calc_tasks_details();
        this.ganttService.dcTimeline();
        this.ganttService.dcTaskList();
        this.ganttService.dcWorkspace();
      })
    )

    this.subjectSubscription.add(
      this.ganttService.fitScaleSubject.pipe(takeUntil(Helpers.componentDestroyed(this))).subscribe((payload) => {
        this.fitToTasks();
        this.ganttService.calc_tasks_details();
        this.ganttService.dcTimeline();
        this.ganttService.dcTaskList();
        this.ganttService.dcWorkspace();
      })
    )

    this.subjectSubscription.add(
      this.ganttService.zoomScaleSubject.pipe(takeUntil(Helpers.componentDestroyed(this))).subscribe((action: string) => {
        const old_value = this.day_size;
        let new_value = 0;

        if (action === 'out') {
          new_value = old_value - old_value / 10
        }

        if (action === 'in') {
          new_value = old_value + old_value / 10;
        }

        new_value = Math.floor(new_value * 100) / 100;
        this.setZoom(new_value);
        this.ganttService.dcTimeline();
        this.ganttService.dcTaskList();
        this.ganttService.dcWorkspace();
      })
    )

    this.subjectSubscription.add(
      this.ganttService.excolScaleSubject.pipe(takeUntil(Helpers.componentDestroyed(this))).subscribe((action: string) => {
        this.setVisible(action == 'expand');
        this.ganttService.reDrawScaleSubject.next();
        this.ganttService.dcTaskList();
      })
    )
  }

  /**
   * Checks whether scale should be visible based of size of smallest scale
   *
   * @param {*} scale_name
   * @returns
   * @memberof TimelineComponent
   */
  isScaleVisible(scale_name) {
    switch (scale_name) {
      case 'years':
        return true;
      case 'quarter':
        return this.day_size > 1.3;
      case 'months':
        return this.day_size > 3.5;
      case 'weeks':
        return this.day_size > 13.5;
      case 'days':
        return !(this.day_size < 40);
    }
    return true;
  }

  /**
   * Redraw scale if needed, set up new date range
   *
   * @param {*} [payload=null]
   * @returns
   * @memberof TimelineComponent
   */
  reDrawScale(payload = null) {
    if (this.config.options.lock_scale) {
      return;
    }

    if (this.config.options.resize_oo) {
      if (Helpers.isOffsetIntouched(this.ganttService.chart_dates, this.onlyVisibleTasks(), this.config.timeline_offset)) {
        return false;
      }
    }

    this.ganttService.chart_dates = Helpers.findDatesRange(this.onlyVisibleTasks(), this.config.timeline_offset);
    this.scales = Helpers.generateDates(this.ganttService.chart_dates.start, this.ganttService.chart_dates.end);
    this.config.number_of_displayed_scales = Object.keys(this.scales).filter(name => this.isScaleVisible(name)).length - 1;
    this.config.number_of_days = this.scales.totalNoD;
  }

  /**
   * Calc day size, so the tasks could fit on screen without scroll
   *
   * @memberof TimelineComponent
   */
  fitToTasks() {
    const dates = Helpers.findDatesRange(this.onlyVisibleTasks(), this.config.timeline_offset);
    this.ganttService.chart_dates = dates;
    this.scales = Helpers.generateDates(this.ganttService.chart_dates.start, this.ganttService.chart_dates.end);

    const diff = Helpers.getDiffrence(dates.start, dates.end);
    const new_day_size = Math.floor((this.workspace_config.width / diff) * 100) / 100;
    this.ganttService.set_day_size = new_day_size;

    this.config.number_of_displayed_scales = Object.keys(this.scales).filter(name => this.isScaleVisible(name)).length - 1;
    this.config.number_of_days = this.scales.totalNoD;
  }

  /**
   * Sets new zoom value
   *
   * @param {*} new_value
   * @memberof TimelineComponent
   */
  setZoom(new_value) {
    this.ganttService.set_day_size = new_value;
    this.config.number_of_displayed_scales = Object.keys(this.scales).filter(name => this.isScaleVisible(name)).length - 1;
    this.config.number_of_days = this.scales.totalNoD;
  }

  onlyVisibleTasks() {
    const visible_tasks = [];

    this.ganttService.tasks.forEach((task: ITask) => {
      if (this.ganttService.isTaskVisible(task)) {
        visible_tasks.push(task);
      }
    });

    return visible_tasks;
  }

  /**
   * Sets all task expaned or collapsed
   *
   * @param boolean new_value
   * @memberof TimelineComponent
   */
  setVisible(new_value: boolean) {
    this.tasks.forEach((task: ITask) => {
      task.props.expanded = new_value;
    });
  }

  ngOnDestroy() {
    this.subjectSubscription.unsubscribe();
  }
}
import { Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { GanttService } from './../../services/gantt-service.service';
import { ITask } from '../../interfaces/ITask';
import * as moment from 'moment';
import { Memoize } from 'lodash-decorators'

@Component({
  selector: 'gantt-workspace',
  templateUrl: './workspace.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./workspace.component.scss']
})
export class WorkspaceComponent implements OnInit {
  constructor(public ganttService: GanttService, public cd: ChangeDetectorRef) { }

  ngOnInit() {
    this.ganttService.workspace_cd = this.cd;
    this.ganttService.calc_tasks_details();
  }

  public get tasks() {
    return this.ganttService.tasks;
  }

  public get tasks_object() {
    return this.ganttService.tasks_object;
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

  public isTaskVisible(task) {
    return this.ganttService.isTaskVisible(task);
  }

  public get visible_tasks() {
    return this.ganttService.calc_visible_tasks();
  }

  public keys = Object.keys;

  /**
   * Returns task position( left offset ) as CSS translate or number
   *
   * @param {ITask} task
   * @param {boolean} [asNumber=false]
   * @returns
   * @memberof WorkspaceComponent
   */
  public taskPosition(task: ITask, asNumber = false) {
    const drag_offset = Math.floor(task.props.drag / this.day) * this.day;
    const resize_offset = Math.floor(task.props.resize_left / this.day) * this.day;

    const left_offset = task.props.left * this.day;
    const task_offset = drag_offset + left_offset < 0 ? 0 : drag_offset + left_offset;

    if (asNumber) {
      return `${task_offset + resize_offset}`;
    }

    return `translate( ${task_offset + resize_offset}px, ${this.config.task_padding_top}px )`;
  }

  /**
   * Returns progress arrow offset as CSS translate
   *
   * @param {ITask} task
   * @returns
   * @memberof WorkspaceComponent
   */
  public progressPosition(task: ITask) {
    const drag_offset = Math.floor(task.props.drag / this.day) * this.day;
    const resize_offset = Math.floor(task.props.resize_left / this.day) * this.day;
    const left_offset = task.props.left * this.day;
    const task_offset = drag_offset + left_offset < 0 ? 0 : drag_offset + left_offset;

    const task_position = task_offset + resize_offset;
    const progress_position = ((this.progressValue(task) / 100) * this.taskWidth(task));

    return `translate( ${progress_position}px)`;
  }

  /**
   * Returns task width
   *
   * @param {ITask} task
   * @returns
   * @memberof WorkspaceComponent
   */
  public taskWidth(task: ITask) {
    const resize_left_offset = Math.floor(task.props.resize_left / this.day) * this.day;
    const resize_right_offset = Math.floor(task.props.resize_right / this.day) * this.day;
    const sum = this.taskDuration(task) * this.day - resize_left_offset + resize_right_offset;
    const task_width = sum < this.day ? this.day : sum;
    return task_width < 1 ? 1 : task_width;
  }

  /**
   * Checks if task describtion is fitting inside task bar
   *
   * @param {ITask} task
   * @returns
   * @memberof WorkspaceComponent
   */
  public taskTextVisible(task: ITask) {
    const getTextWidth = (text, font = '12px Lato') => {
      var canvas = document.createElement("canvas");
      var context = canvas.getContext("2d");
      context.font = font;
      var metrics = context.measureText(text);
      return metrics.width;
    }
    const task_text = `${task.name} / ${task.progress}%`;
    const task_width = this.taskWidth(task);

    return task_width > getTextWidth(task_text) + 10;
  }

  /**
   * Return progress value, including progress drag at that moment
   *
   * @param {ITask} task
   * @returns
   * @memberof WorkspaceComponent
   */
  public progressValue(task: ITask) {
    if (task.props.progress_drag) {
      const task_width = this.taskWidth(task);
      const progress_change = Math.floor(100 / (task_width / task.props.progress_drag))

      let new_progress = task.progress + progress_change;
      new_progress = new_progress < 0 ? 0 : new_progress > 100 ? 100 : new_progress;

      return new_progress;
    }

    return task.progress;
  }

  /**
   * Return duration of task in days
   *
   * @param {ITask} task
   * @returns
   * @memberof WorkspaceComponent
   */
  public taskDuration(task: ITask) {
    return moment(task.end_date).diff(moment(task.start_date), 'day') + 1
  }

  /**
   * Delete relation between tasks
   *
   * @param {ITask} task
   * @param {number} index
   * @memberof WorkspaceComponent
   */
  public deleteRelation(task: ITask, index: number) {
    const source_name = task.name;
    const target_name = this.tasks_object[task.relations[index].target_id].name;

    if (task.props.permissions.remove_link && this.tasks_object[task.relations[index].target_id].props.permissions.remove_link)
      if (confirm(`Delete relation between task ${source_name} and ${target_name}?`)) {
        task.relations.splice(index, 1);
        this.ganttService.dcWorkspace();
      }
  }

  /**
   * Returs left offset of task bar right edge
   *
   * @param {*} task
   * @returns
   * @memberof WorkspaceComponent
   */
  public taskRightEdge(task) {
    const drag_offset = Math.floor(task.props.drag / this.day) * this.day;
    const left_offset = task.props.left * this.day;
    const task_offset = drag_offset + left_offset < 0 ? 0 : drag_offset + left_offset;
    const task_width = this.taskDuration(task) * this.day;
    const resize_right_offset = Math.floor(task.props.resize_right / this.day) * this.day;

    const sum = task_offset + task_width + resize_right_offset;
    const translate = sum < left_offset + this.day ? left_offset + this.day : sum;

    return translate;
  }

  /**
   * Callback fired on mouse up after task drag
   *
   * @param {{ drag: number, task_id: number }} payload
   * @memberof WorkspaceComponent
   */
  public endTaskDrag(payload: { drag: number, task_id: number }) {
    const task = this.tasks.find(item => item.id == payload.task_id);

    const days = Math.floor(payload.drag / this.day);
    task.start_date = moment(task.start_date).add(days, 'days').format('YYYY-MM-DD');
    task.end_date = moment(task.end_date).add(days, 'days').format('YYYY-MM-DD');

    this.ganttService.task_details(task);
    this.ganttService.reDrawScaleSubject.next();
  }

  /**
   * Callback fired on mouse up after task resize
   *
   * @param {{ resize: number, task_id: number, edge: string }} payload
   * @memberof WorkspaceComponent
   */
  public endTaskResize(payload: { resize: number, task_id: number, edge: string }) {
    const task = this.tasks.find(item => item.id == payload.task_id);

    if (payload.edge === 'left') {
      let days = Math.floor(task.props.resize_left / this.day);
      task.start_date = moment(task.start_date).add(days, 'days').format('YYYY-MM-DD');
    } else {
      let days = Math.floor(task.props.resize_right / this.day);
      task.end_date = moment(task.end_date).add(days, 'days').format('YYYY-MM-DD');
    }

    this.ganttService.task_details(task);
    this.ganttService.reDrawScaleSubject.next();
  }

  /**
   * Callback fired on mouse up after progress drag
   *
   * @param {{ drag: number, task_id: number }} payload
   * @memberof WorkspaceComponent
   */
  public endProgressDrag(payload: { drag: number, task_id: number }) {
    const task = this.tasks.find(item => item.id == payload.task_id);
    const task_width = this.taskWidth(task);
    const progress_change = Math.floor(100 / (task_width / payload.drag))

    task.progress += progress_change;
    task.progress = task.progress < 0 ? 0 : task.progress > 100 ? 100 : task.progress;

    task.props.progress_drag = 0;
  }

  /**
   * Callback fired on mouse up after dragging between link dots
   *
   * @param {{ drag: number, task_id: number, edge: string, target: { id: number, edge: string } }} payload
   * @memberof WorkspaceComponent
   */
  public linkDragEnd(payload: { drag: number, task_id: number, edge: string, target: { id: number, edge: string } }) {
    const task: ITask = this.tasks_object[payload.task_id];
    if (task.props.isLinkDragged) {
      if (task.id != payload.target.id && payload.target.id) {
        this.createRelation(task.id, payload.target.id, `${payload.edge}_${payload.target.edge}`);
      }

      this.ganttService.task_details(task);
      this.ganttService.dcWorkspace();
    }
  }

  /**
   * Creates relation between tasks
   *
   * @param {number} source_id
   * @param {number} target_id
   * @param {string} type
   * @returns
   * @memberof WorkspaceComponent
   */
  public createRelation(source_id: number, target_id: number, type: string) {
    const source_task = this.tasks_object[source_id];

    if (
      source_task.relations.find(item => {
        return item.target_id == target_id && item.type == type
      })
    ) {
      return false;
    }

    source_task.relations.push({
      target_id,
      type
    });
  }

  /**
   * Generates the set of points, that are base of drawing relation line
   *
   * @param {number} source_id
   * @param {number} target_id
   * @param {string} type
   * @returns
   * @memberof WorkspaceComponent
   */
  public createRelationLine(source_id: number, target_id: number, type: string) {
    const source_task = this.tasks_object[source_id];
    const target_task = this.tasks_object[target_id];

    const type_ar = type.split('_');
    const [start_x, start_y] = this.getLinkDotPosition(this.generateUniq(), source_task, type_ar[0]);
    const [end_x, end_y] = this.getLinkDotPosition(this.generateUniq(), target_task, type_ar[1]);

    const lines = [];
    let last;
    lines.push({ x1: start_x, y1: start_y, x2: start_x + (type_ar[0] == 'left' ? -20 : 20), y2: start_y });
    last = lines[lines.length - 1];
    if ((type_ar[0] == 'left' ? start_x <= end_x : start_x >= end_x)) {
      lines.push({ x1: last.x2, y1: last.y2, x2: last.x2, y2: last.y2 + (start_y > end_y ? -1 * ((this.task_list_config.row_height / 2) - 1) : this.task_list_config.row_height / 2) - 1 });
      last = lines[lines.length - 1];
    }
    lines.push({ x1: last.x2, y1: last.y2, x2: end_x, y2: last.y2 });
    last = lines[lines.length - 1];
    lines.push({ x1: last.x2, y1: last.y2, x2: end_x, y2: end_y });

    return lines;
  }

  /**
   * Returns all set of points for given task where target/source task is visible
   *
   * @param {ITask} task
   * @returns
   * @memberof WorkspaceComponent
   */
  public getTaskLines(task: ITask) {
    const lines = {};
    task.relations.forEach((item, ix) => {
      if (this.isTaskVisible(this.tasks_object[Number(item.target_id)]))
        lines[ix] = (this.createRelationLine(task.id, Number(item.target_id), item.type));
    });

    return lines;
  }

  /**
   * Converts set of points to svg polyline "poitns" arg
   *
   * @param {ITask} task
   * @returns
   * @memberof WorkspaceComponent
   */
  public generateTaskPolyline(task: ITask) {
    const points = [];
    task.relations.forEach(item => {
      if (this.isTaskVisible(this.tasks_object[Number(item.target_id)])) {
        const point = [];
        const line = this.createRelationLine(task.id, Number(item.target_id), item.type);
        line.forEach((coords, ix) => {
          if (!ix) point.push(`${coords.x1} ${coords.y1}`);

          point.push(`${coords.x2} ${coords.y2}`);
        })
        points.push(point.join(','));
      }
    });

    return points;
  }

  /**
   * Converts set of points to svg path "d" arg
   *
   * @param {ITask} task
   * @returns
   * @memberof WorkspaceComponent
   */
  public generateTaskPathline(task: ITask) {
    const points = {};
    task.relations.forEach((item, ix) => {
      if (this.isTaskVisible(this.tasks_object[Number(item.target_id)])) {
        const point = [];
        const line = this.createRelationLine(task.id, Number(item.target_id), item.type);
        line.forEach((coords, ix) => {
          if (!ix) point.push(`M${coords.x1} ${coords.y1}`);

          point.push(`L${coords.x2} ${coords.y2}`);
        })
        points[ix] = (point.join(','));
      }
    });

    return points;
  }

  /**
   * Generates uniq ID
   *
   * @returns
   * @memberof WorkspaceComponent
   */
  public generateUniq() {
    return Math.random().toString(36).substring(2) + (new Date()).getTime().toString(36);
  }

  /**
   * Checks if any drag between link dots exists
   *
   * @returns
   * @memberof WorkspaceComponent
   */
  public anyLinkDragged() {
    const task: ITask = this.tasks.find(item => item.props.isLinkDragged);
    if (task) {
      const [x1, y1] = this.getLinkDotPosition(task.props.linkDraggPosition.uniq, task, task.props.linkDraggPosition.edge);
      return {
        x1,
        y1,
        x2: x1 + task.props.linkDraggPosition.x,
        y2: y1 + task.props.linkDraggPosition.y
      }
    }
    return null;
  }

  /**
   * Return coords of link dot at given edge
   * If task has not changed/mouse up has not been fired - uniq id is same for all calls - function returns cached value
   *
   * @param {(number | string)} uniq
   * @param {ITask} task
   * @param {string} edge
   * @returns
   * @memberof WorkspaceComponent
   */
  @Memoize()
  public getLinkDotPosition(uniq: number | string, task: ITask, edge: string) {
    let x1 = Number(this.taskPosition(task, true)) + (edge === 'left' ? -10 : 10);
    x1 += edge === 'left' ? 0 : this.taskWidth(task);
    const y1 = this.getTaskPositionNumber(uniq, task.id) * this.task_list_config.row_height + (this.task_list_config.row_height / 2) + 2;
    return [x1, y1];
  }

  /**
   * Return ordinal number of visible tasks 
   * If task has not changed/mouse up has not been fired - uniq id is same for all calls - function returns cached value
   * 
   * @param {(number | string)} uniq
   * @param {number} task_id
   * @returns {number}
   * @memberof WorkspaceComponent
   */
  @Memoize()
  public getTaskPositionNumber(uniq: number | string, task_id: number): number {
    let counter = 0;
    for (let i = 0; i < this.tasks.length; i++) {
      let item = this.tasks[i];
      if (item.id === task_id)
        break;

      if (this.isTaskVisible(item)) {
        counter++;
      }
    }

    return counter;
  }
}

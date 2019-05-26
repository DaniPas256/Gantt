import { Injectable } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { columns } from './../config/task-list-columns';
import * as moment from 'moment';
import { MoneyPipe } from '../pipes/money.pipe';
import generateTask, { ITask } from '../interfaces/ITask';

@Injectable({
  providedIn: 'root'
})
export class GanttService {
  private chart_start_date = '2019-05-01';
  private chart_end_date = '2019-05-31';
  private day_size = 40;

  constructor(private currencyPipe: MoneyPipe) { }

  public tasks: Array<ITask> = [generateTask(1, 0), generateTask(2, 0), generateTask(3, 2), generateTask(4, 3)];
  public tasks_object: any;

  // , generateTask(), generateTask(), generateTask(), generateTask(), generateTask(), generateTask(), generateTask(), generateTask(), generateTask(), generateTask(), generateTask(), generateTask()

  public config = {
    timeline: {
      scale_unit_height: 20,
      number_of_displayed_scales: 0,
      number_of_days: 0
    },
    task_list: {
      width: () => {
        let sum = 0;
        const columns = this.config.task_list.columns.forEach(item => {
          if (item.visible) {
            sum += item.width;
          }
        });

        return sum;
      },
      row_height: 30,
      height: 500,
      columns: columns
    },
    workspace: {
      task_height: 20,
      task_padding_top: 5
    }
  };

  public get get_day_size() {
    return this.day_size < 1 ? 1 : this.day_size;
  }

  public get chart_dates() {
    return { start: this.chart_start_date, end: this.chart_end_date };
  }

  public calc_tasks_details() {
    this.tasks_object = {};
    this.tasks.forEach(item => this.tasks_object[item.id] = item);
    this.tasks.map(item => this.task_details(item));
    this.generateAdditionalTaskProperty();
  }

  public task_details(task: ITask) {
    const statuses_class = {
      'S': 'status-started',
      'IP': 'status-in-progress',
      'C': 'status-completed',
    };

    const is_delayed = moment().isAfter(moment(task.end_date)) && task.status !== 'C';

    if (task.props === undefined) {
      task.props = {
        duration: moment(task.end_date).diff(moment(task.start_date), 'day') + 1,
        left: moment(task.start_date).diff(moment(this.chart_start_date), 'day'),
        is_delayed,
        classes: 'draggable ' + statuses_class[task.status] + (is_delayed ? " task_delayed" : ""),
        drag: 0,
        progress_drag: 0,
        resize_left: 0,
        resize_right: 0,
        day_size: this.day_size,
        padding: this.config.workspace.task_padding_top,
        moneyPipe: this.currencyPipe.transform,
        expanded: false,
        parents: this.getTaskParents(task) || [],
        has_children: this.tasks.find(item => item.parent == task.id) !== undefined
      }
    } else {
      task.props.duration = moment(task.end_date).diff(moment(task.start_date), 'day') + 1;
      task.props.left = moment(task.start_date).diff(moment(this.chart_start_date), 'day');
      task.props.drag = 0;
      task.props.is_delayed = is_delayed;
      task.props.classes = 'draggable ' + statuses_class[task.status] + (is_delayed ? " task_delayed" : "");
      task.props.progress_drag = 0;
      task.props.resize_left = 0;
      task.props.resize_right = 0;
      task.props.day_size = this.day_size;
    }
  }

  generateAdditionalTaskProperty() {
    const points_to_search = new Set([0]);
    const skip_children = new Set();
    let counter = 1;

    points_to_search.forEach(key => {
      let task: ITask | boolean = true;
      while (task !== undefined) {
        task = this.tasks.find(
          item => item.parent === key && !skip_children.has(item.id)
        );
        const parent = this.tasks_object[key] || undefined;

        if (task === undefined) {
          continue;
        }
        points_to_search.add(task.id);

        task.props.$number = parent === undefined ? counter : parent.props.$number + '.' + counter;
        task.props.order = counter;
        task.props.$sort_name = counter + task.name;
        task.props.$depth = parent === undefined ? 1 : parent.props.$depth + 1;

        counter++;
        skip_children.add(task.id);
      }
      counter = 1;
    })
  }

  public getTaskParents(task, accumulator = []) {
    if (task.parent && this.tasks_object[task.parent] !== undefined) {
      accumulator.push(task.parent);
      return this.getTaskParents(this.tasks_object[task.parent], accumulator);
    } else {
      if (!task.parent) {
        return accumulator;
      } else {
        console.error('Task parent not exists');
      }
    }
  }

  public isTaskVisible(task) {
    return task.props.parents.every(task_id => this.tasks_object[task_id].props.expanded);
  }
}

import { Injectable } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { columns } from './../config/task-list-columns';
import generateTask, { ITask } from '../interfaces/ITask';
import * as moment from 'moment';
import { MoneyPipe } from '../pipes/money.pipe';

@Injectable({
  providedIn: 'root'
})
export class GanttService {
  private chart_start_date = '2019-05-01';
  private chart_end_date = '2019-05-31';
  private day_size = 40;

  constructor(private currencyPipe: MoneyPipe) { }

  public tasks: Array<ITask> = [generateTask(1, 0), generateTask(2, 0), generateTask(3, 2), generateTask(4, 3)];
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
    this.tasks.map(item => {
      item.props = this.task_details(item);
    });
    this.generateAdditionalTaskProperty();
  }

  public task_details(task: ITask) {
    return {
      duration: moment(task.end_date).diff(moment(task.start_date), 'day') + 1,
      left: moment(task.start_date).diff(moment(this.chart_start_date), 'day'),
      classes: 'draggable',
      moneyPipe: this.currencyPipe.transform
    }
  }

  generateAdditionalTaskProperty() {
    const points_to_search = [0];

    let counter = 1;
    const skip_id = new Set();

    for (const key of points_to_search) {
      while (true) {
        const task = this.tasks.find(
          item => item.parent === key && !skip_id.has(item.id)
        );

        if (task === undefined) {
          break;
        }

        if (!points_to_search.includes(task.id)) {
          points_to_search.push(task.id);
        }

        let parent = this.tasks.find(item => item.id === key);
        const index = this.tasks.findIndex(item => task.id === item.id);

        if (parent === undefined) {
          this.tasks[index].props.$number = counter;
        } else {
          this.tasks[index].props.$number = parent.props.$number + '.' + counter;
        }

        this.tasks[index].props.order = counter;
        this.tasks[index].props.$depth = parent === undefined ? 1 : parent.props.$depth + 1;

        counter++;
        skip_id.add(task.id);
      }

      counter = 1;
    }
  }

}

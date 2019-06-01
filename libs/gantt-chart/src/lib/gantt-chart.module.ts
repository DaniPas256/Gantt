import { NgModule } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { EntryComponent } from './entry.component';
import { TimelineComponent } from './components/timeline/timeline.component';
import { GanttService } from './services/gantt-service.service';
import { TaskListComponent } from './components/task-list/task-list.component';
import { WorkspaceComponent } from './components/workspace/workspace.component';
import { MoneyPipe } from './pipes/money.pipe';
import { SafeHtml } from './pipes/safeHtml.pipe';
import { DraggableDirective } from './directives/Draggable.directive';
import { ResizableDirective } from './directives/Resizable.directive';
import { ProgressDragDirective } from './directives/ProgressDrag.directive';
import { TaskFormComponent } from './components/task-form/task-form.component';
import { FormsModule } from '@angular/forms';
import { DatepickerDirective } from './directives/datepicker.directive';
import { TrackScrollDirective } from './directives/track-scroll.directive';
import { MenuComponent } from './components/menu/menu.component';

const components = [
  EntryComponent,
  TimelineComponent,
  TaskListComponent,
  WorkspaceComponent,
  TaskFormComponent,
  MenuComponent
];

const directives = [
  DraggableDirective,
  ResizableDirective,
  DatepickerDirective,
  TrackScrollDirective,
  ProgressDragDirective
]

const pipes = [
  MoneyPipe,
  SafeHtml
];

@NgModule({
  imports: [CommonModule, FormsModule],
  declarations: [].concat(components, directives, pipes),
  providers: [GanttService, MoneyPipe, SafeHtml],
  exports: [EntryComponent]
})
export class GanttChartModule { }

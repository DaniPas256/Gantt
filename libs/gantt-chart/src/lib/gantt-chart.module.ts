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

@NgModule({
  imports: [CommonModule, FormsModule],
  declarations: [EntryComponent, TimelineComponent, TaskListComponent, WorkspaceComponent, DraggableDirective, ResizableDirective, MoneyPipe, ProgressDragDirective, SafeHtml, TaskFormComponent, DatepickerDirective],
  providers: [GanttService, MoneyPipe, SafeHtml],
  exports: [EntryComponent]
})
export class GanttChartModule { }

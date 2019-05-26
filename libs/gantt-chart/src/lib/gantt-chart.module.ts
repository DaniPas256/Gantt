import { NgModule } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { EntryComponent } from './entry.component';
import { TimelineComponent } from './components/timeline/timeline.component';
import { GanttService } from './services/gantt-service.service';
import { TaskListComponent } from './components/task-list/task-list.component';
import { WorkspaceComponent } from './components/workspace/workspace.component';
import { MoneyPipe } from './pipes/money.pipe';
import { DraggableDirective } from './directives/Draggable.directive';
import { ResizableDirective } from './directives/Resizable.directive';
import { ProgressDragDirective } from './directives/ProgressDrag.directive';

@NgModule({
  imports: [CommonModule],
  declarations: [EntryComponent, TimelineComponent, TaskListComponent, WorkspaceComponent, DraggableDirective, ResizableDirective, MoneyPipe, ProgressDragDirective],
  providers: [GanttService, MoneyPipe],
  exports: [EntryComponent]
})
export class GanttChartModule { }

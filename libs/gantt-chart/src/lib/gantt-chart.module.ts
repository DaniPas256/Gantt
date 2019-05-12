import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EntryComponent } from './entry.component';
import { TimelineComponent } from './components/timeline/timeline.component';
import { GanttService } from './services/gantt-service.service';

@NgModule({
  imports: [CommonModule],
  declarations: [EntryComponent, TimelineComponent],
  providers: [GanttService],
  exports: [EntryComponent]
})
export class GanttChartModule { }

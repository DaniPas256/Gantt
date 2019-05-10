import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EntryComponent } from './entry.component';

@NgModule({
  imports: [CommonModule],
  declarations: [EntryComponent],
  exports: [EntryComponent]
})
export class GanttChartModule { }

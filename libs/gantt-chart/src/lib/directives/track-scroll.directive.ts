import { Directive, HostListener, Input } from '@angular/core';
import { GanttService } from './../services/gantt-service.service';

@Directive({
  selector: '[ganttTrackScroll]'
})
export class TrackScrollDirective {
  @Input() target;
  @Input() scroll;

  constructor(public ganttService: GanttService) { }
  @HostListener('scroll', ['$event']) private onScroll($event: Event): void {
    requestAnimationFrame(() => {
      const scrollValue = $event.srcElement[this.scroll];
      this.ganttService.scroll[this.scroll] = Math.ceil(scrollValue) + 1;
    })
  }
}

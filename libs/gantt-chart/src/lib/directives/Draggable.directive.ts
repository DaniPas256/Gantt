import { AfterViewInit, Directive, ElementRef, Input, NgZone, OnDestroy, Output, EventEmitter, ChangeDetectorRef } from "@angular/core";
import { Observable, Subject, fromEvent } from "rxjs";
import { takeUntil, map, switchMap, debounceTime } from 'rxjs/operators';
import { ITask } from '../interfaces/ITask';
import { GanttService } from './../services/gantt-service.service';

@Directive({
  selector: '[draggable]'
})
export class DraggableDirective implements AfterViewInit, OnDestroy {
  @Output() endDrag: EventEmitter<{ drag: number, task_id: number }> = new EventEmitter();

  @Input() dragHandle: string;
  @Input() dragTarget: string;
  @Input() task: ITask;

  // Element to be dragged
  private target: HTMLElement;
  // Drag handle
  private handle: HTMLElement;
  private delta = { x: 0, y: 0 };

  private destroy$ = new Subject<void>();
  private ngDestroy$ = new Subject<void>();

  constructor(private elementRef: ElementRef, private zone: NgZone, public cd: ChangeDetectorRef, public ganttService: GanttService) {
  }

  public ngAfterViewInit(): void {
    this.handle = this.dragHandle ? document.querySelector(this.dragHandle) as HTMLElement : this.elementRef.nativeElement;
    this.target = this.dragTarget ? document.querySelector(this.dragTarget) as HTMLElement : this.elementRef.nativeElement;

    this.zone.runOutsideAngular(() => {
      this.setupEvents();
    });
  }

  public ngOnDestroy(): void {
    this.ngDestroy$.next();
  }

  private setupEvents() {
    let mousedown$ = fromEvent(this.handle, 'mousedown');
    let mousemove$ = fromEvent(document, 'mousemove');
    let mouseup$ = fromEvent(document, 'mouseup');

    let mousedrag$ = mousedown$.pipe(switchMap((event: MouseEvent) => {
      let startX = event.clientX;
      let startY = event.clientY;
      this.task.props.isDragged = true;

      return mousemove$.pipe(
        map((event: MouseEvent) => {
          event.preventDefault();
          this.delta = {
            x: event.clientX - startX,
            y: event.clientY - startY
          };
        }), takeUntil(mouseup$))
    }), takeUntil(this.destroy$));

    mousedrag$.subscribe(() => {
      if (this.delta.x === 0) {
        return;
      }

      this.translate();
    });

    mouseup$.pipe(debounceTime(50), takeUntil(this.destroy$)).subscribe(() => {
      if (this.delta.x != 0 && this.task.props.permissions.drag) {
        this.endDrag.emit({ drag: this.delta.x, task_id: this.task.id });
        this.task.props.isDragged = false;
      }
      this.delta = { x: 0, y: 0 };
    });
  }

  private translate() {
    if (this.task.props.permissions.drag) {
      requestAnimationFrame(() => {
        this.task.props.drag = this.delta.x;
        this.cd.detectChanges();
      });
    }
  }
}

import { AfterViewInit, Directive, ElementRef, Input, NgZone, OnDestroy, Output, EventEmitter, ChangeDetectorRef } from "@angular/core";
import { Observable, Subject, fromEvent } from "rxjs";
import { takeUntil, map, switchMap, debounceTime } from 'rxjs/operators';
import { ITask } from '../interfaces/ITask';
import { GanttService } from './../services/gantt-service.service';

@Directive({
  selector: '[resizable]'
})
export class ResizableDirective implements AfterViewInit, OnDestroy {
  @Output() endResize: EventEmitter<{ task_id: number, edge: string }> = new EventEmitter();

  @Input() resizeHandle: string;
  @Input() resizeTarget: string;
  @Input() task: ITask;
  @Input() edge: string;

  private target: HTMLElement;
  private handle: HTMLElement;
  private delta = { x: 0, y: 0 };

  private destroy$ = new Subject<void>();
  private ngDestroy$ = new Subject<void>();

  constructor(private elementRef: ElementRef, private zone: NgZone, public cd: ChangeDetectorRef, public ganttService: GanttService) {
  }

  public ngAfterViewInit(): void {
    this.handle = this.resizeHandle ? document.querySelector(this.resizeHandle) as HTMLElement : this.elementRef.nativeElement;
    this.target = this.resizeTarget ? document.querySelector(this.resizeTarget) as HTMLElement : this.elementRef.nativeElement;

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
      this.task.props.isResized = true;
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

      this.resize();
    });

    mouseup$.pipe(debounceTime(50), takeUntil(this.destroy$)).subscribe(() => {
      if (this.delta.x != 0 && this.task.props.permissions.resize) {
        this.endResize.emit({ task_id: this.task.id, edge: this.edge });
        this.task.props.isResized = false;
      }

      this.delta = { x: 0, y: 0 };
    });
  }

  private resize() {
    if (this.task.props.permissions.resize) {
      requestAnimationFrame(() => {
        if (this.edge === "left") {
          this.task.props.resize_left = this.delta.x;
        }

        if (this.edge === "right") {
          this.task.props.resize_right = this.delta.x;
        }

        this.cd.detectChanges();
        this.ganttService.dcWorkspace();
        this.ganttService.dcTaskList();
      });
    }
  }
}

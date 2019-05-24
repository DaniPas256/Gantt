import { AfterViewInit, Directive, ElementRef, Input, NgZone, OnDestroy, Output, EventEmitter } from "@angular/core";
import { Observable, Subject, fromEvent } from "rxjs";
import { takeUntil, map, switchMap, debounceTime } from 'rxjs/operators';
import { ITask } from '../interfaces/ITask';

@Directive({
  selector: '[resizable]'
})
export class ResizableDirective implements AfterViewInit, OnDestroy {
  @Output() endResize: EventEmitter<{ resize: number, task_id: number }> = new EventEmitter();

  @Input() resizeHandle: string;
  @Input() resizeTarget: string;
  @Input() task: ITask;

  private target: HTMLElement;
  private handle: HTMLElement;
  private delta = { x: 0, y: 0 };
  private offset = { x: 0, y: 0 };

  private destroy$ = new Subject<void>();

  constructor(private elementRef: ElementRef, private zone: NgZone) {
  }

  public ngAfterViewInit(): void {
    this.handle = this.resizeHandle ? document.querySelector(this.resizeHandle) as HTMLElement : this.elementRef.nativeElement;
    this.target = this.resizeTarget ? document.querySelector(this.resizeTarget) as HTMLElement : this.elementRef.nativeElement;
    this.setupEvents();
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
  }

  private setupEvents() {
    let mousedown$ = fromEvent(this.handle, 'mousedown');
    let mousemove$ = fromEvent(document, 'mousemove');
    let mouseup$ = fromEvent(document, 'mouseup');

    let mousedrag$ = mousedown$.pipe(switchMap((event: MouseEvent) => {
      let startX = event.clientX;
      let startY = event.clientY;

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
      if (this.delta.x === 0 && this.delta.y === 0) {
        return;
      }

      this.resize();
    });

    mouseup$.pipe(debounceTime(50), takeUntil(this.destroy$)).subscribe(() => {
      this.endResize.emit({ resize: this.delta.x, task_id: this.task.id });

      this.offset.x += this.delta.x;
      this.offset.y += this.delta.y;
      this.delta = { x: 0, y: 0 };
    });
  }

  private resize() {
    requestAnimationFrame(() => {
      this.task.props.resize = this.delta.x;
    });
  }
}
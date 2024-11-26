import { DOCUMENT } from "@angular/common";
import {
  OnInit,
  AfterViewInit,
  ContentChild,
  Directive,
  ElementRef,
  Inject,
  Input,
  OnDestroy,
} from "@angular/core";
import { fromEvent, Subscription } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { KeyFrame } from "../../3Dtools/ParticleSystem/propertytypes/keyframelist";

@Directive({
    standalone: true,
  selector: "[customSlider]",
})
export class FreeDraggingDirective implements OnInit, OnDestroy {
  private element!: HTMLElement;


  @Input() keyframe!: KeyFrame;
 

  private subscriptions: Subscription[] = [];
 
  constructor(
    private elementRef: ElementRef,
    @Inject(DOCUMENT) private document: any
  ) {

  }
 
  ngOnInit(): void {
    this.element = this.elementRef.nativeElement as HTMLElement;
    this.initDrag();
  }
 
  initDrag(): void {
    // 1
    const dragStart$ = fromEvent<MouseEvent>(this.element, "mousedown");
    const dragEnd$ = fromEvent<MouseEvent>(this.document, "mouseup");
    const drag$ = fromEvent<MouseEvent>(this.document, "mousemove").pipe(
      takeUntil(dragEnd$)
    );
 
    // 2
    let initialX: number,
      initialY: number,
      currentX = this.keyframe.position*100,
      currentY = this.keyframe.value*100;
 
      this.element.style.transform =
      "translate3d(" + (this.keyframe.position*100) + "px, " + (this.keyframe.value*100) + "px, 0)";
    let dragSub: Subscription = new Subscription;
 
    // 3
    const dragStartSub = dragStart$.subscribe((event: MouseEvent) => {
      initialX = event.clientX - currentX;
      initialY = event.clientY - currentY;
      this.element.classList.add('free-dragging');
 
      // 4
      dragSub = drag$.subscribe((event: MouseEvent) => {
        event.preventDefault();
 
        currentX = event.clientX - initialX;
        currentY = event.clientY - initialY;
        this.keyframe.position = currentX * 0.01;
        this.keyframe.value = currentY * 0.01;
        this.element.style.transform =
          "translate3d(" + currentX + "px, " + currentY + "px, 0)";
      });
    });
 
    // 5
    const dragEndSub = dragEnd$.subscribe(() => {
      initialX = currentX;
      initialY = currentY;
      this.element.classList.remove('free-dragging');
      if (dragSub) {
        dragSub.unsubscribe();
      }
    });
 
    // 6
    this.subscriptions.push.apply(this.subscriptions, [
      dragStartSub,
      dragSub,
      dragEndSub,
    ]);
  }
 
  ngOnDestroy(): void {
    this.subscriptions.forEach((s) => s?.unsubscribe());
  }
}
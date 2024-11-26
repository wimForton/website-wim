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
  Renderer2,
} from "@angular/core";
import { fromEvent, Subscription } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { KeyFrame } from "../../3Dtools/ParticleSystem/propertytypes/keyframelist";
import { Vector3D } from "../../3Dtools/Utils/Vector3D";


@Directive({
    standalone: true,
  selector: "[appFreeDragging]",
})
export class FreeDraggingDirective implements OnInit, OnDestroy {
  private element!: HTMLElement;


  @Input() keyframe!: Vector3D;
  @Input() twodimensional: boolean = true;
 

  private subscriptions: Subscription[] = [];
 
  constructor(
    private elementRef: ElementRef,
    private render: Renderer2,
    @Inject(DOCUMENT) private document: any
  ) {

  }
 
  ngOnInit(): void {
    this.element = this.elementRef.nativeElement as HTMLElement;

    this.createHandle(this.element);
    this.initDrag();
  }

  createHandle(element: HTMLElement){
    // var circle = this.render.createElement("http://www.w3.org/2000/svg", 'circle');
    // this.render.setAttribute(circle, 'cx', "10");
    // this.render.setAttribute(circle, 'cy', "10");
    // this.render.setAttribute(circle, 'r', "12");
    // this.render.setAttribute(circle, 'style', 'fill: blue; stroke: black; stroke-width: 1px;' );
    // this.render.appendChild(element, circle);

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
      currentX = this.keyframe.x,
      currentY = this.keyframe.y;
 
      this.element.style.transform = "translate3d(" + (this.keyframe.x) + "px, " + (this.keyframe.y) + "px, 0)";
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
        if(this.twodimensional)currentY = event.clientY - initialY;
        this.keyframe.x = currentX;
        this.keyframe.y = currentY;
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
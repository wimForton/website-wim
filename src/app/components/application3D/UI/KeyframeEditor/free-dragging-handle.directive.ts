import { Directive, ElementRef } from "@angular/core";

@Directive({
    standalone: true,
  selector: "[appFreeDraggingHandle]",
})
export class FreeDraggingHandleDirective {
  constructor(public elementRef: ElementRef<HTMLElement>) {}
}
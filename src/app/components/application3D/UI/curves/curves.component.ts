import { Component, Input, ViewChild, ElementRef, OnInit, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-curves',
  standalone: true,
  imports: [],
  templateUrl: './curves.component.html',
  styleUrl: './curves.component.css'
})
export class CurvesComponent implements OnInit {
  @Input() name!: string;
  @ViewChild('svgContainer') container!: ElementRef;

  constructor(private renderer: Renderer2) {

  }

  ngOnInit() {
    //const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    //const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    //this.renderer.setAttribute(path, 'd', 'M0 50 L100 0 L100 100 Z');
    //this.renderer.setAttribute(path, 'fill', 'pink');
    //this.renderer.setAttribute(path, 'transform', 'rotate(30, 50, 50)');
    //this.renderer.appendChild(svg, path);
    //this.renderer.appendChild(this.container.nativeElement, svg);
  }
}

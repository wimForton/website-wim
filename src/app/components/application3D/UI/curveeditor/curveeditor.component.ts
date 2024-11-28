import { Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy, ViewChild, ElementRef, AfterViewInit, AfterViewChecked, model, inject, OnChanges, AfterContentInit, DoCheck, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as THREE from 'three';

import { GUI } from 'three/addons/libs/lil-gui.module.min.js';

import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { TransformControls } from 'three/addons/controls/TransformControls.js';
import { CurveViewport } from './CurveViewport';

@Component({
  selector: 'app-curveeditor',
  standalone: true,
  imports: [],
  templateUrl: './curveeditor.component.html',
  styleUrl: './curveeditor.component.css'
})
export class CurveeditorComponent implements AfterViewInit, AfterViewChecked, OnChanges, AfterContentInit, DoCheck  {

  @ViewChild('curvecontainer', { read: ElementRef, static:false })//@ViewChild('viewportcontainer', { read: ElementRef })
  curvecontainer: ElementRef < HTMLDivElement > = {} as ElementRef;
  @Input() changedetector: number = 0;
  private lastchange = 0;
  private container?: HTMLElement;
  private viewport!: CurveViewport;



  ngAfterViewInit(): void {
    //setTimeout(this.startGraphic, 500);
    this.startGraphic();

    // this.container = this.curvecontainer.nativeElement;
    // this.viewport = new CurveViewport(this.container);

  }

  ngDoCheck(){
    //console.log("curveeditor.component:  ngDoCheck()");
  }

  ngOnChanges(){
    console.log("curveeditor.component:  ngOnChanges()");
    this.viewport.reset();
  }

  ngAfterContentInit(){
    console.log("curveeditor.component:  ngAfterContentInit()");
  }

  ngAfterViewChecked(): void{
    if(this.lastchange != this.changedetector){
      this.lastchange! = this.changedetector!;
      console.log("curveeditor.component:  ngAfterViewChecked()", this.lastchange);
    }
    // this.container = this.curvecontainer.nativeElement;
    // this.viewport = new CurveViewport(this.container);
    //console.log("curveeditor.component:  ngAfterViewChecked()");
  }
  startGraphic(){
    this.container = this.curvecontainer.nativeElement;
    this.viewport = new CurveViewport(this.container);
  }

}

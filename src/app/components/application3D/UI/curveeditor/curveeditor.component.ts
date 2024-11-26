import { Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy, ViewChild, ElementRef, AfterViewInit, AfterViewChecked, model, inject } from '@angular/core';
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
export class CurveeditorComponent implements AfterViewInit, AfterViewChecked  {

  @ViewChild('curvecontainer', { read: ElementRef, static:false })//@ViewChild('viewportcontainer', { read: ElementRef })
  curvecontainer: ElementRef < HTMLDivElement > = {} as ElementRef;
  private container?: HTMLElement;
  private viewport!: CurveViewport;



  ngAfterViewInit(): void {
    //setTimeout(this.startGraphic, 500);
    this.startGraphic();
    // this.container = this.curvecontainer.nativeElement;
    // this.viewport = new CurveViewport(this.container);

  }

  ngAfterViewChecked(): void{
    // this.container = this.curvecontainer.nativeElement;
    // this.viewport = new CurveViewport(this.container);
  }
  startGraphic(){
    this.container = this.curvecontainer.nativeElement;
    this.viewport = new CurveViewport(this.container);
  }

}

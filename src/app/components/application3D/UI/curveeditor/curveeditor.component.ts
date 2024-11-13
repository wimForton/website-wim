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
export class CurveeditorComponent implements AfterViewInit  {

  @ViewChild('curvecontainer', { read: ElementRef, static:false })//@ViewChild('viewportcontainer', { read: ElementRef })
  curvecontainer!: ElementRef;
  private container!: HTMLElement;
  private viewport!: CurveViewport;



  ngAfterViewInit(): void {
    this.container = this.curvecontainer.nativeElement;
    this.viewport = new CurveViewport(this.container);

  }


}

import { Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy, ViewChild, ElementRef, AfterViewInit, AfterViewChecked, model, inject, OnChanges, AfterContentInit, DoCheck, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatSliderModule} from '@angular/material/slider';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {FormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatCardModule} from '@angular/material/card';
import { CurveViewport } from './CurveViewport';
import { KeyframeList } from '../../3Dtools/ParticleSystem/propertytypes/keyframelist';
import { CurveViewportService } from './CurveViewportService';

@Component({
  selector: 'app-curveeditor',
  standalone: true,
  imports: [
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatCheckboxModule,
    MatSliderModule
  ],
  templateUrl: './curveeditor.component.html',
  styleUrl: './curveeditor.component.css',
})
export class CurveeditorComponent implements AfterViewInit, AfterViewChecked, OnChanges, AfterContentInit, DoCheck  {

  @ViewChild('curvecontainer', { read: ElementRef, static:false })//@ViewChild('viewportcontainer', { read: ElementRef })
  curvecontainer: ElementRef < HTMLDivElement > = {} as ElementRef;
  @Input() changedetector: number = 0;
  private lastchange = 0;
  private container?: HTMLElement;
  //private viewport!: CurveViewport;
  public time = 0;
  public value = 0;

  public sl1 = { disabled: false, min: 0, max: 200, showTicks: true, step: 1, thumbLabel: true, label: "Time" };
  public sl2 = { disabled: false, min: -20, max: 20, showTicks: true, step: 0.001, thumbLabel: true, label: "Value" };

  constructor(private viewport: CurveViewportService) {
    viewport.timechanged$.subscribe(item => this.onTimeChanged(item));
  }

  onTimeChanged(time: number){
    this.value = this.viewport.getValueAtTime();
  }

  ngAfterViewInit(): void {
    //setTimeout(this.startGraphic, 500);
    this.startGraphic();

    // this.container = this.curvecontainer.nativeElement;
    // this.viewport = new CurveViewport(this.container);

  }

  // public onTimeChange(event: Event){
  //   this.viewport.setTime(+((event.target as HTMLInputElement).value));
  //   this.value = this.viewport.getValueAtTime();
  // }

  public onValueChange(event: Event){
    this.value = +((event.target as HTMLInputElement).value);
    this.viewport.SetValueAutoKey(this.value);
    //this.value = this.viewport.getValueAtTime();
    //this.viewport.setTime(+((event.target as HTMLInputElement).value));
  }

  public LoadCurve(keyframelist: KeyframeList){
    this.viewport.LoadKeyframeList(keyframelist);
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
    this.viewport.Create(this.container);
  }

}

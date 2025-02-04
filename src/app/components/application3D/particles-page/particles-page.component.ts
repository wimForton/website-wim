import { Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy, ViewChild, ElementRef, AfterViewInit, AfterViewChecked, model, inject, OnChanges, DoCheck, Input, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatSliderModule } from '@angular/material/slider';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { Viewport } from '../3Dtools/Viewport/Viewport';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import { ControlParameters, ParticleSystem, FunctionWithTrigger, ParticleParameterGroup } from '../3Dtools/ParticleSystem/ParticleSystem';
import { ParticleScene } from '../3Dtools/ParticleSystem/ParticleScene';
import { Load, Save } from '../3Dtools/ParticleSystem/LoadSave/LoadSave';
import { ForceClassNames } from '../3Dtools/ParticleSystem/forces/AddForceClasses';
import { HelpDialog } from './helpdialog/helpdialog.component';
import { IForceClass } from '../3Dtools/ParticleSystem/forces/IForceClass';
import { ParametersComponent } from './parameters/parameters.component';
import { CurveeditorComponent } from '../UI/curveeditor/curveeditor.component';
import { CurveViewport } from '../UI/curveeditor/CurveViewport';
import { CurveViewportService } from '../UI/curveeditor/CurveViewportService';
import { EmitFromPoint } from '../3Dtools/ParticleSystem/operators/EmitFromPoint';
import { IOperator } from '../3Dtools/ParticleSystem/operators/IOperator';
declare var require: any;







@Component({
  selector: 'app-particles-page',
  standalone: true,
  imports: [
    MatSliderModule,
    MatFormFieldModule,
    FormsModule,
    MatCardModule,
    MatInputModule,
    MatCheckboxModule,
    MatExpansionModule,
    MatMenuModule,
    MatButtonModule,
    MatTabsModule,
    MatDialogModule,
    CommonModule,
    ParametersComponent,
    CurveeditorComponent
  ],
  templateUrl: './particles-page.component.html',
  styleUrl: './particles-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class ParticlesPageComponent implements AfterViewInit, OnChanges, DoCheck, AfterViewChecked {

  public value = 0;
  private viewPort!: Viewport;
  private particleScenes: Array<ParticleScene> = [];
  public addForces: Array<FunctionWithTrigger> = [];
  public panelOpenIndex = 0;
  readonly checked = model(false);
  public ForceClassNames = ForceClassNames;
  //private loadsave = LoadSave.instance;
  public particleSystems: Array<ParticleSystem> = new Array<ParticleSystem>();


  readonly dialog = inject(MatDialog);
  @ViewChild('viewportcontainer', { read: ElementRef, static:false })//@ViewChild('viewportcontainer', { read: ElementRef })
  viewportcontainer!: ElementRef;
  @Input() changedetector: number = 0;
  private lastchange = 0;
  public time = 0;
  public sl1 = { disabled: false, min: 0, max: 200, showTicks: true, step: 1, thumbLabel: true, label: "Time" };


  constructor(private curveviewport: CurveViewportService) {
    curveviewport.timechanged$.subscribe(item => this.onTimeChanged(item));
  }

  onTimeChanged(time: number){

  }
  onPlay(){
    for (let index = 0; index < this.particleSystems.length; index++) {
      this.particleSystems[index].Play();
    }
  }
  onStop(){
    for (let index = 0; index < this.particleSystems.length; index++) {
      this.particleSystems[index].Stop();
    }
  }

  ngAfterViewInit(): void {
    var container: HTMLElement = this.viewportcontainer.nativeElement;
    const particleSystem = new ParticleSystem(200);
    particleSystem.addEmitClass(new EmitFromPoint());
    this.particleSystems.push(particleSystem);

    for (let i = 0; i < this.particleSystems.length; i++) {
      this.particleScenes.push(new ParticleScene(this.particleSystems[i]));
    }

    this.viewPort = new Viewport(this.particleScenes, "container", container);
  }

  ngAfterViewChecked(): void{
    if(this.lastchange != this.changedetector){
      this.lastchange! = this.changedetector!;
      console.log("particles-page.component:  ngAfterViewChecked()", this.lastchange);
    }
    // this.container = this.curvecontainer.nativeElement;
    // this.viewport = new CurveViewport(this.container);
    //console.log("particles-page.component:  ngAfterViewChecked()");
  }

  ngDoCheck(){
    //console.log("curveeditor.component:  ngDoCheck()");
  }

  ngOnChanges(){
    if(this.viewPort != undefined){
      this.viewPort.reset();

    }
    console.log("particle window visible");
  }

  onTimeChange(event: Event){
    this.time = +((event.target as HTMLInputElement).value);
    this.curveviewport.setTime(this.time);
    for (let index = 0; index < this.particleSystems.length; index++) {
      this.particleSystems[index].setTime(this.time);
      
    }
  }
  
  openDialog() {
    const dialogRef = this.dialog.open(HelpDialog);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  public LoadParticles1() {
    let json1 = require('./json1.json');
    Load(this.particleSystems, this.particleScenes, this.viewPort!, json1);
  }

  public LoadParticles2() {
    let json2 = require('./json2.json');
    Load(this.particleSystems, this.particleScenes, this.viewPort!, json2);
  }

  public LoadParticles3() {
    let json3 = require('./json3.json');
    Load(this.particleSystems, this.particleScenes, this.viewPort!, json3);
  }

  public LoadParticles4() {
    let json4 = require('./json4.json');
    Load(this.particleSystems, this.particleScenes, this.viewPort!, json4);
  }

  public LoadParticles5() {
    let json5 = require('./json5.json');
    Load(this.particleSystems, this.particleScenes, this.viewPort!, json5);
  }

  public LoadParticles6() {
    let json5 = require('./test.json');
    Load(this.particleSystems, this.particleScenes, this.viewPort!, json5);
  }

  public InitParticles() {
    //this.viewPort!.clear();
    //this.particleSystems = [];
    //this.particleScenes = [];

    let json2 = require('./new.json');
    Load(this.particleSystems, this.particleScenes, this.viewPort!, json2);

    //console.log("particleScenes length", this.particleScenes.length);
  }

  public SaveParticles() {
    let particleparametergroup: ParticleParameterGroup = new ParticleParameterGroup(this.particleSystems);
    Save(particleparametergroup);
  }

  public getParticleSystemId(particlesystem: ParticleSystem): number {
    let index = this.particleSystems.indexOf(particlesystem) + 1;
    return index;
  }

  public RemoveForce(item: IOperator, particlesystem: ParticleSystem) {
    let index = particlesystem.forceClasses.indexOf(item);
    //particlesystem.forceClasses.splice(index, 1);
    particlesystem.GetForceClasses().splice(index, 1)
  }
}

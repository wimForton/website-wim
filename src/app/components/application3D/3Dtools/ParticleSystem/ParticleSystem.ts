import { EventEmitter } from "@angular/core";
import { Slider } from "../../UiComponentData/Slider";
import { EmitFromPoint } from "./operators/EmitFromPoint";
import { IEmitClass } from "./operators/IEmitClass";
import { forceclasses, ForceClassNames } from "./forces/AddForceClasses";
import { BounceForce } from "./forces/BounceForce";
import { DragForce } from "./forces/DragForce";
import { IForceClass } from "./forces/IForceClass";
import { ScaleInOutForce } from "./forces/ScaleInOut";
import { TurbulenceForce } from "./forces/TurbulenceForce";
import { VectorForce } from "./forces/VectorForce";
import { Particle } from "./Particle";
import { IOperator } from "./operators/IOperator";
import { IParticleSystemData } from "./IParticleSystemData";
import { IOperatorData } from "./operators/IOperatorData";
import { CurveViewportService } from "../../UI/curveeditor/CurveViewportService";



export class ControlParameters {
  sliders: Array<Slider> = [];
  name: String = "";
  id: number = 0;
}


export class FunctionWithTrigger {
  private fn: Function;
  public name = "";
  constructor(fn: Function, name: string) {
    this.fn = fn;
    this.name = name;
    //console.log("FunctionWithTrigger name" + this.name);
  }
  public run() {
    this.fn();
  }
}

export class ParticleParameterGroup {
  public particlesystems: ParticleSystem[] = [];
  constructor(particlesystems: ParticleSystem[]) {
    this.particlesystems = particlesystems;
  }

  getdata(): any {
    let particleparams: any[] = [];
    for (let p = 0; p < this.particlesystems.length; p++) {
      particleparams.push(this.particlesystems[p].getdata());
    }

    return particleparams;
  }
}

export class ParticleSystem {
  maxParticles: number = 0;
  Particles: Particle[] = [];
  public forceClasses: Array<IOperator> = new Array<IOperator>();
  public emitClasses: Array<IOperator> = new Array<IOperator>();

  // public emittersParameters: Array<ControlParameters> = [];
  // public forcesParameters: Array<ControlParameters> = [];
  //public addForces: Array<FunctionWithTrigger> = [];
  public name = "psystem";
  public forceclassnames!: ForceClassNames;
  private time = 0;
  private play = false;
  private loop = true;


  constructor(maxParticles: number) {
    this.maxParticles = maxParticles;
    this.initParticles();

  }

  public setTime(time: number){
    this.time = time;
  }

  public getTime(): number{
    return this.time;
  }

  public Play(){
    this.play = true;
  }

  public Stop(){
    this.play = false;
  }

  public AddForceClassesByKey(forcename: ForceClassNames) {
    var forceclass = new forceclasses[forcename]();
    this.forceClasses.push(forceclass);
  }

  private initParticles() {
    for (var p = 0; p < this.maxParticles; p++) {
      let particle = new Particle();
      particle.position.z = 100;
      particle.scale.set(0,0,0);
      particle.age = particle.maxAge + 1;
      this.Particles.push(particle);
    }
  }

  getdata(): IParticleSystemData {
    let forces: IOperatorData[] = [];
    for (let f = 0; f < this.GetForceClasses().length; f++) {
      forces.push(this.GetForceClasses()[f].getdata());
    }
    let emitters: IOperatorData[] = [];
    for (let e = 0; e < this.emitClasses.length; e++) {
      emitters.push(this.emitClasses[e].getdata());
    }
    let param: IParticleSystemData = { name: this.name, maxParticles: this.maxParticles, forcesdata: forces, emittersdata: emitters };
    return param;
  }


  public addForceClass(forceclass: IOperator) {
    this.forceClasses.push(forceclass);
  }

  public addEmitClass(emitClass: IOperator) {
    this.emitClasses.push(emitClass);
  }

  public GetParticles(): Particle[] {
    return this.Particles;
  }

  public GetEmitClasses(): IOperator[] {
    return this.emitClasses;
  }

  public GetForceClasses(): IOperator[] {
    return this.forceClasses;
  }

  public SimulateFrame() {

    if(this.play){
      this.time++;
      if(this.time > 200){
        this.time = 0;
      }
    }
    for (var p = 0; p < this.Particles.length; p++) {
      let particle = this.Particles[p];
      if (particle.age > particle.maxAge) {////try rebirth
        for (var e = 0; e < this.emitClasses.length; e++) {
          this.emitClasses[e].calculate(particle, p, this)
        }

      } else {////simulate
        for (var f = 0; f < this.forceClasses.length; f++) {
          this.forceClasses[f].calculate(particle, p, this);
        }
      }

      let newX = particle.position.x + particle.velocity.x;
      let newY = particle.position.y + particle.velocity.y;
      let newZ = particle.position.z + particle.velocity.z;
      particle.position.set(newX, newY, newZ);
      particle.age++;

    }
  }
}

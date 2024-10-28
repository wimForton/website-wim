import { Slider } from "../../UiComponentData/Slider";
import { EmitFromPoint } from "./emitters/EmitFromPoint";
import { IEmitClass } from "./emitters/IEmitClass";
import { classes, ForceClassNames } from "./forces/AddForceClasses";
import { BounceForce } from "./forces/BounceForce";
import { DragForce } from "./forces/DragForce";
import { IForceClass } from "./forces/IForceClass";
import { ScaleInOutForce } from "./forces/ScaleInOut";
import { TurbulenceForce } from "./forces/TurbulenceForce";
import { VectorForce } from "./forces/VectorForce";
import { Particle } from "./Particle";


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

  getparameterstosave(): any {
    let particleparams: any[] = [];
    for (let p = 0; p < this.particlesystems.length; p++) {
      particleparams.push(this.particlesystems[p].getparameterstosave());
    }
    return particleparams;
  }
}

export class ParticleSystem {
  maxParticles: number = 0;
  Particles: Particle[] = [];
  public forceClasses: Array<IForceClass> = new Array<IForceClass>();
  public emitClasses: Array<IEmitClass> = new Array<IEmitClass>();

  public emittersParameters: Array<ControlParameters> = [];
  public forcesParameters: Array<ControlParameters> = [];
  public addForces: Array<FunctionWithTrigger> = [];
  public name = "";
  public forceclassnames!: ForceClassNames;


  constructor(maxParticles: number) {
    this.maxParticles = maxParticles;
    this.initParticles();
    
    function addForceToArrays(this: ParticleSystem, force: IForceClass) {///this whole function becomes the function in FunctionWithTrigger
      const controlParameters = new ControlParameters()
      this.addForceClass(force);
      controlParameters.name = force.name;
      //controlParameters.sliders = force.sliders;
      controlParameters.id = this.forcesParameters.length;
      this.forcesParameters.push(controlParameters);
    }

    this.addForces.push(new FunctionWithTrigger(addForceToArrays.bind(this, new VectorForce()), "Vector Force"));
    this.addForces.push(new FunctionWithTrigger(addForceToArrays.bind(this, new DragForce()), "Drag Force"));
    this.addForces.push(new FunctionWithTrigger(addForceToArrays.bind(this, new TurbulenceForce()), "Turbulence Force"));
    this.addForces.push(new FunctionWithTrigger(addForceToArrays.bind(this, new BounceForce()), "Bounce Force"));
    this.addForces.push(new FunctionWithTrigger(addForceToArrays.bind(this, new ScaleInOutForce()), "Scale In Out"));
    
    this.addEmitClass(new EmitFromPoint());// todo: add this after creation
    for (var i = 0; i < this.GetEmitClasses().length; i++) {
      const controlParameters = new ControlParameters();
      controlParameters.name = this.GetEmitClasses()[i].name;
      controlParameters.sliders = this.GetEmitClasses()[i].sliders;
      controlParameters.id = i;
      this.emittersParameters.push(controlParameters);
    }
  }

  //public GetForceEnumKeys(): string[] {
  //  const enumKeys = Object.keys(this.forceclassnames);
  //  return enumKeys;
  //}

  public AddForceClassesByKey(forcename: ForceClassNames) {
    var forceclass = new classes[forcename]();
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

  getparameterstosave(): any {
    let forceparam: any[] = [];
    for (let f = 0; f < this.GetForceClasses().length; f++) {
      forceparam.push(this.GetForceClasses()[f].getparameterstosave());
    }
    let param = { name: this.name, maxParticles: this.maxParticles, forceparam: forceparam };
    return param;
  }

  public addForceClass(forceclass: IForceClass) {
    this.forceClasses.push(forceclass);
  }

  public addEmitClass(emitClass: IEmitClass) {
    this.emitClasses.push(emitClass);
  }

  public GetParticles(): Particle[] {
    return this.Particles;
  }

  public GetEmitClasses(): IEmitClass[] {
    return this.emitClasses;
  }

  public GetForceClasses(): IForceClass[] {
    return this.forceClasses;
  }

  public SimulateFrame() {
    for (var p = 0; p < this.Particles.length; p++) {
      let particle = this.Particles[p];
      if (particle.age > particle.maxAge) {////try rebirth
        for (var e = 0; e < this.emitClasses.length; e++) {
          this.emitClasses[e].emit(particle, p)
        }

      } else {////simulate
        for (var f = 0; f < this.forceClasses.length; f++) {
          this.forceClasses[f].calculate(particle, p);
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

import { Slider } from "../../../UiComponentData/Slider";
import { MinMaxRandomize, MinMaxRandomizeArray } from "../../Utils/particleUtils";
import { Vector3D } from "../../Utils/Vector3D";
import { Particle } from "../Particle";
import { ParticleSystem } from "../ParticleSystem";
import { KeyframeList } from "../propertytypes/keyframelist";
import { Parameter } from "../propertytypes/parameter";
import { IForceClass } from "./IForceClass";




export class BounceForce implements IForceClass {
  public name = "Bounce Force";
  //public sliders: Slider[] = [];

  public value1: number = -1;
  public value2 = 0;
  public value3 = 0;
  public value4 = 0;

  public parameters: Parameter[] = [];
  public transforms: Parameter[] = [];
  private floorlevel = new Parameter(new KeyframeList(-1, "Floor level"), "Floor level");
  private roughnessX = new Parameter(new KeyframeList(0, "Roughness X"), "Roughness X");
  private roughnessZ = new Parameter(new KeyframeList(0, "Roughness Z"), "Roughness Z");
  private Damping = new Parameter(new KeyframeList(0, "Damping"), "Damping");


  constructor() {
    this.floorlevel.setSliderSettings(false,-5,5,true,0.01,true);
    this.roughnessX.setSliderSettings(false,0,2,true,0.01,true);
    this.roughnessZ.setSliderSettings(false,0,2,true,0.01,true);
    this.Damping.setSliderSettings(false,0,1,true,0.01,true);
    this.parameters.push(this.floorlevel);
    this.parameters.push(this.roughnessX);
    this.parameters.push(this.roughnessZ);
    this.parameters.push(this.Damping);
  }
  


  getparameterstosave(): any {
    let param = { name: this.name, value1: this.value1, value2: this.value2, value3: this.value3, value4: this.value4, };
    return param;
  }

  calculate(p: Particle, i: number, particlesystem: ParticleSystem): void {
    let time = particlesystem.getTime();
    if (p.position.y < this.floorlevel.getValueAtTime(time)) {
      let randomVecX = MinMaxRandomize(this.roughnessX.getValueAtTime(time) * -1, this.roughnessX.getValueAtTime(time));
      let randomVecY = MinMaxRandomize(this.roughnessZ.getValueAtTime(time) * -1, this.roughnessZ.getValueAtTime(time));
      p.velocity.addVec(new Vector3D(randomVecX, 0, randomVecY));
      p.velocity.multVec(new Vector3D(1 - this.Damping.getValueAtTime(time), (-1 + this.Damping.getValueAtTime(time)), 1 - this.Damping.getValueAtTime(time)));
      p.position.set(p.position.x, this.floorlevel.getValueAtTime(time) + 0.001, p.position.z);
    }

  }
}

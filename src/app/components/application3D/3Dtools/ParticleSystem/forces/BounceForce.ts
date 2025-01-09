import { Slider } from "../../../UiComponentData/Slider";
import { MinMaxRandomize, MinMaxRandomizeArray } from "../../Utils/particleUtils";
import { Vector3D } from "../../Utils/Vector3D";
import { IOperator } from "../operators/IOperator";
import { Operator } from "../operators/Operator";
import { Particle } from "../Particle";
import { ParticleSystem } from "../ParticleSystem";
import { KeyframeList } from "../propertytypes/keyframelist";
import { Parameter } from "../propertytypes/parameter";
import { ParameterGroup } from "../propertytypes/ParameterGroup";
import { IForceClass } from "./IForceClass";




export class BounceForce extends Operator implements IOperator {
  public override name = "Bounce Force";



  public parameters: Parameter[] = [];
  public transforms: Parameter[] = [];
  private floorlevel = new Parameter(new KeyframeList(-1, "Floor level"), "Floor level");
  private roughnessX = new Parameter(new KeyframeList(0, "Roughness X"), "Roughness X");
  private roughnessZ = new Parameter(new KeyframeList(0, "Roughness Z"), "Roughness Z");
  private Damping = new Parameter(new KeyframeList(0, "Damping"), "Damping");


  constructor() {
    super();
    this.floorlevel.setSliderSettings(false,-5,5,true,0.01,true);
    this.roughnessX.setSliderSettings(false,0,2,true,0.01,true);
    this.roughnessZ.setSliderSettings(false,0,2,true,0.01,true);
    this.Damping.setSliderSettings(false,0,1,true,0.01,true);
    // this.parameters.push(this.floorlevel);
    // this.parameters.push(this.roughnessX);
    // this.parameters.push(this.roughnessZ);
    // this.parameters.push(this.Damping);

    let propertygroup = new ParameterGroup("properties");
    propertygroup.parameters.push(this.floorlevel);
    propertygroup.parameters.push(this.roughnessX);
    propertygroup.parameters.push(this.roughnessZ);
    propertygroup.parameters.push(this.Damping);

    this.parametergroups.push(propertygroup);
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

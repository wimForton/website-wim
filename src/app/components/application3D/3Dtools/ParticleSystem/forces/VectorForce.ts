import { Slider } from "../../../UiComponentData/Slider";
import { Vector3D } from "../../Utils/Vector3D";
import { IOperator } from "../operators/IOperator";
import { Operator } from "../operators/Operator";
import { Particle } from "../Particle";
import { ParticleSystem } from "../ParticleSystem";
import { KeyframeList } from "../propertytypes/keyframelist";
import { Parameter } from "../propertytypes/parameter";
import { ParameterGroup } from "../propertytypes/ParameterGroup";




export class VectorForce extends Operator implements IOperator {

  public override name = "VectorForce";
  //public sliders: Slider[] = [];

  public value1 = new Parameter(new KeyframeList(0.0, "strength x"), "strength x");
  public value2 = new Parameter(new KeyframeList(-0.1, "strength y"), "strength y");
  public value3 = new Parameter(new KeyframeList(0.0, "strength z"), "strength z");
  public value4 = new Parameter(new KeyframeList(0.1, "strength scale"), "strength scale");
  public testbool = new Parameter(true, "testcheckbox");
  public parameters: Parameter[] = [];
  public transforms: Parameter[] = [];

  constructor() {
    super();
    this.value1.setSliderSettings(false,-1,1,true,0.01,true);
    this.value2.setSliderSettings(false,-1,1,true,0.01,true);
    this.value3.setSliderSettings(false,-1,1,true,0.01,true);
    this.value4.setSliderSettings(false,0,1,true,0.01,true);

    let propertygroup = new ParameterGroup("properties");
    propertygroup.parameters.push(this.value1);
    propertygroup.parameters.push(this.value2);
    propertygroup.parameters.push(this.value3);
    propertygroup.parameters.push(this.value4);
    propertygroup.parameters.push(this.testbool);

    this.parametergroups.push(propertygroup);
  }

  calculate(p: Particle, i: number, particlesystem: ParticleSystem): void {
    let time = particlesystem.getTime();
    let forceVector: Vector3D = new Vector3D(this.value1.getValueAtTime(time), this.value2.getValueAtTime(time), this.value3.getValueAtTime(time));
    forceVector.multNumber(this.value4.getValueAtTime(time))
    p.velocity.addVec(forceVector);
  }
}

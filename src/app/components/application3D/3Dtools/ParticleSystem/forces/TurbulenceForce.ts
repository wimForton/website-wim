import { Slider } from "../../../UiComponentData/Slider";
import { noise } from "../../Utils/noise";
import { Vector3D } from "../../Utils/Vector3D";
import { IOperator } from "../operators/IOperator";
import { Operator } from "../operators/Operator";
import { Particle } from "../Particle";
import { ParticleSystem } from "../ParticleSystem";
import { KeyframeList } from "../propertytypes/keyframelist";
import { Parameter } from "../propertytypes/parameter";
import { ParameterGroup } from "../propertytypes/ParameterGroup";
import { IForceClass } from "./IForceClass";




export class TurbulenceForce extends Operator implements IOperator {

  public override name = "TurbulenceForce";
  //public sliders: Slider[] = [];

  public value1 = new Parameter(new KeyframeList(0.5, "strength x"), "strength x");
  public value2 = new Parameter(new KeyframeList(0.5, "strength y"), "strength y");
  public value3 = new Parameter(new KeyframeList(0.5, "strength z"), "strength z");
  public value4 = new Parameter(new KeyframeList(0.1, "strength scale"), "strength scale");
  public value5 = new Parameter(new KeyframeList(0.1, "density"), "density");

  private noiseX?: noise;
  private noiseY?: noise;
  private noiseZ?: noise;
  private offsetMove = 0;
  public parameters: Parameter[] = [];
  public transforms: Parameter[] = [];

  constructor() {
    super();
    this.noiseX = new noise(20);
    this.noiseY = new noise(20);
    this.noiseZ = new noise(20);

    this.value1.setSliderSettings(false,0,1,true,0.01,true);
    this.value2.setSliderSettings(false,0,1,true,0.01,true);
    this.value3.setSliderSettings(false,0,1,true,0.01,true);
    this.value4.setSliderSettings(false,0,1,true,0.01,true);
    this.value5.setSliderSettings(false,0,1,true,0.01,true);

    let propertygroup = new ParameterGroup("properties");
    propertygroup.parameters.push(this.value1);
    propertygroup.parameters.push(this.value2);
    propertygroup.parameters.push(this.value3);
    propertygroup.parameters.push(this.value4);
    propertygroup.parameters.push(this.value5);

    this.parametergroups.push(propertygroup);
  }

  calculate(p: Particle, i: number, particlesystem: ParticleSystem): void {
    let time = particlesystem.getTime();
    let lutPos = new Vector3D(p.position.x, p.position.y, p.position.z);
    lutPos.multNumber(this.value5.getValueAtTime(time));
    this.offsetMove += 0.0001;
    lutPos.addVec(new Vector3D(0, this.offsetMove, 0));
    let nx = (this.noiseX!.noise(lutPos.x + 1, lutPos.y, lutPos.z) - 0.5) * this.value1.getValueAtTime(time) * this.value4.getValueAtTime(time);
    let ny = (this.noiseY!.noise(lutPos.x + 0.5, lutPos.y, lutPos.z) - 0.5) * this.value2.getValueAtTime(time) * this.value4.getValueAtTime(time);
    let nz = (this.noiseZ!.noise(lutPos.x + 1, lutPos.y, lutPos.z) - 0.5) * this.value3.getValueAtTime(time) * this.value4.getValueAtTime(time);

    p.velocity.addVec(new Vector3D(nx, ny, nz));
  }
}

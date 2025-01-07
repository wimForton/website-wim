import { Slider } from "../../../UiComponentData/Slider";
import { noise } from "../../Utils/noise";
import { Vector3D } from "../../Utils/Vector3D";
import { IOperator } from "../operators/IOperator";
import { Operator } from "../operators/Operator";
import { Particle } from "../Particle";
import { Parameter } from "../propertytypes/parameter";
import { IForceClass } from "./IForceClass";




export class TurbulenceForce extends Operator implements IOperator {

  public override name = "Turbulence Force";
  //public sliders: Slider[] = [];

  public value1 = 0.5;
  public value2 = 0.5;
  public value3 = 0.5;
  public value4 = 0.1;
  public value5 = 0.1;

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
  }

  calculate(p: Particle, i: number): void {
    let lutPos = new Vector3D(p.position.x, p.position.y, p.position.z);
    lutPos.multNumber(this.value5);
    this.offsetMove += 0.0001;
    lutPos.addVec(new Vector3D(0, this.offsetMove, 0));
    let nx = (this.noiseX!.noise(lutPos.x + 1, lutPos.y, lutPos.z) - 0.5) * this.value1 * this.value4;
    let ny = (this.noiseY!.noise(lutPos.x + 0.5, lutPos.y, lutPos.z) - 0.5) * this.value2 * this.value4;
    let nz = (this.noiseZ!.noise(lutPos.x + 1, lutPos.y, lutPos.z) - 0.5) * this.value3 * this.value4;

    p.velocity.addVec(new Vector3D(nx, ny, nz));
  }
}

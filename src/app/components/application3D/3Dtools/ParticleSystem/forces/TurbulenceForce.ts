import { Slider } from "../../../UiComponentData/Slider";
import { noise } from "../../Utils/noise";
import { Vector3D } from "../../Utils/Vector3D";
import { Particle } from "../Particle";
import { IForceClass } from "./IForceClass";




export class TurbulenceForce implements IForceClass {

  public name = "Turbulence Force";
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
  constructor() {
    this.noiseX = new noise(20);
    this.noiseY = new noise(20);
    this.noiseZ = new noise(20);
  }

  getparameterstosave(): any {
    let param = { name: this.name, value1: this.value1, value2: this.value2, value3: this.value3, value4: this.value4, value5: this.value5, };
    return param;
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

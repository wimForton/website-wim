import { Slider } from "../../../UiComponentData/Slider";
import { Vector3D } from "../../Utils/Vector3D";
import { Particle } from "../Particle";
import { IForceClass } from "./IForceClass";




export class VectorForce implements IForceClass {
  public name = "Vector Force";
  //public sliders: Slider[] = [];

  public value1 = 0;
  public value2 = -0.1;
  public value3 = 0;
  public value4 = 0.1;
  public testbool = true;


  getparameterstosave(): any {
    let param = { name: this.name, value1: this.value1, value2: this.value2, value3: this.value3, value4: this.value4, };
    return param;
  }

  calculate(p: Particle, i: number): void {
    let forceVector: Vector3D = new Vector3D(this.value1, this.value2, this.value3);
    forceVector.multNumber(this.value4)
    p.velocity.addVec(forceVector);
  }
}

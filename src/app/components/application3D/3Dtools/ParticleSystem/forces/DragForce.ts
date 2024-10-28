import { Slider } from "../../../UiComponentData/Slider";
import { Particle } from "../Particle";
import { IForceClass } from "./IForceClass";




export class DragForce implements IForceClass {
  public name = "Drag Force";

  public value1 = 0;
  public value2 = 0;


  getparameterstosave(): any {
    let param = { name: this.name, value1: this.value1, value2: this.value2 };
    return param;
  }

  calculate(p: Particle, i: number): void {
    let scaleBy = 1 - this.value1 * this.value2;// was this.slider1.value

    p.velocity.multNumber(scaleBy);
  }
}

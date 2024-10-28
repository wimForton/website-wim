import { Slider } from "../../../UiComponentData/Slider";
import { MinMaxRandomize, MinMaxRandomizeArray } from "../../Utils/particleUtils";
import { Vector3D } from "../../Utils/Vector3D";
import { Particle } from "../Particle";
import { IForceClass } from "./IForceClass";




export class BounceForce implements IForceClass {
  public name = "Bounce Force";
  //public sliders: Slider[] = [];

  public value1: number = -1;
  public value2 = 0;
  public value3 = 0;
  public value4 = 0;


  getparameterstosave(): any {
    let param = { name: this.name, value1: this.value1, value2: this.value2, value3: this.value3, value4: this.value4, };
    return param;
  }

  calculate(p: Particle, i: number): void {
    if (p.position.y < this.value1) {
      let randomVecX = MinMaxRandomize(this.value2 * -1, this.value2);
      let randomVecY = MinMaxRandomize(this.value3 * -1, this.value3);
      p.velocity.addVec(new Vector3D(randomVecX, 0, randomVecY));
      p.velocity.multVec(new Vector3D(1 - this.value4, (-1 + this.value4), 1 - this.value4));
      p.position.set(p.position.x, this.value1 + 0.001, p.position.z);
    }

  }
}

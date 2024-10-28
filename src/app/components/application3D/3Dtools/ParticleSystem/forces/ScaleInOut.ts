import { Slider } from "../../../UiComponentData/Slider";
import { lerpVector3D } from "../../Utils/particleUtils";
import { Vector3D } from "../../Utils/Vector3D";
import { Particle } from "../Particle";
import { IForceClass } from "./IForceClass";




export class ScaleInOutForce implements IForceClass {
  public name = "Scale In Out Force";
  //public sliders: Slider[] = [];
  public value1 = 0;
  public value2 = 0;
  public value3 = 0;
  public value4 = 0;


  getparameterstosave(): any {
    let param = { name: this.name, value1: this.value1, value2: this.value2, value3: this.value3, value4: this.value4, };
    return param;
  }

  calculate(p: Particle, i: number): void {
    if (p.maxAge != 0 && this.value1 != 0 && this.value2 != 1) {
      let ageNormalized = p.age / p.maxAge;
      let EaseInWeight = Math.min((ageNormalized / this.value1), 1);
      let EaseInFrom = new Vector3D(1, 1, 1);
      EaseInFrom.multNumber(this.value3)
      let easeInScale = lerpVector3D(EaseInFrom, p.startscale, EaseInWeight);

      let EaseOutTo = new Vector3D(1, 1, 1);
      EaseOutTo.multNumber(this.value4);
      let EaseOutWeight = Math.max((ageNormalized - this.value2), 0) / (1 - this.value2);
      let easeInOutScale = lerpVector3D(easeInScale , EaseOutTo, EaseOutWeight);

      p.scale = easeInOutScale;
    }
    //   (startsc = 0.4)   tussen 0 en 0.4                             0.4
    //  Math.max((ageNormalized - this.slider1.value), 0) / (1 - this.slider1.value))   = tussen 0 en 1
  }
}

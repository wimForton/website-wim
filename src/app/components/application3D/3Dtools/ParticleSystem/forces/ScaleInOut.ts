import { Slider } from "../../../UiComponentData/Slider";
import { lerpVector3D } from "../../Utils/particleUtils";
import { Vector3D } from "../../Utils/Vector3D";
import { IOperator } from "../operators/IOperator";
import { Operator } from "../operators/Operator";
import { Particle } from "../Particle";
import { ParticleSystem } from "../ParticleSystem";
import { Parameter } from "../propertytypes/parameter";
import { IForceClass } from "./IForceClass";




export class ScaleInOutForce extends Operator implements IOperator {

  public override name = "Scale In Out Force";
  //public sliders: Slider[] = [];
  public value1 = 0;
  public value2 = 0;
  public value3 = 0;
  public value4 = 0;
  public parameters: Parameter[] = [];
  public transforms: Parameter[] = [];



  calculate(p: Particle, i: number, particlesystem: ParticleSystem): void {
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
  }
}

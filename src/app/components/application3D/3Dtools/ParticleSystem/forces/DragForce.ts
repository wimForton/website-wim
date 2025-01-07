import { Slider } from "../../../UiComponentData/Slider";
import { IOperator } from "../operators/IOperator";
import { Operator } from "../operators/Operator";
import { Particle } from "../Particle";
import { ParticleSystem } from "../ParticleSystem";
import { Parameter } from "../propertytypes/parameter";
import { IForceClass } from "./IForceClass";




export class DragForce extends Operator implements IOperator {

  public override name = "Drag Force";

  public value1 = 0.1;
  public value2 = 0.1;
  public parameters: Parameter[] = [];
  public transforms: Parameter[] = [];

  calculate(p: Particle, i: number, particlesystem: ParticleSystem): void {
    let scaleBy = 1 - this.value1 * this.value2;// was this.slider1.value

    p.velocity.multNumber(scaleBy);
  }
}

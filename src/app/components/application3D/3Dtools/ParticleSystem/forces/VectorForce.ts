import { Slider } from "../../../UiComponentData/Slider";
import { Vector3D } from "../../Utils/Vector3D";
import { IOperator } from "../operators/IOperator";
import { Operator } from "../operators/Operator";
import { Particle } from "../Particle";
import { Parameter } from "../propertytypes/parameter";




export class VectorForce extends Operator implements IOperator {

  public override name = "Vector Force";
  //public sliders: Slider[] = [];

  public value1 = 0;
  public value2 = -0.1;
  public value3 = 0;
  public value4 = 0.1;
  public testbool = true;
  public parameters: Parameter[] = [];
  public transforms: Parameter[] = [];

  calculate(p: Particle, i: number): void {
    let forceVector: Vector3D = new Vector3D(this.value1, this.value2, this.value3);
    forceVector.multNumber(this.value4)
    p.velocity.addVec(forceVector);
  }
}

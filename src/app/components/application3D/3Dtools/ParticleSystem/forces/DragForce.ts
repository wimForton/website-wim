import { Slider } from "../../../UiComponentData/Slider";
import { IOperator } from "../operators/IOperator";
import { Operator } from "../operators/Operator";
import { Particle } from "../Particle";
import { ParticleSystem } from "../ParticleSystem";
import { KeyframeList } from "../propertytypes/keyframelist";
import { Parameter } from "../propertytypes/parameter";
import { ParameterGroup } from "../propertytypes/ParameterGroup";
import { IForceClass } from "./IForceClass";




export class DragForce extends Operator implements IOperator {

  public override name = "Drag Force";

  public strength = new Parameter(new KeyframeList(0.1, "Strength"), "Strength");
  public strengthscale = new Parameter(new KeyframeList(0.1, "Strength scale"), "Strength scale");
  public parameters: Parameter[] = [];
  public transforms: Parameter[] = [];

    constructor() {
      super();
      this.strength.setSliderSettings(false,0,1,true,0.01,true);
      this.strengthscale.setSliderSettings(false,0,1,true,0.01,true);
  
      let propertygroup = new ParameterGroup("properties");
      propertygroup.parameters.push(this.strength);
      propertygroup.parameters.push(this.strengthscale);
  
      this.parametergroups.push(propertygroup);
    }

  calculate(p: Particle, i: number, particlesystem: ParticleSystem): void {
    let time = particlesystem.getTime();
    let scaleBy = 1 - this.strength.getValueAtTime(time) * this.strengthscale.getValueAtTime(time);// was this.slider1.value

    p.velocity.multNumber(scaleBy);
  }
}

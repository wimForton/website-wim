import { Slider } from "../../../UiComponentData/Slider";
import { lerpVector3D } from "../../Utils/particleUtils";
import { Vector3D } from "../../Utils/Vector3D";
import { IOperator } from "../operators/IOperator";
import { Operator } from "../operators/Operator";
import { Particle } from "../Particle";
import { ParticleSystem } from "../ParticleSystem";
import { KeyframeList } from "../propertytypes/keyframelist";
import { Parameter } from "../propertytypes/parameter";
import { ParameterGroup } from "../propertytypes/ParameterGroup";
import { IForceClass } from "./IForceClass";




export class ScaleInOutForce extends Operator implements IOperator {

  public override name = "Scale In Out Force";
  //public sliders: Slider[] = [];
  public value1 = new Parameter(new KeyframeList(0.1, "scalein end"), "scalein end");
  public value2 = new Parameter(new KeyframeList(0.1, "scaleout start"), "scaleout start");
  public value3 = new Parameter(new KeyframeList(0.1, "start scale"), "start scale");
  public value4 = new Parameter(new KeyframeList(0.1, "end scale"), "end scale");
  public parameters: Parameter[] = [];
  public transforms: Parameter[] = [];

    constructor() {
      super();
      this.value1.setSliderSettings(false,-5,5,true,0.01,true);
      this.value2.setSliderSettings(false,0,2,true,0.01,true);
      this.value3.setSliderSettings(false,0,2,true,0.01,true);
      this.value4.setSliderSettings(false,0,1,true,0.01,true);
      // this.parameters.push(this.floorlevel);
      // this.parameters.push(this.roughnessX);
      // this.parameters.push(this.roughnessZ);
      // this.parameters.push(this.Damping);
  
      let propertygroup = new ParameterGroup("properties");
      propertygroup.parameters.push(this.value1);
      propertygroup.parameters.push(this.value2);
      propertygroup.parameters.push(this.value3);
      propertygroup.parameters.push(this.value4);
  
      this.parametergroups.push(propertygroup);
    }


  calculate(p: Particle, i: number, particlesystem: ParticleSystem): void {
    let time = particlesystem.getTime();
    if (p.maxAge != 0 && this.value1.getValueAtTime(time) != 0 && this.value2.getValueAtTime(time) != 1) {
      let ageNormalized = p.age / p.maxAge;
      let EaseInWeight = Math.min((ageNormalized / this.value1.getValueAtTime(time)), 1);
      let EaseInFrom = new Vector3D(1, 1, 1);
      EaseInFrom.multNumber(this.value3.getValueAtTime(time))
      let easeInScale = lerpVector3D(EaseInFrom, p.startscale, EaseInWeight);

      let EaseOutTo = new Vector3D(1, 1, 1);
      EaseOutTo.multNumber(this.value4.getValueAtTime(time));
      let EaseOutWeight = Math.max((ageNormalized - this.value2.getValueAtTime(time)), 0) / (1 - this.value2.getValueAtTime(time));
      let easeInOutScale = lerpVector3D(easeInScale , EaseOutTo, EaseOutWeight);

      p.scale = easeInOutScale;
    }
  }
}

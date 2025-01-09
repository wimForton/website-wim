import { Slider } from "../../../UiComponentData/Slider";
import { MinMaxRandomize, MinMaxRandomizeArray } from "../../Utils/particleUtils";
import { Particle } from "../Particle";
import { ParticleSystem } from "../ParticleSystem";
import { KeyframeList } from "../propertytypes/keyframelist";
import { Parameter } from "../propertytypes/parameter";
import { ParameterGroup } from "../propertytypes/ParameterGroup";
import { IEmitClass } from "./IEmitClass";
import { IOperator } from "./IOperator";
import { Operator } from "./Operator";

export enum EmitFromPointParam {
  BounceForce = "radial speed",
  Amount = "Amount",
  Lifespan = "Lifespan", 
  TurbulenceForce = "Direction X",
  VectorForce = "Direction Y",
}

export class EmitFromPoint extends Operator implements IOperator{
  public override name = "EmitFromPoint";
  public override displayname = "Emit From Point";

  private radialspeed = new Parameter(new KeyframeList(10, "radial speed"), "radial speed");
  private Amount = new Parameter(new KeyframeList(0.5, "Amount"), "Amount");
  private Lifespan = new Parameter(new KeyframeList(80, "Lifespan"), "Lifespan");
  private DirectionX = new Parameter(new KeyframeList(0, "Direction X"), "Direction X");
  private DirectionY = new Parameter(new KeyframeList(0, "Direction Y"), "Direction Y");
  private DirectionZ = new Parameter(new KeyframeList(0, "Direction Z"), "Direction Z");
  private sizemin = new Parameter(new KeyframeList(0.2, "Min size"), "Min size");
  private sizemax = new Parameter(new KeyframeList(4, "Max size"), "Max size");

  public parameters: Parameter[] = [];
  public transforms: Parameter[] = [];
  private emitposx = new Parameter(new KeyframeList(0, "Position X"), "Position X");
  private emitposy = new Parameter(new KeyframeList(0, "Position Y"), "Position Y");
  private emitposz = new Parameter(new KeyframeList(0, "Position Z"), "Position Z");

  constructor() {
    super();
    this.radialspeed.setSliderSettings(false,0,100,true,0.01,true);
    this.Amount.setSliderSettings(false,0,100,true,0.01,true);
    this.Lifespan.setSliderSettings(false,0,100,true,0.01,true);
    this.DirectionX.setSliderSettings(false,-1,1,true,0.01,true);
    this.DirectionY.setSliderSettings(false,-1,1,true,0.01,true);
    this.DirectionZ.setSliderSettings(false,-1,1,true,0.01,true);
    this.sizemin.setSliderSettings(false,0,10,true,0.01,true);
    this.sizemax.setSliderSettings(false,0,10,true,0.01,true);

    // this.radialspeed.getKeyframeList().AddKeyframe(200,10);
    // this.Amount.getKeyframeList().AddKeyframe(200,0.5);
    // this.Lifespan.getKeyframeList().AddKeyframe(200,80);
    // this.DirectionX.getKeyframeList().AddKeyframe(200,0);
    // this.DirectionY.getKeyframeList().AddKeyframe(200,0);
    // this.DirectionZ.getKeyframeList().AddKeyframe(200,0);
    // this.sizemin.getKeyframeList().AddKeyframe(200,0.2);
    // this.sizemax.getKeyframeList().AddKeyframe(200,4);
    let parametersgroup = new ParameterGroup("properties");
    parametersgroup.parameters.push(this.radialspeed);
    parametersgroup.parameters.push(this.Amount);
    parametersgroup.parameters.push(this.Lifespan);
    parametersgroup.parameters.push(this.DirectionX);
    parametersgroup.parameters.push(this.DirectionY);
    parametersgroup.parameters.push(this.DirectionZ);
    parametersgroup.parameters.push(this.sizemin);
    parametersgroup.parameters.push(this.sizemax);
    this.parametergroups.push(parametersgroup);

    let transformsgroup = new ParameterGroup("transforms");

    
    transformsgroup.parameters.push(this.emitposx);
    transformsgroup.parameters.push(this.emitposy);
    transformsgroup.parameters.push(this.emitposz);
    this.parametergroups.push(transformsgroup);

  }

  calculate(p: Particle, i: number, particlesystem: ParticleSystem): void {

    p.position.z = 100;
    p.scale.set(0,0,0);
    let time = particlesystem.getTime();
    if (MinMaxRandomize(0, 20) < this.Amount.getValueAtTime(time)) {
      let emitx = this.emitposx.getValueAtTime(time);
      let emity = this.emitposy.getValueAtTime(time);
      let emitz = this.emitposz.getValueAtTime(time);
      let size = MinMaxRandomize(this.sizemin.getValueAtTime(time), this.sizemax.getValueAtTime(time));
      let color: number[] = MinMaxRandomizeArray([0, 0, 0], [1, 1, 1]);
      p.color.set(color[0], color[1], color[2]);
      p.scale.set(size, size, size);
      p.startscale.set(size, size, size);
      p.position.set(emitx, emity, emitz);//(p.position.x, p.position.y, p.position.z)
      let min = -0.01 * this.radialspeed.getValueAtTime(time);//this.sliders[0].value;
      let max = 0.01 * this.radialspeed.getValueAtTime(time);
      let randomvelocity: number[] = MinMaxRandomizeArray([min, min, min], [max, max, max])
      p.velocity.set(randomvelocity[0] + this.DirectionX.getValueAtTime(time), randomvelocity[1] + this.DirectionY.getValueAtTime(time), randomvelocity[2] + this.DirectionZ.getValueAtTime(time));
      p.age = 0;
      p.textureindex = Math.floor(MinMaxRandomize(0,10));
    }
      p.maxAge = this.Lifespan.getValueAtTime(time);
   }

}



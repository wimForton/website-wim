import { Slider } from "../../../UiComponentData/Slider";
import { MinMaxRandomize, MinMaxRandomizeArray } from "../../Utils/particleUtils";
import { Particle } from "../Particle";
import { ParticleSystem } from "../ParticleSystem";
import { KeyframeList } from "../propertytypes/keyframelist";
import { Parameter } from "../propertytypes/parameter";
import { IEmitClass } from "./IEmitClass";

export enum EmitFromPointParam {
  BounceForce = "radial speed",
  Amount = "Amount",
  Lifespan = "Lifespan", 
  TurbulenceForce = "Direction X",
  VectorForce = "Direction Y",
}

export class EmitFromPoint implements IEmitClass{
  public name = "Emit From Point";
  public sliders: Slider[] = [];

  public parameters: Parameter[] = [];
  private radialspeed = new Parameter(new KeyframeList(10, "radial speed"), "radial speed");
  private Amount = new Parameter(new KeyframeList(0.5, "Amount"), "Amount");
  private Lifespan = new Parameter(new KeyframeList(80, "Lifespan"), "Lifespan");
  private DirectionX = new Parameter(new KeyframeList(0, "Direction X"), "Direction X");
  private DirectionY = new Parameter(new KeyframeList(0, "Direction Y"), "Direction Y");
  private DirectionZ = new Parameter(new KeyframeList(0, "Direction Z"), "Direction Z");
  private sizemin = new Parameter(new KeyframeList(0.2, "Min size"), "Min size");
  private sizemax = new Parameter(new KeyframeList(4, "Max size"), "Max size");


  public transforms: Parameter[] = [];
  private emitposx = new Parameter(new KeyframeList(0, "Position X"), "Position X");
  private emitposy = new Parameter(new KeyframeList(0, "Position Y"), "Position Y");
  private emitposz = new Parameter(new KeyframeList(0, "Position Z"), "Position Z");

  constructor() {
    this.radialspeed.setSliderSettings(false,0,100,true,0.01,true);
    this.Amount.setSliderSettings(false,0,100,true,0.01,true);
    this.Lifespan.setSliderSettings(false,0,100,true,0.01,true);
    this.DirectionX.setSliderSettings(false,-1,1,true,0.01,true);
    this.DirectionY.setSliderSettings(false,-1,1,true,0.01,true);
    this.DirectionZ.setSliderSettings(false,-1,1,true,0.01,true);
    this.sizemin.setSliderSettings(false,0,10,true,0.01,true);
    this.sizemax.setSliderSettings(false,0,10,true,0.01,true);

    this.radialspeed.getKeyframeList().AddKeyframe(200,10);
    this.Amount.getKeyframeList().AddKeyframe(200,0.5);
    this.Lifespan.getKeyframeList().AddKeyframe(200,80);
    this.DirectionX.getKeyframeList().AddKeyframe(200,0);
    this.DirectionY.getKeyframeList().AddKeyframe(200,0);
    this.DirectionZ.getKeyframeList().AddKeyframe(200,0);
    this.sizemin.getKeyframeList().AddKeyframe(200,0.2);
    this.sizemax.getKeyframeList().AddKeyframe(200,4);
    this.parameters.push(this.radialspeed);
    this.parameters.push(this.Amount);
    this.parameters.push(this.Lifespan);
    this.parameters.push(this.DirectionX);
    this.parameters.push(this.DirectionY);
    this.parameters.push(this.DirectionZ);
    this.parameters.push(this.sizemin);
    this.parameters.push(this.sizemax);
    


    for (let index = 0; index < this.parameters.length; index++) {
      console.log(this.parameters[index].type);
    }

    //this.CreateTestCurve(this.emitposy.getKeyframeList());
    this.transforms.push(this.emitposx);
    this.transforms.push(this.emitposy);
    this.transforms.push(this.emitposz);

  }
  public getdata(): any {
    let param: any[] = [];
    for (let index = 0; index < this.parameters.length; index++) {
      const p = this.parameters[index];
      param.push(p.getdata());
    }
    let trans: any[] = [];
    for (let index = 0; index < this.transforms.length; index++) {
      const t = this.transforms[index];
      trans.push(t.getdata());
    }

    let data = { name: this.name, parameters: param, transforms: trans};
    return data;
  }

  public setdata(data: any){
    //console.log("emitfrompointsetdata: ", data);
    for (let index = 0; index < data.parameters.length; index++) {
      const parameter = data.parameters[index];
      console.log("emitfrompoint parameters: ", parameter);
      this.parameters[index].setdata(parameter);
    }
    for (let index = 0; index < data.transforms.length; index++) {
      const transform = data.transforms[index];
      this.transforms[index].setdata(transform);
    }
    console.log("radialspeed: ", this.radialspeed.getKeyframeList().keyframes);
    
  }

  emit(p: Particle, i: number, particlesystem: ParticleSystem): void {

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
   CreateTestCurve(keyframelist: KeyframeList){
    keyframelist.AddKeyframe(0,0,-1,2,1,6);
    keyframelist.AddKeyframe(20,10,-2,6,1,2);
    keyframelist.AddKeyframe(30,0,-2,2,1,2);
    keyframelist.AddKeyframe(40,10,-2,2,1,2);
    keyframelist.AddKeyframe(50,0,-2,3,1,2);
    keyframelist.AddKeyframe(60,10,-1,3,1,-3);
    keyframelist.AddKeyframe(200,0,-2,0,1,2);
    //console.log("keyframes:", this.keyframelist.keyframes);
    }
}



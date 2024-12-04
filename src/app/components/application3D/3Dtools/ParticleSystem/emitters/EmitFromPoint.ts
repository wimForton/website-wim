import { Slider } from "../../../UiComponentData/Slider";
import { MinMaxRandomize, MinMaxRandomizeArray } from "../../Utils/particleUtils";
import { Particle } from "../Particle";
import { ParticleSystem } from "../ParticleSystem";
import { KeyframeList } from "../propertytypes/keyframelist";
import { IEmitClass } from "./IEmitClass";





export class EmitFromPoint implements IEmitClass{
  public name = "Emit From Point";
  public sliders: Slider[] = [];

  public transforms: KeyframeList[] = [];
  private emitposx: KeyframeList = new KeyframeList();
  private emitposy: KeyframeList = new KeyframeList();
  private emitposz: KeyframeList = new KeyframeList();

  constructor() {
    this.CreateTestCurve(this.emitposx);
    this.transforms.push(this.emitposx);
    this.transforms.push(this.emitposy);
    this.transforms.push(this.emitposz);
    let slider = new Slider();
    slider.label = "Radial Speed";
    slider.min = 0;
    slider.max = 100;
    slider.value = 10;
    this.sliders.push(slider);
    let slider1 = new Slider();
    slider1.label = "Amount";
    slider1.min = 0;
    slider1.max = 10;
    slider1.value = 0.5;
    this.sliders.push(slider1);
    let slider2 = new Slider();
    slider2.label = "Lifespan";
    slider2.min = 0;
    slider2.max = 200;
    slider2.value = 80;
    this.sliders.push(slider2);
    let slider3 = new Slider();
    slider3.label = "Direction X";
    slider3.min = -1;
    slider3.max = 1;
    slider3.value = 0;
    this.sliders.push(slider3);
    let slider4 = new Slider();
    slider4.label = "Direction Y";
    slider4.min = -1;
    slider4.max = 1;
    slider4.value = 0.25;
    this.sliders.push(slider4);
    let slider5 = new Slider();
    slider5.label = "Min Size";
    slider5.min = 0;
    slider5.max = 2;
    slider5.value = 0.2;
    this.sliders.push(slider5);
    let slider6 = new Slider();
    slider6.label = "Max Size";
    slider6.min = 0;
    slider6.max = 4;
    slider6.value = 2;
    this.sliders.push(slider6);

  }
  getparameterstosave(): any {
    let param = 0;//{ name: this.name, value1: this.value1, value2: this.value2 };
    return param;
  }

  emit(p: Particle, i: number, particlesystem: ParticleSystem): void {

    p.position.z = 100;
    p.scale.set(0,0,0);
    if (MinMaxRandomize(0, 20) < this.sliders[1].value) {
      let time = particlesystem.getTime();
      let emitx = this.emitposx.getValueAtTime(time);
      let emity = this.emitposy.getValueAtTime(time);
      let emitz = this.emitposz.getValueAtTime(time);
      let size = MinMaxRandomize(this.sliders[5].value, this.sliders[6].value);
      let color: number[] = MinMaxRandomizeArray([0, 0, 0], [1, 1, 1]);
      p.color.set(color[0], color[1], color[2]);
      p.scale.set(size, size, size);
      p.startscale.set(size, size, size);
      p.position.set(emitx, emity, emitz);//(p.position.x, p.position.y, p.position.z)
      let min = -0.01 * this.sliders[0].value;
      let max = 0.01 * this.sliders[0].value;
      let randomvelocity: number[] = MinMaxRandomizeArray([min, min, min], [max, max, max])
      p.velocity.set(randomvelocity[0] + this.sliders[3].value, randomvelocity[1] + this.sliders[4].value, randomvelocity[2]);
      p.age = 0;
      p.textureindex = Math.floor(MinMaxRandomize(0,10));
    }
      p.maxAge = this.sliders[2].value;
   }
   CreateTestCurve(keyframelist: KeyframeList){
    keyframelist.AddKeyframe(0,0,-1,2,1,6);
    keyframelist.AddKeyframe(20,10,-2,6,1,2);
    keyframelist.AddKeyframe(30,5,-2,2,1,2);
    keyframelist.AddKeyframe(40,10,-2,2,1,2);
    keyframelist.AddKeyframe(50,10,-2,3,1,2);
    keyframelist.AddKeyframe(60,10,-1,3,1,-3);
    keyframelist.AddKeyframe(200,-10,-2,0,1,2);
    //console.log("keyframes:", this.keyframelist.keyframes);
    }
}



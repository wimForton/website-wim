import { Slider } from "../../../UiComponentData/Slider";
import { MinMaxRandomize, MinMaxRandomizeArray } from "../../Utils/particleUtils";
import { Particle } from "../Particle";
import { IEmitClass } from "./IEmitClass";




export class EmitFromPoint implements IEmitClass{
  public name = "Emit From Point";
  public sliders: Slider[] = [];
  constructor() {
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
    slider6.max = 2;
    slider6.value = 0.6;
    this.sliders.push(slider6);
    let slider7 = new Slider();
    slider7.label = "Spawn Age Min";
    slider7.min = 0;
    slider7.max = 0.99;
    slider7.value = 0.6;
    this.sliders.push(slider7);
    let slider8 = new Slider();
    slider8.label = "Spawn Age Max";
    slider8.min = 0;
    slider8.max = 1;
    slider8.value = 1;
    this.sliders.push(slider8);
  }
  // idee: krijgt 1 parent particle en emit zodra parameters binnen range vallen (min max age)
  // evt probleem: vertrekken dan allemaal tegelijk, dus offset berekenen
  emit(p: Particle, i: number): void {
    p.position.z = 1000;
    if (MinMaxRandomize(0, 20) < this.sliders[1].value) {
      let size = MinMaxRandomize(this.sliders[5].value, this.sliders[6].value);
      p.scale.set(size, size, size);
      p.startscale.set(size, size, size);
      p.position.set(0, 0, 0);//(p.position.x, p.position.y, p.position.z)
      let min = -0.01 * this.sliders[0].value;
      let max = 0.01 * this.sliders[0].value;
      let randomvelocity: number[] = MinMaxRandomizeArray([min, min, min], [max, max, max])
      p.velocity.set(randomvelocity[0] + this.sliders[3].value, randomvelocity[1] + this.sliders[4].value, randomvelocity[2]);
      p.age = 0;
    }
      p.maxAge = this.sliders[2].value;
   }
}



import { Slider } from "../../../UiComponentData/Slider";
import { Particle } from "../Particle";

export interface IForceClass {
  name: String;
  //sliders: Slider[];
  calculate(p: Particle, particleIndex: number): void;
  getparameterstosave(): void;
}

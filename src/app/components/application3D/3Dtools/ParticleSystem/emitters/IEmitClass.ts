import { Slider } from "../../../UiComponentData/Slider";
import { Particle } from "../Particle";

export interface IEmitClass {
  name: String;
  sliders: Slider[];
  emit(p: Particle, particleIndex: number): void;
}

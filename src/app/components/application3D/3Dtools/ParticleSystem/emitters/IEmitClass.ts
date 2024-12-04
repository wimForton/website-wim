import { Slider } from "../../../UiComponentData/Slider";
import { Particle } from "../Particle";
import { ParticleSystem } from "../ParticleSystem";

export interface IEmitClass {
  name: String;
  sliders: Slider[];
  emit(p: Particle, particleIndex: number, particlesystem: ParticleSystem): void;
  getparameterstosave(): void;
}

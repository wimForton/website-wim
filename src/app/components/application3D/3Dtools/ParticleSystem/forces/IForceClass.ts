import { Slider } from "../../../UiComponentData/Slider";
import { Particle } from "../Particle";
import { ParticleSystem } from "../ParticleSystem";

export interface IForceClass {
  name: String;
  //sliders: Slider[];
  calculate(p: Particle, particleIndex: number, particlesystem: ParticleSystem): void;
  getparameterstosave(): void;
}

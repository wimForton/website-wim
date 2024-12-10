import { Slider } from "../../../UiComponentData/Slider";
import { Particle } from "../Particle";
import { ParticleSystem } from "../ParticleSystem";
import { Parameter } from "../propertytypes/parameter";

export interface IForceClass {
  name: String;
  parameters: Parameter[];
  transforms: Parameter[];
  //sliders: Slider[];
  calculate(p: Particle, particleIndex: number, particlesystem: ParticleSystem): void;
  getparameterstosave(): void;
}

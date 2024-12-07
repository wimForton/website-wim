import { Slider } from "../../../UiComponentData/Slider";
import { Particle } from "../Particle";
import { ParticleSystem } from "../ParticleSystem";
import { Parameter } from "../propertytypes/parameter";

export interface IEmitClass {
  name: String;
  sliders: Slider[];
  parameters: Parameter[];
  transforms: Parameter[];
  emit(p: Particle, particleIndex: number, particlesystem: ParticleSystem): void;
  getparameterstosave(): void;
}

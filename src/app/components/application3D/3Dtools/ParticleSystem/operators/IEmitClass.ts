import { Particle } from "../Particle";
import { ParticleSystem } from "../ParticleSystem";
import { Parameter } from "../propertytypes/parameter";

export interface IEmitClass {
  name: string;
  displayname: string;
  parameters: Parameter[];
  transforms: Parameter[];
  calculate(p: Particle, particleIndex: number, particlesystem: ParticleSystem): void;
  getdata(): any;
  setdata(data: any):void;
}

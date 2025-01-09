import { Particle } from "../Particle";
import { ParticleSystem } from "../ParticleSystem";
import { Parameter } from "../propertytypes/parameter";
import { ParameterGroup } from "../propertytypes/ParameterGroup";

export interface IOperator {
  name: string;
  displayname: string;
  parameters: Parameter[];
  transforms: Parameter[];
  parametergroups: ParameterGroup[];
  calculate(p: Particle, particleIndex: number, particlesystem: ParticleSystem): void;
  getdata(): any;
  setdata(data: any):void;
}
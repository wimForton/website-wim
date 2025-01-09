import { IOperatorData } from "./operators/IOperatorData";

export interface IParticleSystemData{
    name: string;
    maxParticles: number;
    forcesdata: IOperatorData[];
    emittersdata: IOperatorData[];
  }
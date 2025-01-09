import { IKeyframelistData } from "./IKeyframelistData";

export interface IParameterData{
    //let param = {type: this.type, name: this.name, parameter: parameterdata!};
    type: string;
    name: string;
    parameter: boolean | IKeyframelistData | number;
}
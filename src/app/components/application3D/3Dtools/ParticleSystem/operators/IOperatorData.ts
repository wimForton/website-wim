import { IParameterGroupData } from "../propertytypes/IParameterGroupData";

export interface IOperatorData{
    name: string;
    displayname: string;
    parametergroupsdata: IParameterGroupData[];
}
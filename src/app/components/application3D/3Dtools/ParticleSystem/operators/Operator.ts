import { IParameterData } from "../propertytypes/IParameterData";
import { IParameterGroupData } from "../propertytypes/IParameterGroupData";
import { Parameter } from "../propertytypes/parameter";
import { ParameterGroup } from "../propertytypes/ParameterGroup";
import { IOperatorData } from "./IOperatorData";

export abstract class Operator{

        public name = "";
        public displayname = "Emit From Point";
        //public parameters: Parameter[] = [];
        public parametergroups: ParameterGroup[] = [];

        public getdata(): IOperatorData {
            let parametergroupsdata: IParameterGroupData[] = [];
            for (let index = 0; index < this.parametergroups.length; index++) {
                const parametergroup = this.parametergroups[index];
                parametergroupsdata.push(parametergroup.getdata());
            }
            let data: IOperatorData = { name: this.name, displayname: this.displayname, parametergroupsdata: parametergroupsdata};//{ name: this.name, parameters: param, transforms: trans, parametergroups: parametergroupsdata};
            return data;
        }
        
        public setdata(data: IOperatorData){
            this.name = data.name;
            this.displayname = data.displayname;
            for (let index = 0; index < data.parametergroupsdata.length; index++) {
                const paramgroup: IParameterGroupData = data.parametergroupsdata[index];
                for (let index2 = 0; index2 < paramgroup.parametersdata.length; index2++) {
                    const parameter: IParameterData = paramgroup.parametersdata[index2];
                    this.parametergroups[index].parameters[index2].setdata(parameter);
                    //TODO   this.parameters[index].setdata(parameter);////needs array size testing
                }
            }
        }
}
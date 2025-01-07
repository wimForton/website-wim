import { Parameter } from "../propertytypes/parameter";
import { ParameterGroup } from "../propertytypes/ParameterGroup";

export abstract class Operator{

        public name = "EmitFromPoint";
        public displayname = "Emit From Point";
        //public parameters: Parameter[] = [];
        public parametergroups: ParameterGroup[] = [];

        public getdata(): any {
            let parametergroupsdata: any[] = [];
            for (let index = 0; index < this.parametergroups.length; index++) {
                const parametergroup = this.parametergroups[index];
                parametergroupsdata.push(parametergroup.getdata());
            }
            let data = { name: this.name, parametergroups: parametergroupsdata};//{ name: this.name, parameters: param, transforms: trans, parametergroups: parametergroupsdata};
            return data;
        }
        
        public setdata(data: any){
            for (let index = 0; index < data.parametergroups.length; index++) {
                const parametergroup = data.parametergroups[index];
                for (let index = 0; index < parametergroup.parametersdata.length; index++) {
                    const parameter = parametergroup.parametersdata[index];
                    //TODO   this.parameters[index].setdata(parameter);////needs array size testing
                }
            }
        }
}
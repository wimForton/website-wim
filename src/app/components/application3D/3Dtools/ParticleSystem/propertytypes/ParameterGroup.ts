import { Parameter } from "./parameter";

export class ParameterGroup{
    public parameters: Parameter[] = [];

    public name: string = "unnamed";

    constructor(name: string) {
        this.name = name;
    }
    
    public Add(param: Parameter){
        this.parameters.push(param);
    }
    public getdata(): any{
        let parametersdata: any[] = [];
        for (let index = 0; index < this.parameters.length; index++) {
            const parameter = this.parameters[index];
            parametersdata.push(parameter.getdata());
            
        }

        return {name: this.name, parametersdata}
    }
}
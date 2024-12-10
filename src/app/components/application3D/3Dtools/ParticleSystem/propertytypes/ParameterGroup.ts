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
}
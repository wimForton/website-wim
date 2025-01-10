import { IKeyframelistData } from "./IKeyframelistData";
import { IParameterData } from "./IParameterData";
import { KeyframeList } from "./keyframelist";

export class Parameter{
    public type: string = "undefined parameter";
    public name: string = "unnamed";
    private bool: boolean = false;
    private keyframelist?: KeyframeList;
    private num: number = 0;

    constructor(parameter: any, name = "unnamed") {
        this.name = name;
        if(typeof parameter ===  "boolean"){this.type = "boolean"; this.bool = parameter;}
        if(parameter instanceof  KeyframeList){this.type = "keyframelist"; this.keyframelist = parameter}
        if(typeof parameter === "number"){this.type = "number"; this.num = parameter}
    }

    public setSliderSettings(disabled = false, min = 0, max = 10, showTicks=false, step= 0.01, thumbLabel= true){
        this.keyframelist?.setSliderSettings(disabled, min, max, showTicks, step, thumbLabel);
    }
  
    public getValue(): any{
        if(this.type == "boolean") return this.bool;
        if(this.type == "keyframelist") return this.keyframelist?.getValueAtTime(0);
        if(this.type == "number") return this.num;
    }

    public setValue(v: any){
        if(this.type == "boolean") this.bool = v;
        if(this.type == "keyframelist") console.log("todo: set key value");
        if(this.type == "number") this.num = v;
    }

    public getValueAtTime(t: number): any{
        if(this.type == "boolean") return this.bool;
        if(this.type == "keyframelist") return this.keyframelist?.getValueAtTime(t);
        if(this.type == "number") return this.num;
    }
    public getKeyframeList(): KeyframeList{
        return this.keyframelist!;
    }

    public getdata(): any {
        let parameterdata: boolean | IKeyframelistData | number;
        if(this.type == "boolean") parameterdata = this.bool;
        if(this.type == "keyframelist") parameterdata = this.keyframelist?.getdata()!;
        if(this.type == "number") parameterdata = this.num;
        let param = {type: this.type, name: this.name, parameter: parameterdata!};
        return param;
    }
    public setdata(data: IParameterData){
        if(data.type == "boolean"){
            this.type = data.type;
            this.name = data.name;
            this.bool = data.parameter as boolean;
        }
        if(data.type == "keyframelist"){
            this.type = data.type;
            this.name = data.name;
            let keyframelistdata = data.parameter as KeyframeList;
            this.keyframelist = new KeyframeList();
            this.keyframelist.slidersettings = keyframelistdata.slidersettings;
            for (let index = 0; index < keyframelistdata.keyframes.length; index++) {
                const keydata = keyframelistdata.keyframes[index];
                this.keyframelist.AddKeyframe(keydata.position, keydata.value, keydata.handleleftX, keydata.handleleftY, keydata.handlerightX, keydata.handlerightY);
            }
        }
        if(data.type == "number"){
            this.type = data.type;
            this.name = data.name;
            this.num = data.parameter as number;
        }
    }

  }
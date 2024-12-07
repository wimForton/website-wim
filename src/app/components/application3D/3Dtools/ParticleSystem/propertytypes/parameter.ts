import { KeyframeList } from "./keyframelist";

export class Parameter{
    public type: string = "undefined parameter";
    public name: string = "unnamed";
    private bool: boolean = false;
    private keyframelist?: KeyframeList;
    private num: number = 0;
    public slidersettings = { disabled: false, min: 0, max: 10, showTicks: false, step: 0.01, thumbLabel: true};
  
    constructor(parameter: any, name = "unnamed") {
        this.name = name;
        if(typeof parameter ===  "boolean"){this.type = "boolean"; this.bool = parameter}
        if(parameter instanceof  KeyframeList){this.type = "keyframelist"; this.keyframelist = parameter}
        if(typeof parameter === "number"){this.type = "number"; this.num = parameter}
        console.log("this.type:", this.type);
    }

    public setSliderSettings(disabled = false, min = 0, max = 10, showTicks=false, step= 0.01, thumbLabel= true){
        this.slidersettings.disabled = disabled;
        this.slidersettings.min = min;
        this.slidersettings.max = max;
        this.slidersettings.showTicks = showTicks;
        this.slidersettings.step = step;
        this.slidersettings.thumbLabel = thumbLabel;
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

  }
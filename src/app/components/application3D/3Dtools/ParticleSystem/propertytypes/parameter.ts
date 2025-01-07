import { KeyframeList } from "./keyframelist";

export class Parameter{
    public type: string = "undefined parameter";
    public name: string = "unnamed";
    private bool: boolean = false;
    private keyframelist?: KeyframeList;
    private num: number = 0;
    //public slidersettings = { disabled: false, min: 0, max: 10, showTicks: false, step: 0.01, thumbLabel: true};
  
    constructor(parameter: any, name = "unnamed") {
        this.name = name;
        if(typeof parameter ===  "boolean"){this.type = "boolean"; this.bool = parameter;}
        if(parameter instanceof  KeyframeList){this.type = "keyframelist"; this.keyframelist = parameter}
        if(typeof parameter === "number"){this.type = "number"; this.num = parameter}
        console.log("this.type:", this.type);
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
        let parameterdata: any;
        if(this.type == "boolean") parameterdata = this.bool;
        if(this.type == "keyframelist") parameterdata = this.keyframelist?.getdata();
        if(this.type == "number") parameterdata = this.num;
        let param = {type: this.type, name: this.name, parameter: parameterdata};
        return param;
    }
    public setdata(data: any){
        console.log("paramsetdata: ", data);
        
        if(data.type == "boolean"){
            this.type = data.type;
            this.name = data.name;
            this.bool = data.parameter;
        }
        if(data.type == "keyframelist"){
            this.type = data.type;
            this.name = data.name;
            this.setSliderSettings(data.disabled, data.min, data.max = 10, data.showTicks, data.step, data.thumbLabel);
            this.keyframelist = new KeyframeList();
            for (let index = 0; index < data.parameter.keyframes.length; index++) {
                const keydata = data.parameter.keyframes[index];
                this.keyframelist.AddKeyframe(keydata.position, keydata.value, keydata.handleleftX, keydata.handleleftY, keydata.handlerightX, keydata.handlerightY);
            }
        }
        if(data.type == "number"){
            this.type = data.type;
            this.name = data.name;
            this.num = data.parameter;
        }
        //console.log("paramsetdata: ", this.getdata());
    }

  }
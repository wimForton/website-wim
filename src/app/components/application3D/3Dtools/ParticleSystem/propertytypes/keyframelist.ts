import CubicBezier from "../../../UI/curveeditor/cubic-bezier-easing";
import { Vector3D } from "../../Utils/Vector3D";
import { IKeyframelistData } from "./IKeyframelistData";

export interface ISliderSettings{
    disabled: boolean;
    min: number;
    max: number;
    showTicks: boolean;
    step: number;
    thumbLabel: boolean;
}

export class KeyFrame{
    public position: number = 0;
    public value: number = 0;
    public handleleftX: number = 0;
    public handleleftY: number = 0;
    public handlerightX: number = 0;
    public handlerightY: number = 0;
    /**
     *
     */
    constructor(position: number, value: number, handleleftX: number, handleleftY: number, handlerightX: number, handlerightY: number) {
        this.position = position;
        this.value = value;
        this.handleleftX = handleleftX;
        this.handleleftY = handleleftY;
        this.handlerightX = handlerightX;
        this.handlerightY = handlerightY;
        
    }
}

export class Connection{
    public start: number[] = [0,0];
    public end: number[] = [0,0];
}

export class KeyframeList{

    public keyframes: KeyFrame[] = [];
    private calculateVal: CubicBezier = new CubicBezier();
    public name = "unnamed curve";
    public slidersettings: ISliderSettings = { disabled: false, min: 0, max: 10, showTicks: false, step: 0.01, thumbLabel: true};

    constructor(value: number = 0, name = "unnamed") {
        this.name = name;
        this.AddKeyframe(0.0, value, -0.5, 0, 0.5, 0);
    }

    public setSliderSettings(disabled = false, min = 0, max = 10, showTicks=false, step= 0.01, thumbLabel= true){
        this.slidersettings.disabled = disabled;
        this.slidersettings.min = min;
        this.slidersettings.max = max;
        this.slidersettings.showTicks = showTicks;
        this.slidersettings.step = step;
        this.slidersettings.thumbLabel = thumbLabel;
    }

    public getdata(): IKeyframelistData {
        let param: IKeyframelistData = { name: this.name, keyframes: this.keyframes, slidersettings: this.slidersettings};
        return param;
    }

    public setdata(name: string, keyframes: KeyFrame[]){
        this.name = name;
        for (let index = 0; index < keyframes.length; index++) {
            const k = keyframes[index];
            this.AddKeyframe(k.position, k.value, k.handleleftX, k.handleleftY, k.handlerightX, k.handlerightY);
        }
    }



    public AddKeyframe(pos: number = 0, val: number = 0, leftX: number = 0.1, leftY: number = 0, rightX: number = -0.1, rightY: number = 0){
        let closekeyindex = this.FindKeyIndexInRange(pos,1);
        if(closekeyindex == -1){
            let mkey: KeyFrame = new KeyFrame(pos, val, leftX, leftY, rightX, rightY);
            this.keyframes.push(mkey);
       
            //sort by position
            function compareFunction(a:KeyFrame,b:KeyFrame){
                if(a.position > b.position)
                return 1;
                else
                return -1;
            }
            this.keyframes.sort(compareFunction);
    
            //remove duplicates///Problem?
            const key = 'position';
            this.keyframes = [...new Map( this.keyframes.map(item =>
            [item[key], item])).values()];
            this.AutoSetHandles(pos);
        }else{
            this.keyframes[closekeyindex].value = val;
        }

/*      
        this.ClampHandles();
        this.CreateConnections();
        */
    }

    private AutoSetHandles(pos: number){

        var index = this.keyframes.findIndex((obj) => obj.position === pos);
        let thiskey = this.keyframes[index];
        if(index > 0){
            let prevkey = this.keyframes[index - 1];
            thiskey.handleleftX = (thiskey.position - prevkey.position) * -0.4;
            prevkey.handlerightX = (thiskey.position - prevkey.position) * 0.4;
        }
        if(index < this.keyframes.length - 1){
            let nextkey = this.keyframes[index + 1];
            thiskey.handlerightX = (nextkey.position - thiskey.position) * 0.4;
            nextkey.handleleftX = (nextkey.position - thiskey.position) * -0.4;
        }

    }

    private FindKeyIndexInRange(position: number, range: number): number{
        let resultindex = -1;
        let closest = 10000000;
        for (let index = 0; index < this.keyframes.length; index++) {
            const pos = this.keyframes[index].position;
            const dist = Math.abs(position - pos);
            if(closest > dist && dist < range){
                closest = dist;
                resultindex = index;
            }
        }
        return resultindex;
    }

    private ClampHandles(){
        for (let index = 0; index < this.keyframes.length; index++) {
            const keyframe = this.keyframes[index];
            //left handles
            if(index > 0){
                const prevKeyframe = this.keyframes[index - 1];
                if(keyframe.handleleftX < prevKeyframe.position){keyframe.handleleftX = prevKeyframe.position}
            }
            else{
                keyframe.handleleftX = -5;
                keyframe.handleleftY = keyframe.value;
            }
            //right handles
            if(index < this.keyframes.length - 1 && this.keyframes.length > 1){
                const nextKeyframe = this.keyframes[index + 1];
                if(keyframe.handlerightX > nextKeyframe.value){keyframe.handlerightX = nextKeyframe.value}
            }
            else{
                keyframe.handlerightX = 5;
                keyframe.handlerightY = keyframe.value;
            }
        }
    }

    public RemoveKeyframe(pos: number){
        //var obj = this.keyframes.find((obj) => obj.position === pos);
        var index = this.keyframes.findIndex((obj) => obj.position === pos);
        this.keyframes.splice(index, 1);
        this.ClampHandles();
        //this.CreateConnections();
    }
    public Sort(){
        function compareFunction(a:KeyFrame,b:KeyFrame){
            if(a.position > b.position)
            return 1;
            else
            return -1;
        }
        this.keyframes.sort(compareFunction);
        
    }
    public getValueAtTime(t: number): number{
        let rval = 0;
        if(this.keyframes.length == 1){
            rval = this.keyframes[0].value;
        }else if(this.keyframes[this.keyframes.length - 1].position >= t){
            for (let index = 0; index < this.keyframes.length - 1; index++) {
                const thiskeyframe = this.keyframes[index];
                const nextkeyframe = this.keyframes[index + 1];
                if(t >= thiskeyframe.position && t <= nextkeyframe.position){
    
                    let a: Vector3D = new Vector3D(thiskeyframe.position, thiskeyframe.value);
                    let b: Vector3D = new Vector3D(thiskeyframe.handlerightX, thiskeyframe.handlerightY);
                    let c: Vector3D = new Vector3D(nextkeyframe.handleleftX, nextkeyframe.handleleftY);
                    let d: Vector3D = new Vector3D(nextkeyframe.position, nextkeyframe.value);
                    let time = t;
                    /////////////////////normalize
                    let offsetx = a.x;
                    let offsety = a.y;
                    let scalex = d.x - a.x;
                    let scaley = d.y - a.y;
                    if(scalex == 0)scalex = 0.000000000001;
                    if(scaley == 0)scaley = 0.000000000001;
                    //(move to origin), normalize scale
                    let timeNormalized = (t - a.x) / scalex;
                    // let cpax = (b.x - a.x) / scalex;
                    // let cpay = (b.y - a.y) / scaley;
                    // let cpbx = (c.x - a.x) / scalex;
                    // let cpby = (c.y - a.y) / scaley;
                    let cpax = (b.x) / scalex;
                    let cpay = (b.y) / scaley;
                    let cpbx = (c.x+d.x - a.x) / scalex;
                    let cpby = (c.y+d.y - a.y) / scaley;
                    let nval = this.calculateVal.getValueAtTime(cpax, cpay, cpbx, cpby, timeNormalized);
                    ////////////////////////unnormalize
                    rval = nval * scaley + a.y;
                    if(t == thiskeyframe.position){rval == thiskeyframe.value;}
                    if(t == nextkeyframe.position){rval == nextkeyframe.value;}
                }
            }

        }
        else{
            rval = this.keyframes[this.keyframes.length - 1].value;
        }

        return +rval.toFixed(6);
    }
    public getBoundingBox(): number[]{
        let result: number[] = [];
        let xmin = this.keyframes[0].position;
        let xmax = this.keyframes[this.keyframes.length - 1].position;
        let ymin = this.keyframes[0].value;
        let ymax = this.keyframes[0].value;
        for (let index = 0; index < this.keyframes.length; index++) {
            const key = this.keyframes[index];
            if(key.value < ymin)ymin = key.value;
            if(key.handleleftY + key.value < ymin)ymin = key.handleleftY + key.value;
            if(key.handlerightY + key.value < ymin)ymin = key.handlerightY + key.value;
            if(key.value > ymax)ymax = key.value;
            if(key.handleleftY + key.value > ymax)ymax = key.handleleftY + key.value;
            if(key.handlerightY + key.value > ymax)ymax = key.handlerightY + key.value;
        }
        return [xmin, ymin,  xmax, ymax];
    }

}
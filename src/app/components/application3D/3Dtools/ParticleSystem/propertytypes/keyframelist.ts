import CubicBezier from "../../../UI/curveeditor/cubic-bezier-easing";
import { Vector3D } from "../../Utils/Vector3D";

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
    public connections: Connection[] = [];
    private calculateVal: CubicBezier = new CubicBezier();

    constructor() {

        //this.AddKeyframe(0.0, 0.0, -5, 0, 0.5, 0);
        //this.AddKeyframe(0.4, 0.21);
        //this.AddKeyframe(0.65, 0.1);
        //this.AddKeyframe(0.9, 0.8);
        //this.RemoveKeyframe(0.65);


        console.log("this.keyframes",this.keyframes);


    }
    public AddKeyframe(pos: number = 0, val: number = 0, leftX: number = 0.1, leftY: number = 0, rightX: number = -0.1, rightY: number = 0){
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
/*
        this.ClampHandles();
        this.CreateConnections();
        */
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
        this.CreateConnections();
    }
    private CreateConnections(){
        this.connections = [];
        for (let index = 0; index < this.keyframes.length - 1; index++) {
            const connection = new Connection();
            connection.start = [this.keyframes[index].position, this.keyframes[index].value];
            connection.end = [this.keyframes[index + 1].position, this.keyframes[index + 1].value];
            this.connections.push(connection);
        }
    }
    public getValueAtTime(t: number): number{
        let rval = 0;
        for (let index = 0; index < this.keyframes.length - 1; index++) {
            const thiskeyframe = this.keyframes[index];
            const nextkeyframe = this.keyframes[index + 1];
            if(t > thiskeyframe.position && t < nextkeyframe.position){
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
                let cpax = (b.x - a.x) / scalex;
                let cpay = (b.y - a.y) / scaley;
                let cpbx = (c.x - a.x) / scalex;
                let cpby = (c.y - a.y) / scaley;
                let nval = this.calculateVal.getValueAtTime(cpax, cpay, cpbx, cpby, timeNormalized);
                ////////////////////////unnormalize
                rval = nval * scaley + a.y;
            }
        }
        return rval;
    }

}
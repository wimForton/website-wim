

export class vector2D{
    private x: number = 0.0;
    private y: number = 0.0;
    //private z: number = 0.0;

    constructor(XY: Array<number>){
        this.x = XY[0];
        this.y = XY[1];
        //this.z = XYZ[2];
        //if(XYZ[2] != undefined)this.z = XYZ[2];
        //else this.z = XYZ[1];
    }

    public copy = (): vector2D => {
        return new vector2D(this.getPos());
    }

    public getPos = (): Array<number> => {
        let position = new Array<number>();
        position[0] = this.x;
        position[1] = this.y;
        return position;
    }

    public setNoise = (): Array<number> => {
        let position = new Array<number>();
        position[0] = this.x;
        position[1] = this.y;
        return position;
    }

    public setPos = (position: Array<number>): void => {
        //let position = new Array<number>();
        this.x = position[0];
        this.y = position[1];
    }

    public getMultiply(vectorA: vector2D, vectorB: vector2D){
        let result = vectorA;
        vectorA.x *= vectorB.x;
        vectorA.y *= vectorB.y;
        return result;
    }

    public getMultiplyByNumber(vectorA: vector2D, Number: number){
        let result = new vector2D([vectorA.x, vectorA.y]);
        result.x *= Number;
        result.y *= Number;
        return result;
    }

    public getAdd(vectorA: vector2D, vectorB: vector2D){
        let result = vectorA;
        vectorA.x += vectorB.x;
        vectorA.y += vectorB.y;
        return result;
    }
    public getSubtract(vectorA: vector2D, vectorB: vector2D){
        //let result = vectorA;
        let result = new vector2D([vectorA.x - vectorB.x, vectorA.y - vectorB.y]);
        return result;
    }

    public GetDivided = (numerator: vector2D, denominator: number): vector2D => {
        if(denominator == 0)denominator = 0.00000001;
        return new vector2D([numerator.x / denominator, numerator.y / denominator]);
    }

    public getMagnitude = (vec: vector2D): number => {
        return Math.sqrt((vec.x * vec.x) + (vec.y * vec.y));
        //return Math.sqrt(vec.x * vec.x + vec.y * vec.y + vec.z + vec.z);
    }

    public getNormalized = (vec: vector2D): vector2D => {
        var mag = this.getMagnitude(vec);
        return this.GetDivided(vec,mag);
    }

    public getLerp = (vecA: vector2D, vecB: vector2D, weight: number): vector2D => {
        let x = this.lerp(vecA.x, vecB.x, weight);
        let y = this.lerp(vecA.y, vecB.y, weight);
        return new vector2D([x, y]);
    }

    public LerpVector = (inVector: vector2D, weight: number): void => {
        this.x = this.lerp(this.x, inVector.getPos()[0], weight);
        this.y = this.lerp(this.y, inVector.getPos()[1], weight);
        //return this.getLerp(this, inVector,weight);
    }    

    public Subtract = (input: vector2D | Array<number>): void => {
        let inVector: vector2D;
        if(input instanceof vector2D){
            inVector = input as vector2D;
        }else{
            inVector = new vector2D(input as Array<number>);
        }
        this.x -= inVector.copy().getPos()[0];
        this.y -= inVector.copy().getPos()[1];
    }

    public Add = (input: vector2D | Array<number>): void => {
        let tempVector: vector2D;
        if(input instanceof vector2D){
            tempVector = input as vector2D;
        }else{
            tempVector = new vector2D(input as Array<number>);
        }
        this.x += tempVector.getPos()[0];
        this.y += tempVector.getPos()[1];
    }

    public MultiplyByNumber = (Number: number): void => {
        this.x *= Number;
        this.y *= Number;
        //return this.getMultiplyByNumber(this, Number);
    } 

    public Multiply = (inVector: vector2D): vector2D => {
        return this.getMultiply(this, inVector);
    }   

    public DivideByNumber = (denominator: number): void => {
        if(denominator == 0)denominator = 0.00000001;
        this.x /= denominator;
        this.y /= denominator;
    }

    public Magnitude = (): number => {
        return Math.sqrt((this.x * this.x) + (this.y * this.y));
        //return Math.sqrt(this.x * this.x + this.y * this.y + this.z + this.z);
    }

    public DistTo = (inVector: vector2D): number => {
        let VecB = inVector.copy();
        VecB.Subtract(this);
        return Math.sqrt((VecB.x * VecB.x) + (VecB.y * VecB.y));
    }

    public Normalize = (): void => {
        var mag = this.Magnitude();
        this.DivideByNumber(mag);
    }

    public AddDirectionByAngle = (input: number, radians: boolean): void => {
        let X  = this.x;
        let Y  = this.y;
        //let Z  = this.z;
        let ang: number = 0;
        if(radians){
            ang = input;
        }else{
            ang = input * (Math.PI/180);
        }
        let cos: number = Math.cos(ang);
        let sin: number = Math.sin(ang);
        this.x = X * cos - Y * sin;
        this.y = X * sin + Y * cos;
    }

    public SetDirectionByAngle = (input: number, radians: boolean): void => {
        let X  = 1;
        let Y  = 0;
        let mag = this.getMagnitude(this);
        //let Z  = this.z;
        let ang: number = 0;
        if(radians){
            ang = input;
        }else{
            ang = input * (Math.PI/180);
        }
        let cos: number = Math.cos(ang);
        let sin: number = Math.sin(ang);

        this.x = (X * cos - Y * sin) * mag;
        this.y = (X * sin + Y * cos) * mag;
    }

    public getAngle = (radians: boolean): number => {
        var angle = Math.atan2(this.y, this.x);
        if(radians){
            return angle
        }else{
            let degrees = 180 * angle / Math.PI;
            return (360 + Math.round(degrees)) % 360;
        }
    }

    public getAngleBetween = (target: vector2D | Array<number>, radians: boolean): number => {
        let end: vector2D;
        if(target instanceof vector2D){
            end = target as vector2D;
        }else{
            end = new vector2D(target as Array<number>);
        }
        let start = new vector2D([this.x, this.y]);
        let local = new vector2D([end.x - start.x, end.y - start.y]);
        let angle = Math.atan2(local.y, local.x);
        if(radians){
            return angle
        }else{
            let degrees = 180 * angle / Math.PI;
            return (360 + Math.round(degrees)) % 360;
        }
    }

    private lerp (start: number, end: number, weight: number){
        return (1-weight)*start+weight*end;
    }

}
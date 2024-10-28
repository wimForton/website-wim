import { Vector3D } from "./Vector3D"

export function MinMaxRandomize(min: any, max: any) {
    return min + Math.random() * (max - min);
}
export function MinMaxRandomizeArray(min: number[], max: number[]){
    let result: number[] = [0,0,0];
    for(var i = 0; i < min.length; i++){
        result[i] = min[i] + Math.random() * (max[i] - min[i]);
    }
    return result;
}

export function lerp(start: number, end: number, weight: number): number{
    return (1-weight)*start+weight*end;
}

export function lerpVector3D(vecA: Vector3D, vecB: Vector3D, weight: number): Vector3D {
  let x = lerp(vecA.x, vecB.x, weight);
  let y = lerp(vecA.y, vecB.y, weight);
  let z = lerp(vecA.z, vecB.z, weight);
  return new Vector3D(x,y,z);
}

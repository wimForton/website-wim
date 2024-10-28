export class Vector3D {
  public x = 0;
  public y = 0;
  public z = 0;
  constructor(x: number = 0, y: number = 0, z: number = 0) {
    this.x = x;
    this.y = y;
    this.z = z;
  }
  public set(x: number, y: number, z: number) {
    this.x = x;
    this.y = y;
    this.z = z;
  }
  public setVec(v: Vector3D) {
    this.x = v.x;
    this.y = v.y;
    this.z = v.z;
  }
  public addVec(v: Vector3D) {
    this.x += v.x;
    this.y += v.y;
    this.z += v.z;
  }
  public multVec(v: Vector3D) {
    this.x *= v.x;
    this.y *= v.y;
    this.z *= v.z;
  }
  public multNumber(v: number) {
    this.x *= v;
    this.y *= v;
    this.z *= v;
  }
}

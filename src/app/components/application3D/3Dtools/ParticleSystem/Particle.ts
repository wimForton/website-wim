import { Vector3D } from "../Utils/Vector3D";


export class Particle {
  public position: Vector3D = new Vector3D();
  public velocity: Vector3D = new Vector3D();
  public rotation: Vector3D = new Vector3D();
  public rotationChangeVelocity: Vector3D = new Vector3D();
  public direction: Vector3D = new Vector3D();
  public directionChangeVelocity: Vector3D = new Vector3D();
  public scale: Vector3D = new Vector3D(1,1,1);
  public startscale: Vector3D = new Vector3D(1,1,1);
  public age: number = 0;
  public maxAge: number = 100;
  public color: Vector3D = new Vector3D(1, 1, 1);
  public textureindex = 0;

  constructor() {
    this.direction.y = 1;
  }
}

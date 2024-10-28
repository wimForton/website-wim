import { Viewport } from "../../Viewport/Viewport";
import { EmitFromPoint } from "../emitters/EmitFromPoint";
import { BounceForce } from "../forces/BounceForce";
import { DragForce } from "../forces/DragForce";
import { IForceClass } from "../forces/IForceClass";
import { ScaleInOutForce } from "../forces/ScaleInOut";
import { TurbulenceForce } from "../forces/TurbulenceForce";
import { VectorForce } from "../forces/VectorForce";
import { ParticleScene } from "../ParticleScene";
import { ParticleParameterGroup, ParticleSystem } from "../ParticleSystem";
declare var require: any;


export function Load(particlesystems: ParticleSystem[], particleScenes: ParticleScene[], viewPort: Viewport, json: any) {
  //cleanup
  particlesystems.splice(0, particlesystems.length);
  particleScenes.splice(0, particleScenes.length);
  viewPort.clear();
  //read json


  for (let j = 0; j < json.length; j++) {
    console.log("json maxParticles:", json[j].maxParticles);
    
    let particlesystemdata = json[j];
    let particleSystem = new ParticleSystem(particlesystemdata.maxParticles);
    for (let f = 0; f < particlesystemdata.forceparam.length; f++) {
      let forcedata = particlesystemdata.forceparam[f];

      //console.log("json forceparam:", forcedata.name);

      if (forcedata.name == "Vector Force") {
        let force: VectorForce = new VectorForce();
        force.value1 = forcedata.value1;
        force.value2 = forcedata.value2;
        force.value3 = forcedata.value3;
        force.value4 = forcedata.value4;
        force.testbool = forcedata.testbool;
        particleSystem.addForceClass(force)
      }
      if (forcedata.name == "Drag Force") {
        let force: DragForce = new DragForce();
        force.value1 = forcedata.value1;
        force.value2 = forcedata.value2;
        particleSystem.addForceClass(force)
      }
      if (forcedata.name == "Turbulence Force") {
        let force: TurbulenceForce = new TurbulenceForce();
        force.value1 = forcedata.value1;
        force.value2 = forcedata.value2;
        force.value3 = forcedata.value3;
        force.value4 = forcedata.value4;
        force.value5 = forcedata.value5;
        particleSystem.addForceClass(force)
      }
      if (forcedata.name == "Bounce Force") {
        let force: BounceForce = new BounceForce();
        force.value1 = forcedata.value1;
        force.value2 = forcedata.value2;
        force.value3 = forcedata.value3;
        force.value4 = forcedata.value4;
        particleSystem.addForceClass(force)
      }
      if (forcedata.name == "Scale In Out Force") {
        let force: ScaleInOutForce = new ScaleInOutForce();
        force.value1 = forcedata.value1;
        force.value2 = forcedata.value2;
        force.value3 = forcedata.value3;
        force.value4 = forcedata.value4;
        particleSystem.addForceClass(force)
      }
    }
    particlesystems.push(particleSystem);
  }


  for (let i = 0; i < particlesystems.length; i++) {
    let scene = new ParticleScene(particlesystems[i]);
    particleScenes.push(scene);
  }
  viewPort.AddScenes(particleScenes);
  //console.log("func particleScenes length after", particleScenes.length);
}

export function Save(particleparametergroup: ParticleParameterGroup) {

  const jsontest: string = JSON.stringify(particleparametergroup.getparameterstosave());
  console.log("Jsonstring particleparametergroup :", jsontest);
  //const parameters: SaveParameters = new SaveParameters();
  //for (let i = 0; i < particlesystems.length; i++) {
  //  let forces = particlesystems[i].GetForceClasses();
  //  for (let f = 0; f < forces.length; f++) {
  //    const jsontest: string = JSON.stringify(forces[f].getparameterstosave());
  //    console.log("Jsonstring force ", f,":", jsontest);
  //  }
  //}
  //for (let i = 0; i < particlesystems.length; i++) {
  //  const jsontest: string = JSON.stringify(particlesystems[i].getparameterstosave());
  //  console.log("Jsonstring particlesystem ", i, ":", jsontest);

  //}

}
export class SaveParameters {

}



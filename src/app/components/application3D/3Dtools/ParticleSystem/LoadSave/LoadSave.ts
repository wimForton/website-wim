import { Viewport } from "../../Viewport/Viewport";
import { emitclasses, EmitClassNames } from "../operators/AddEmitClasses";
import { EmitFromPoint } from "../operators/EmitFromPoint";
import { IEmitClass } from "../operators/IEmitClass";
import { BounceForce } from "../forces/BounceForce";
import { DragForce } from "../forces/DragForce";
import { IForceClass } from "../forces/IForceClass";
import { ScaleInOutForce } from "../forces/ScaleInOut";
import { TurbulenceForce } from "../forces/TurbulenceForce";
import { VectorForce } from "../forces/VectorForce";
import { ParticleScene } from "../ParticleScene";
import { ParticleParameterGroup, ParticleSystem, ParticleSystemData } from "../ParticleSystem";
declare var require: any;


export function Load(particlesystems: ParticleSystem[], particleScenes: ParticleScene[], viewPort: Viewport, json: any) {
  //cleanup
  particlesystems.splice(0, particlesystems.length);
  particleScenes.splice(0, particleScenes.length);
  viewPort.clear();
  viewPort.CreateViewObjects();
  //read json


  for (let j = 0; j < json.length; j++) {
    console.log("json maxParticles:", json[j].maxParticles);
    
    let particlesystemdata = json[j] as ParticleSystemData;


    let particleSystem = new ParticleSystem(particlesystemdata.maxParticles);
    //let emitclass = new EmitFromPoint();
    //particleSystem.addEmitClass(emitclass);

    for (let e = 0; e < particlesystemdata.emittersdata.length; e++){
      let emitterdata = particlesystemdata.emittersdata[e];
      type EmitClasKey = keyof typeof EmitClassNames;
      
      let key: EmitClasKey = emitterdata.name; 
      let name: EmitClassNames;

      let emitclass = new emitclasses[EmitClassNames[key]]();

      emitclass.setdata(emitterdata);
      particleSystem.addEmitClass(emitclass);
      
    } 
    for (let f = 0; f < particlesystemdata.forcesdata.length; f++) {
      let forcedata = particlesystemdata.forcesdata[f];

      
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

  const jsontest: string = JSON.stringify(particleparametergroup.getdata());
  console.log("Jsonstring particleparametergroup :", jsontest);
}
export class SaveParameters {

}



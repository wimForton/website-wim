import { Viewport } from "../../Viewport/Viewport";
import { emitclasses, EmitClassNames } from "../operators/AddEmitClasses";
import { ParticleScene } from "../ParticleScene";
import { ParticleParameterGroup, ParticleSystem } from "../ParticleSystem";
import { IParticleSystemData } from "../IParticlesystemData";
import { forceclasses, ForceClassNames } from "../forces/AddForceClasses";
import { IOperatorData } from "../operators/IOperatorData";
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
    
    let particlesystemdata = json[j] as IParticleSystemData;
    particlesystemdata.emittersdata[0].name

    let particleSystem = new ParticleSystem(particlesystemdata.maxParticles);
    //let emitclass = new EmitFromPoint();
    //particleSystem.addEmitClass(emitclass);

    for (let e = 0; e < particlesystemdata.emittersdata.length; e++){
      let emitterdata: IOperatorData = particlesystemdata.emittersdata[e];
      type EmitClasKey = keyof typeof EmitClassNames;
      
      let key: EmitClasKey = emitterdata.name as any;
      let name: EmitClassNames;

      let emitclass = new emitclasses[EmitClassNames[key]]();

      emitclass.setdata(emitterdata);
      particleSystem.addEmitClass(emitclass);
      
    } 
    for (let f = 0; f < particlesystemdata.forcesdata.length; f++) {
      let forcedata: IOperatorData = particlesystemdata.forcesdata[f];
      type ForceClasKey = keyof typeof ForceClassNames;
      
      let key: ForceClasKey = forcedata.name as any;
      let name: ForceClassNames;

      let forceclass = new forceclasses[ForceClassNames[key]]();

      forceclass.setdata(forcedata);
      particleSystem.addForceClass(forceclass);
      
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



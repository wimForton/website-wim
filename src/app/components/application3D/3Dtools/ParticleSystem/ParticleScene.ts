import * as THREE from 'three';
import { ParticleSystem } from './ParticleSystem';


export class ParticleScene {
  public scene: THREE.Scene = new THREE.Scene();
  private particleSystem: ParticleSystem;
  private threeSprites: Array<THREE.Sprite> = [];

  constructor(particleSystem: ParticleSystem) {
    this.particleSystem = particleSystem;
    this.CreateSceneLights();
    this.CreateThreeObjects();
  }

  private CreateSceneLights() {
    this.scene.fog = new THREE.Fog(new THREE.Color("rgb(50, 50, 50)"), 10, 15);
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
    //this.scene.add(ambientLight);
    const pointLight = new THREE.PointLight(0xffffff, 15);
    pointLight.position.x = 6;
    pointLight.position.y = 2;
    pointLight.position.z = 6;
    //this.scene.add(pointLight);
    const distantLight = new THREE.DirectionalLight(new THREE.Color("rgb(250, 250, 250)"), 4);

    distantLight.position.x = -6;
    distantLight.position.y = 6;
    distantLight.position.z = 4;
    //this.scene.add(distantLight);
    const backLight = new THREE.DirectionalLight(new THREE.Color("rgb(100, 200, 250)"), 2);

    backLight.position.x = 6;
    backLight.position.y = -6;
    backLight.position.z = -4;
    //this.scene.add(backLight);
  }

  private CreateThreeObjects() {
    const textureLoader = new THREE.TextureLoader();

    //spriteMaterial.color.setHSL(color[0], color[1], color[2], THREE.SRGBColorSpace);


    for (var p = 0; p < this.particleSystem.Particles.length; p++) {
      const spritetexture = textureLoader.load('textures/star.png');
      spritetexture.colorSpace = THREE.SRGBColorSpace;

      const color = [0.3, 0.8, 0.5];
      const spriteMaterial = new THREE.SpriteMaterial({ map: spritetexture, color: 0xffffff, fog: true });//blending: THREE.AdditiveBlending, transparent: true, 
      const sprite = new THREE.Sprite(spriteMaterial);
      this.scene.add(sprite);
      this.threeSprites.push(sprite);
    }
  }

  public Update() {
    this.particleSystem.SimulateFrame();
    for (var p = 0; p < this.particleSystem.Particles.length; p++) {

      let particle = this.particleSystem.Particles[p];
      this.threeSprites[p]
      this.threeSprites[p].material.color.setRGB(particle.color.x, particle.color.y, particle.color.z);
      //this.threeSprites[p].material.color.setRGB(1, 1, 0);
      this.threeSprites[p].position.set(particle.position.x, particle.position.y, particle.position.z);
      this.threeSprites[p].scale.set(particle.scale.x, particle.scale.y, particle.scale.z);
    }
  }

}

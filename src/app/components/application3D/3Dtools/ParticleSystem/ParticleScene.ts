import * as THREE from 'three';
import { ParticleSystem } from './ParticleSystem';


export class ParticleScene {
  public scene: THREE.Scene = new THREE.Scene();
  private particleSystem: ParticleSystem;
  private threeSprites: Array<THREE.Sprite> = [];
  private textures: THREE.Texture[] = [];

  constructor(particleSystem: ParticleSystem) {
    this.particleSystem = particleSystem;
    this.CreateThreeObjects();
  }

  private CreateThreeObjects() {
    const textureLoader = new THREE.TextureLoader();
    for (let index = 0; index < 10; index++) {
      let path = "textures/star" + index + ".png"
      const spritetexture = textureLoader.load(path);
      this.textures.push(spritetexture);
    }

    //spriteMaterial.color.setHSL(color[0], color[1], color[2], THREE.SRGBColorSpace);
    console.log("document", document);

    for (var p = 0; p < this.particleSystem.Particles.length; p++) {
      const spritetexture = textureLoader.load('textures/star2.png');
      //spritetexture.colorSpace = THREE.SRGBColorSpace;

      const color = [0.8, 0.8, 1];
      const spriteMaterial = new THREE.SpriteMaterial({ map: spritetexture, fog: false });//blending: THREE.AdditiveBlending, transparent: true, 
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
      //this.threeSprites[p].material.color.setRGB(particle.color.x, particle.color.y, particle.color.z);

      this.threeSprites[p].material.map = this.textures[particle.textureindex];
      this.threeSprites[p].position.set(particle.position.x, particle.position.y, particle.position.z);
      this.threeSprites[p].scale.set(particle.scale.x, particle.scale.y, particle.scale.z);
    }
  }

}

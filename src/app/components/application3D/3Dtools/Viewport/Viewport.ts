import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { ParticleScene } from '../ParticleSystem/ParticleScene';

export class Viewport {
  private renderer: THREE.WebGLRenderer;
  //private scenes: Array<THREE.Scene> = [];
  private scene: THREE.Scene = new THREE.Scene();
  private camera: THREE.PerspectiveCamera;
  private container: HTMLElement;
  private particleScenes: Array<ParticleScene> = [];
  private divready: boolean = false;
  private testcounter: number = 0;

  private containerProps = {
    x: 1,
    y: 1,
    width: 1,
    height: 1,
  };
  constructor(particleScenes: Array<ParticleScene>, containerid: string, container: HTMLElement) {
    this.particleScenes = particleScenes;
    this.CreateViewObjects();
    //this.renderer = renderer;
    for (let i = 0; i < this.particleScenes.length; i++) {
      this.scene.add(this.particleScenes[i].scene);

    }
    //this.camera = camera;
    //this.container = document.getElementById(containerid)!;
    this.container = container;
    this.containerProps.x = this.container.offsetLeft;
    this.containerProps.y = this.container.offsetTop;
    this.containerProps.width = this.container.offsetWidth;
    this.containerProps.height = this.container.offsetHeight;
    this.camera = new THREE.PerspectiveCamera(
      75,
      this.containerProps.width / this.containerProps.height,
      0.001,
      1000
    );
    this.camera.position.z = 15;

    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(this.containerProps.width, this.containerProps.height);
    this.renderer.setPixelRatio(window.devicePixelRatio)
    this.renderer.setClearColor(new THREE.Color("rgb(30,30,30)"), 1);
    this.renderer.setAnimationLoop(() => { this.render(); });

    this.container.appendChild(this.renderer.domElement);
    new OrbitControls(this.camera, this.renderer.domElement);

    window.addEventListener('resize', () => {
      this.containerProps.x = this.container.offsetLeft;
      this.containerProps.y = this.container.offsetTop;
      this.containerProps.width = this.container.offsetWidth;
      this.containerProps.height = this.container.offsetHeight;
      this.camera.aspect = this.containerProps.width / this.containerProps.height;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(this.containerProps.width, this.containerProps.height);
      this.renderer.setPixelRatio(window.devicePixelRatio)
      this.renderer.render(this.scene, this.camera);
    });
  }

  private CreateViewObjects(){
    const helper = new THREE.GridHelper( 100, 100 );
    helper.position.z = -1;
    helper.material.opacity = 0.25;
    helper.material.transparent = true;
    //helper.rotateX(Math.PI / 2);
    this.scene.add( helper );
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

  public clear() {
    this.scene.clear();
    this.particleScenes = [];
  }
  public AddScenes(pscenes: ParticleScene[]) {

    for (let i = 0; i < pscenes.length; i++) {

      this.scene.add(pscenes[i].scene);
      this.particleScenes.push(pscenes[i]);
    }
  }

  public reset() {
    this.containerProps.x = this.container.offsetLeft;
    this.containerProps.y = this.container.offsetTop;
    this.containerProps.width = this.container.offsetWidth;
    this.containerProps.height = this.container.offsetHeight;
    this.camera.aspect = this.containerProps.width / this.containerProps.height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(this.containerProps.width, this.containerProps.height);
    this.renderer.setPixelRatio(window.devicePixelRatio)
    this.renderer.render(this.scene, this.camera);
    //console.log("containerreset:", this.container.offsetWidth, "delay :", this.testcounter);
  }

  public render() {
    if (this.container.offsetWidth != 0 && !this.divready) {
      this.reset();
      this.divready = true;
    }
    else if (this.divready) {
      for (let i = 0; i < this.particleScenes.length; i++) {
        this.particleScenes[i].Update();
      }
      this.renderer.render(this.scene, this.camera);

    } else {
      this.testcounter++;
    }
    this.testcounter++;
    // console.log("render:", this.container.offsetWidth);
    // if(this.testcounter%60 == 1){
    // }
  }
}

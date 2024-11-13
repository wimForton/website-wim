import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { TransformControls } from 'three/examples/jsm/controls/TransformControls.js';
import { DragControls } from 'three/addons/controls/DragControls.js';

export class CurveViewport {
  private renderer: THREE.WebGLRenderer;
  //private scenes: Array<THREE.Scene> = [];
  private scene: THREE.Scene = new THREE.Scene();
  private camera: THREE.PerspectiveCamera;
  private container: HTMLElement;
  private loaded: boolean = false;

  private onUpPosition = new THREE.Vector2();
  private onDownPosition = new THREE.Vector2();
  private raycaster: THREE.Raycaster = new THREE.Raycaster();
  private pointer = new THREE.Vector2();
  private transformControl?: TransformControls;
  private splineHelperObjects: THREE.Mesh[] = [];
  private containerProps = {
    x: 1,
    y: 1,
    width: 100,
    height: 100,
  };
  constructor(container: HTMLElement) {

    //this.camera = camera;
    //this.container = document.getElementById(containerid)!;
    this.container = container;
    this.containerProps.x = this.container.getBoundingClientRect().left;
    this.containerProps.y = this.container.getBoundingClientRect().top;
    this.containerProps.width = this.container.getBoundingClientRect().width;//this.container.offsetWidth;
    console.log("CurveViewport", this.container.getBoundingClientRect().width);
    this.containerProps.height = window.innerHeight * 0.7;
    this.camera = new THREE.PerspectiveCamera(
      75,
      this.containerProps.width / this.containerProps.height,
      0.001,
      1000
    );
    this.camera.position.set( 0, 0, 10 );

    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(this.containerProps.width, this.containerProps.height);
    this.renderer.setPixelRatio(window.devicePixelRatio)
    this.renderer.setClearColor(new THREE.Color("rgb(30,30,30)"), 1);
    this.renderer.setAnimationLoop(() => { this.render(); });

    //////////////////////////////////GRID
    this.container.appendChild(this.renderer.domElement);
    const helper = new THREE.GridHelper( 100, 100 );
    helper.position.z = -20;
    helper.material.opacity = 0.25;
    helper.material.transparent = true;
    helper.rotateX(Math.PI / 2);
    this.scene.add( helper );

    /////////Orbit
    // Controls
    const orbitcontrols: OrbitControls = new OrbitControls( this.camera, this.renderer.domElement );
    //controls.damping = 0.2;
    orbitcontrols.addEventListener( 'change', this.render );
    
    ////////Transform
    const transformControl = new TransformControls( this.camera, this.renderer.domElement );
    transformControl.addEventListener( 'change', this.render );
    transformControl.addEventListener( 'dragging-changed', function ( event ) {

      orbitcontrols.enabled = ! event.value;

    } );
    this.scene.add( transformControl.getHelper() );

    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshLambertMaterial(  );
    const mesh = new THREE.Mesh( geometry, material );
    this.scene.add( mesh );
    transformControl.attach( mesh );

    // document.addEventListener( 'pointerdown', this.onPointerDown );
    // document.addEventListener( 'pointerup', this.onPointerUp );
    // document.addEventListener( 'pointermove', this.onPointerMove );

    window.addEventListener('resize', () => {
      this.containerProps.x = this.container.getBoundingClientRect().left;
      this.containerProps.y = this.container.getBoundingClientRect().top;
      this.containerProps.width = this.container.getBoundingClientRect().width;
      this.containerProps.height = Math.max(window.innerHeight * 0.7, 500);
      this.camera.aspect = this.containerProps.width / this.containerProps.height;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(this.containerProps.width, this.containerProps.height);
      this.renderer.setPixelRatio(window.devicePixelRatio)
      this.renderer.render(this.scene, this.camera);
    });


  }

  reset(){
    this.containerProps.x = this.container.getBoundingClientRect().left;
    this.containerProps.y = this.container.getBoundingClientRect().top;
    this.containerProps.width = this.container.getBoundingClientRect().width;
    this.containerProps.height = Math.max(window.innerHeight * 0.7, 500);
    this.camera.aspect = this.containerProps.width / this.containerProps.height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(this.containerProps.width, this.containerProps.height);
    this.renderer.setPixelRatio(window.devicePixelRatio)
    this.renderer.render(this.scene, this.camera);
  }


  public render() {
    if(this.container != undefined && this.container.getBoundingClientRect().width != 0 && !this.loaded){
      this.reset();
      this.loaded = true;
    }
    if(this.renderer != undefined){
      this.renderer.render(this.scene, this.camera);

    }
  }
}

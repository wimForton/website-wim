import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { TransformControls } from 'three/examples/jsm/controls/TransformControls.js';

export class CurveViewportCopy {
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
    this.camera.position.set( 0, 0, 200 );

    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(this.containerProps.width, this.containerProps.height);
    this.renderer.setPixelRatio(window.devicePixelRatio)
    this.renderer.setClearColor(new THREE.Color("rgb(30,30,30)"), 1);
    this.renderer.setAnimationLoop(() => { this.render(); });

    this.container.appendChild(this.renderer.domElement);
    //new OrbitControls(this.camera, this.renderer.domElement);
    this.addSplineObject(new THREE.Vector3(0,0,0));
    const helper = new THREE.GridHelper( 2000, 100 );
    helper.position.z = -20;
    helper.material.opacity = 0.25;
    helper.material.transparent = true;
    helper.rotateX(Math.PI / 2);
    this.scene.add( helper );

    const controls: OrbitControls = new OrbitControls( this.camera, this.renderer.domElement );

    this.transformControl = new TransformControls( this.camera!, this.renderer!.domElement );
    this.transformControl.showZ = false;
    this.transformControl.addEventListener( 'change', this.render );
    this.transformControl.addEventListener( 'dragging-changed', function ( event: any ) {
      controls.enabled = ! event.value;
    } );
    document.addEventListener( 'pointerdown', this.onPointerDown.bind(this) );
    document.addEventListener( 'pointerup', this.onPointerUp.bind(this) );
    document.addEventListener( 'pointermove', this.onPointerMove.bind(this) );
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

  public clear() {
    this.scene.clear();
  }


  public reset() {
    this.containerProps.x = this.container.getBoundingClientRect().left;
    this.containerProps.y = this.container.getBoundingClientRect().top;
    this.containerProps.width = this.container.getBoundingClientRect().width;
    this.containerProps.height = window.innerHeight * 0.7;
    this.camera.aspect = this.containerProps.width / this.containerProps.height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(this.containerProps.width, this.containerProps.height);
    this.renderer.setPixelRatio(window.devicePixelRatio)
    this.renderer.render(this.scene, this.camera);
    //console.log("containerreset:", this.container.offsetWidth, "delay :", this.testcounter);
  }

  addSplineObject( position: THREE.Vector3 ) {
    const geometry = new THREE.BoxGeometry( 20, 20, 20 );
    const material = new THREE.MeshBasicMaterial( { color: Math.random() * 0xffffff } );
    const object = new THREE.Mesh( geometry, material );

    if ( position ) {

      object.position.copy( position );

    } else {

      object.position.x = Math.random() * 1000 - 500;
      object.position.y = Math.random() * 600;
      object.position.z = Math.random() * 800 - 400;

    }

    object.castShadow = true;
    object.receiveShadow = true;
    this.scene!.add( object );
    this.splineHelperObjects.push( object );
    return object;

  }

  onPointerMove( event: any ) {
    let container = this.container!;
    this.pointer.x = ( (event.clientX - container.getBoundingClientRect().left) / container.getBoundingClientRect().width ) * 2 - 1;
    this.pointer.y = - ( (event.clientY - container.getBoundingClientRect().top) / container.getBoundingClientRect().height ) * 2 + 1;
    //console.log("pointer.x", event.clientX, "pointer.y", container.offsetLeft);
    this.raycaster.setFromCamera( this.pointer, this.camera! );

    const intersects = this.raycaster.intersectObjects( this.splineHelperObjects, false );

    if ( intersects.length > 0 ) {
      console.log("hit");
      const object = intersects[ 0 ].object;

      if ( object !== this.transformControl!.object ) {

        this.transformControl!.attach( object );

      }

    }

  }
  onPointerDown( event: any ) {

    this.onDownPosition.x = event.clientX;
    this.onDownPosition.y = event.clientY;

  }

  onPointerUp( event: any ) {

    this.onUpPosition.x = event.clientX;
    this.onUpPosition.y = event.clientY;

    if ( this.onDownPosition.distanceTo( this.onUpPosition ) === 0 ) {

      this.transformControl!.detach();
      this.render();

    }

  }

  updateSplineOutline() {



    // for ( const k in splines ) {

    //   const spline = splines[ k ];

    //   const splineMesh = spline.mesh;
    //   const position = splineMesh.geometry.attributes.position;

    //   for ( let i = 0; i < ARC_SEGMENTS; i ++ ) {

    //     const t = i / ( ARC_SEGMENTS - 1 );
    //     spline.getPoint( t, point );
    //     position.setXYZ( i, point.x, point.y, point.z );

    //   }

    //   position.needsUpdate = true;

    // }

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

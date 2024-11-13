import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { TransformControls } from 'three/examples/jsm/controls/TransformControls.js';
import { DragControls } from 'three/addons/controls/DragControls.js';
import { KeyframeList } from '../../3Dtools/ParticleSystem/propertytypes/keyframelist';
import CubicBezier from './cubic-bezier-easing';
import { CurveSegment } from './CurveSegment';



export class CurveViewport {
  private keframelist: KeyframeList = new KeyframeList();
  private renderer: THREE.WebGLRenderer;
  private scene: THREE.Scene = new THREE.Scene();
  private camera: THREE.OrthographicCamera;
  private container: HTMLElement;
  private loaded: boolean = false;
  private frustumSize = 30;
  private onUpPosition = new THREE.Vector2();
  private onDownPosition = new THREE.Vector2();
  private raycaster: THREE.Raycaster = new THREE.Raycaster();
  private pointer = new THREE.Vector2();
  private transformControl?: TransformControls;
  private splineHelperObjects: THREE.Mesh[] = [];
  private curve: THREE.CubicBezierCurve3 = new THREE.CubicBezierCurve3;


  private curvesegments: CurveSegment[] = [];
  private time: number = 5;
  private curveCursor: THREE.Mesh;
  private ContainerBBox:DOMRect;
  private containerProps = {
    x: 1,
    y: 1,
    width: 100,
    height: 100,
  };
  private calculateVal: CubicBezier = new CubicBezier();

  //private curvecontrolboxes: THREE.Mesh[] = [];
  private curveobject: THREE.Line = new THREE.Line;
  constructor(container: HTMLElement) {
    // this.keframelist.AddKeyframe(0,5,-5,5,5,5);
    // this.keframelist.AddKeyframe(10,2,7,2,12,3);
    // this.keframelist.AddKeyframe(20,0,18,0,22,0);
    // this.keframelist.AddKeyframe(30,0,28,1,32,1);
    this.CreateTestCurve();
    //this.camera = camera;
    //this.container = document.getElementById(containerid)!;
    this.container = container;
    this.ContainerBBox = this.container.getBoundingClientRect();
    this.containerProps.x = this.ContainerBBox.left;
    this.containerProps.y = this.ContainerBBox.top;
    this.containerProps.width = this.ContainerBBox.width;//this.container.offsetWidth;
    console.log("CurveViewport", this.ContainerBBox.width);
    this.containerProps.height = this.ContainerBBox.height;

    const aspect = window.innerWidth / window.innerHeight;
    this.frustumSize = 30;
    this.camera = new THREE.OrthographicCamera( this.frustumSize * aspect / - 2, this.frustumSize * aspect / 2, this.frustumSize / 2, this.frustumSize / - 2, 0.1, 100);
    this.camera.position.set( 0, 0, 10 );

    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(this.containerProps.width, this.containerProps.height);
    this.renderer.setPixelRatio(window.devicePixelRatio)
    this.renderer.setClearColor(new THREE.Color("rgb(30,30,30)"), 1);
    this.renderer.setAnimationLoop(() => { this.render(); });

    //////////////////////////////////GRID
    this.container.appendChild(this.renderer.domElement);
    const helper = new THREE.GridHelper( 1000, 1000 );
    helper.position.z = -1;
    helper.material.opacity = 0.25;
    helper.material.transparent = true;
    helper.rotateX(Math.PI / 2);
    this.scene.add( helper );

    /////////Orbit
    // Controls
    const orbitcontrols: OrbitControls = new OrbitControls( this.camera, this.renderer.domElement );
    //orbitcontrols.enableRotate = false;
    orbitcontrols.zoomToCursor = true;
    //controls.damping = 0.2;
    orbitcontrols.addEventListener( 'change', this.render );
    
    ////////Transform
    this.transformControl = new TransformControls( this.camera, this.renderer.domElement );
    this.transformControl.showZ = false;
    this.transformControl.setSize(0.5);
    this.transformControl.addEventListener( 'change', this.render );
    this.transformControl.addEventListener( 'dragging-changed', function ( event ) {
      orbitcontrols.enabled = ! event.value;
    } );
    this.transformControl.addEventListener( 'objectChange', function (this: any) {
      this.UpdateCurves();
    }.bind(this) );
    this.scene.add( this.transformControl.getHelper() );

    this.keframeListToCurve();

    const geometry = new THREE.BoxGeometry();
    const colorhelper = new THREE.Color().setRGB( 1, 0.5, 0 );
    const material = new THREE.MeshBasicMaterial( { color: colorhelper } );
    const mesh = new THREE.Mesh( geometry, material );
    mesh.position.x = 5;
    mesh.position.y = 2;
    const mesh2 = new THREE.Mesh( geometry, material );
    mesh2.position.x = 9;
    mesh2.position.y = 3;
    const mesh3 = new THREE.Mesh( geometry, material );
    mesh3.position.x = 7;
    mesh3.position.y = 10;
    const mesh4 = new THREE.Mesh( geometry, material );
    mesh4.position.x = 10;
    mesh4.position.y = 10;
    this.scene.add( mesh );
    this.scene.add( mesh2 );
    this.scene.add( mesh3 );
    this.scene.add( mesh4 );
    this.transformControl.attach( mesh );

    // this.splineHelperObjects.push(mesh);
    // this.splineHelperObjects.push(mesh2);
    // this.splineHelperObjects.push(mesh3);
    // this.splineHelperObjects.push(mesh4);

    this.curveCursor = new THREE.Mesh( geometry, material );
    const timevaltest: number[] = this.SegmentGetValueAtTime(mesh.position, mesh2.position, mesh3.position, mesh4.position, 0.6);
    this.curveCursor.position.x = timevaltest[0];
    this.curveCursor.position.y = timevaltest[1];
    this.scene.add( this.curveCursor );

    this.curve = new THREE.CubicBezierCurve3( mesh.position, mesh2.position, mesh3.position, mesh4.position );
    let points = this.curve.getPoints( 50 ); 
    let curvegeometry = new THREE.BufferGeometry().setFromPoints( points ); 
    const color = new THREE.Color().setRGB( 0.5, 0.5, 1 );
    let curvematerial = new THREE.LineBasicMaterial( { color: color } ); 
    this.curveobject = new THREE.Line( curvegeometry, curvematerial );
    this.scene.add(this.curveobject);

    document.addEventListener( 'pointerdown', this.onPointerDown.bind(this) );
    document.addEventListener( 'pointerup', this.onPointerUp.bind(this) );
    document.addEventListener( 'pointermove', this.onPointerMove.bind(this) );

    window.addEventListener('resize', () => {
      this.ContainerBBox = this.container.getBoundingClientRect();
      this.containerProps.x = this.ContainerBBox.left;
      this.containerProps.y = this.ContainerBBox.top;
      this.containerProps.width = this.ContainerBBox.width;
      this.containerProps.height = Math.max(window.innerHeight * 0.7, 200);

      const aspect = window.innerWidth / window.innerHeight;
      this.camera.left = - this.frustumSize * aspect / 2;
      this.camera.right = this.frustumSize * aspect / 2;
      this.camera.top = this.frustumSize / 2;
      this.camera.bottom = - this.frustumSize / 2;
      this.camera.updateProjectionMatrix();
      
      this.renderer.setSize(this.containerProps.width, this.containerProps.height);
      this.renderer.setPixelRatio(window.devicePixelRatio)
      this.renderer.render(this.scene, this.camera);
    });


  }

  SegmentGetValueAtTime(a: THREE.Vector3, b: THREE.Vector3, c: THREE.Vector3, d: THREE.Vector3, t: number): number[]{
    let time = 0.5;
    /////////////////////normalize
    let offsetx = a.x;
    let offsety = a.y;
    let scalex = d.x - a.x;
    let scaley = d.y - a.y;
    if(scalex == 0)scalex = 0.000000000001;
    if(scaley == 0)scaley = 0.000000000001;
    //(move to origin) normalize scale
    let cpax = (b.x - a.x) / scalex;
    let cpay = (b.y - a.y) / scaley;
    let cpbx = (c.x - a.x) / scalex;
    let cpby = (c.y - a.y) / scaley;
    let nval = this.calculateVal.getValueAtTime(cpax, cpay, cpbx, cpby, time);
    ////////////////////////unnormalize
    let rtime = time * scalex + a.x;
    let rval = nval * scaley + a.y;
    //let rval = this.calculateVal.getValueAtTime(0.9, 0, 0.5, 1, time);

    return [rtime,rval];
  }

  CreateTestCurve(){
    this.keframelist.AddKeyframe(0,10,-5,15,10,20);
    this.keframelist.AddKeyframe(40,10,35,20,42,20);
    this.keframelist.AddKeyframe(50,10,45,20,55,20);
    this.keframelist.AddKeyframe(70,10,68,20,72,20);
    this.keframelist.AddKeyframe(60,10,58,20,62,20);
    console.log("keyframes:", this.keframelist.keyframes);
  }

  createCurveSegment(v0: THREE.Vector3, v1: THREE.Vector3, v2: THREE.Vector3, v3: THREE.Vector3): THREE.BufferGeometry{
    this.curve.v0 = v0;
    this.curve.v1 = v1;
    this.curve.v2 = v2;
    this.curve.v3 = v3;
    const points = this.curve.getPoints( 50 ); 
    const curvegeometry = new THREE.BufferGeometry().setFromPoints( points ); 
    return curvegeometry;
  }

  keframeListToCurve(){
    this.curvesegments = [];
    let keyframes = this.keframelist.keyframes
    for (let index = 0; index < keyframes.length; index++) {
      
      if(keyframes.length > 1 && index < keyframes.length - 1){
        let thiskey = keyframes[index];
        let nextkey = keyframes[index + 1];
        let v0: THREE.Vector3 = new THREE.Vector3(thiskey.position, thiskey.value, 0);
        console.log("v1:", thiskey.handlerightX, "---", thiskey.handlerightY);
        console.log("v1:", thiskey);
        let v1: THREE.Vector3 = new THREE.Vector3(thiskey.handlerightX, thiskey.handlerightY, 0);
        let v2: THREE.Vector3 = new THREE.Vector3(nextkey.handleleftX, nextkey.handleleftY, 0);
        let v3: THREE.Vector3 = new THREE.Vector3(nextkey.position, nextkey.value, 0);
        let curveseg: CurveSegment = new CurveSegment(this.scene, this.splineHelperObjects, v0, v1, v2, v3 );
        this.curvesegments.push(curveseg);
      }
      
    }
  }

  UpdateCurves(){
    let keyframes = this.keframelist.keyframes
    for (let index = 0; index < keyframes.length; index++) {
      
      if(keyframes.length > 1 && index < keyframes.length - 1){
        this.curvesegments[index].UpdateCurve();
        let thiskey = keyframes[index];
        let nextkey = keyframes[index + 1];
        let v0: THREE.Vector3 = new THREE.Vector3(thiskey.position, thiskey.value, 0);
        let v3: THREE.Vector3 = new THREE.Vector3(nextkey.position, nextkey.value, 0);
        if(this.time > v0.x && this.time < v3.x){
          let value = this.curvesegments[index].GetValueAtTime(this.time);
          this.curveCursor.position.set(this.time, value, 0);
        }
      }
      
    }
  }

  UpdateCursor(){
    let keyframes = this.keframelist.keyframes
    for (let index = 0; index < keyframes.length; index++) {
      
      if(keyframes.length > 1 && index < keyframes.length - 1){
        let thiskey = keyframes[index];
        let nextkey = keyframes[index + 1];
        let v0 = this.curvesegments[index].curve.v0;
        let v3 = this.curvesegments[index].curve.v3;
        //let curveseg: CurveSegment = new CurveSegment(this.scene, v0, v1, v2, v3 );

        if(this.time > v0.x && this.time < v3.x){
          let value = this.curvesegments[index].GetValueAtTime(this.time);
          this.curveCursor.position.set(this.time, value, 0);
        }
        else{
          this.curveCursor.position.x = this.time;
        }
      }
      
    }
  }

  updateCurve(){

    this.curve.v0 = this.splineHelperObjects[0].position;
    this.curve.v1 = this.splineHelperObjects[1].position;
    this.curve.v2 = this.splineHelperObjects[2].position;
    this.curve.v3 = this.splineHelperObjects[3].position;
    const points = this.curve.getPoints( 50 ); 
    const curvegeometry = new THREE.BufferGeometry().setFromPoints( points ); 
    this.curveobject.geometry = curvegeometry;

    let cursorpos = this.SegmentGetValueAtTime(this.curve.v0, this.curve.v1, this.curve.v2, this.curve.v3, 1.5);
    this.curveCursor.position.set(cursorpos[0], cursorpos[1], 0);
  }

  onPointerDown( event: any ) {
    console.log("onPointerDown event: ", event.clientX, "---", event.clientY);

    let container = this.container!;
    let x = ( (event.clientX - container.getBoundingClientRect().left) / container.getBoundingClientRect().width ) * 2 - 1;
    let y = - ( (event.clientY - container.getBoundingClientRect().top) / this.containerProps.height ) * 2 + 1;
    console.log("viewport pos: ", x, "---", y);
    console.log("viewport Y test: ", (event.clientY - container.getBoundingClientRect().top) / container.getBoundingClientRect().height);

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

  onPointerMove( event: any ) {
    let container = this.container!;
    let ContainerBBox:DOMRect = container.getBoundingClientRect();
    // this.pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    // this.pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
    this.pointer.x = ( (event.clientX - ContainerBBox.left) / ContainerBBox.width ) * 2 - 1;
    this.pointer.y = - ( (event.clientY - container.getBoundingClientRect().top) / this.containerProps.height ) * 2 + 1;


    this.raycaster.setFromCamera( this.pointer, this.camera );

    const intersects = this.raycaster.intersectObjects( this.splineHelperObjects, false );

    if ( intersects.length > 0 ) {

      const object = intersects[ 0 ].object;

      if ( object !== this.transformControl!.object ) {

        this.transformControl!.attach( object );

      }

    }

  }

  reset(){
    this.ContainerBBox = this.container.getBoundingClientRect();
    this.containerProps.x = this.ContainerBBox.left;
    this.containerProps.y = this.ContainerBBox.top;
    this.containerProps.width = this.ContainerBBox.width;
    this.containerProps.height = Math.max(window.innerHeight * 0.7, 500);
    //this.camera.aspect = this.containerProps.width / this.containerProps.height;
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
      this.time += 0.3;
      if(this.time > 69.8)this.time = 0.1;
      this.UpdateCursor();
    }
  }
}

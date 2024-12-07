import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { TransformControls } from 'three/examples/jsm/controls/TransformControls.js';
import { DragControls } from 'three/addons/controls/DragControls.js';
import { KeyframeList } from '../../3Dtools/ParticleSystem/propertytypes/keyframelist';
import CubicBezier from './cubic-bezier-easing';
import { CurveSegment } from './CurveSegment';
import { CSS2DRenderer, CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';
import { EventEmitter, Inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class CurveViewportService {
  private keyframelist: KeyframeList = new KeyframeList();
  private renderer!: THREE.WebGLRenderer;
  private labelRenderer!: CSS2DRenderer;
  private scene: THREE.Scene = new THREE.Scene();
  private camera!: THREE.OrthographicCamera;
  private container!: HTMLElement;
  private loaded: boolean = false;
  private frustumSize = 30;
  private onUpPosition = new THREE.Vector2();
  private onDownPosition = new THREE.Vector2();
  private raycaster: THREE.Raycaster = new THREE.Raycaster();
  private pointer = new THREE.Vector2();
  private transformControl?: TransformControls;
  private splineHelperObjects: THREE.Mesh[] = [];
  private curve: THREE.CubicBezierCurve3 = new THREE.CubicBezierCurve3;
  private bgbox!: THREE.Mesh;
  private text!: HTMLDivElement;
  private orbitcontrols!: OrbitControls;


  private curvesegments: CurveSegment[] = [];
  private time: number = 0;
  private curveCursor!: THREE.Mesh;
  private ContainerBBox?:DOMRect;
  private containerProps = {
    x: 1,
    y: 1,
    width: 100,
    height: 100,
  };
  private calculateVal: CubicBezier = new CubicBezier();

  //private curvecontrolboxes: THREE.Mesh[] = [];
  private curveobject: THREE.Line = new THREE.Line;
  public timechanged$: EventEmitter<number>;

/**
 *
 */
  constructor() {
    this.timechanged$ = new EventEmitter();
  }

  public Create(container: HTMLElement, keyframelist?: KeyframeList) {

    if(keyframelist != null || undefined){
      this.keyframelist = keyframelist!;
    }else{
      this.CreateTestCurve();
    }
    this.container = container;
    this.containerProps.x = this.container.getBoundingClientRect().left;
    this.containerProps.y = this.container.getBoundingClientRect().top;
    this.containerProps.width = this.container.getBoundingClientRect().width;//this.container.offsetWidth;
    console.log("CurveViewport", this.container.getBoundingClientRect().width);
    this.containerProps.height = this.container.getBoundingClientRect().height;
    console.log("this.containerProps", this.containerProps);
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
    this.orbitcontrols = new OrbitControls( this.camera, this.renderer.domElement );
    this.orbitcontrols.enableRotate = false;
    this.orbitcontrols.zoomToCursor = true;
    this.orbitcontrols.addEventListener( 'change', this.render );

    
    ////////Transform
    this.transformControl = new TransformControls( this.camera, this.renderer.domElement );
    this.transformControl.showZ = false;
    //this.transformControl.setTranslationSnap(1);
    this.transformControl.setSize(1);
    this.transformControl.addEventListener( 'change', this.render );
    this.transformControl.addEventListener( 'dragging-changed', function ( event ) {
      //orbitcontrols.enabled = ! event.value;
    } );
    this.transformControl.addEventListener( 'objectChange', function (this: any) {
      this.UpdateCurves();
    }.bind(this) );
    if(this.splineHelperObjects.length > 0){this.transformControl.attach(this.splineHelperObjects[0])}
    this.scene.add( this.transformControl.getHelper() );

    this.keyframeListToCurve();

    const geometry = new THREE.BoxGeometry();
    const colorhelper = new THREE.Color().setRGB( 1, 0.5, 0 );
    const material = new THREE.MeshBasicMaterial( { color: colorhelper } );
    this.curveCursor = new THREE.Mesh( geometry, material );

    let handleleftgeometry = new THREE.BufferGeometry().setFromPoints( [new THREE.Vector3(0,100,0), new THREE.Vector3(0,-100,0)] );
    const colorhandle = new THREE.Color().setRGB( 0.2, 0.2, 0.3 );
    let handlematerial = new THREE.LineBasicMaterial( { color: colorhandle } ); 
    let cursorline = new THREE.Line( handleleftgeometry, handlematerial );
    this.curveCursor.add(cursorline);

    this.scene.add( this.curveCursor );

    this.labelRenderer  = new CSS2DRenderer()
    this.labelRenderer.setSize(this.containerProps.width, this.containerProps.height);
    this.labelRenderer.domElement.style.position = 'absolute';
    this.labelRenderer.domElement.style.top = this.containerProps.y + 'px';
    this.labelRenderer.domElement.style.pointerEvents = 'none';
    this.container.appendChild( this.labelRenderer.domElement );

    this.text = document.createElement( 'div' );
    this.text.className = 'label';
    this.text.style.color = 'white';
    this.text.textContent = "text";

    // const button = document.createElement( 'button' );
    // button.className = 'label';
    // button.style.color = 'white';
    // button.textContent = "button";
    // const btn = new CSS2DObject( button );
    // this.scene.add(btn);

    const label = new CSS2DObject( this.text );
    //label.position.z = 1;
    this.curveCursor.add( label );

    this.container.addEventListener( 'pointerdown', this.onPointerDown.bind(this) );
    this.container.addEventListener( 'pointerup', this.onPointerUp.bind(this) );
    this.container.addEventListener( 'pointermove', this.onPointerMove.bind(this) );
    this.container.addEventListener( 'dblclick', this.onDblClick.bind(this) );

    window.addEventListener('resize', () => {
      this.ContainerBBox = this.container.getBoundingClientRect();
      this.containerProps.x = this.ContainerBBox.left;
      this.containerProps.y = this.ContainerBBox.top;
      this.containerProps.width = this.ContainerBBox.width;
      //this.containerProps.height = Math.max(window.innerHeight * 0.7, 200);
      this.containerProps.height = this.ContainerBBox.height;

      const aspect = this.containerProps.width / this.containerProps.height;//window.devicePixelRatio;//window.innerWidth / window.innerHeight;

      let firstkeyX = this.keyframelist.keyframes[0].position;
      let lastkeyX = this.keyframelist.keyframes[this.keyframelist.keyframes.length - 1].position;
      let centerx = (lastkeyX - firstkeyX) * 0.5 + firstkeyX;
  
      this.camera.left = firstkeyX - 5;
      this.camera.right = lastkeyX + 5;
      this.camera.position.x = firstkeyX - 3;
      this.camera.lookAt(new THREE.Vector3(this.camera.position.x, this.camera.position.y, 0));
      this.camera.top = this.frustumSize / 2;
      this.camera.bottom = - this.frustumSize / 2;
      this.camera.updateProjectionMatrix();
      this.orbitcontrols.reset();

      // this.camera.left = - this.frustumSize * aspect / 2;
      // this.camera.right = this.frustumSize * aspect / 2;
      // this.camera.top = this.frustumSize / 2;
      // this.camera.bottom = - this.frustumSize / 2;
      this.labelRenderer.domElement.style.top = this.containerProps.y + 'px';
      this.labelRenderer.setSize(this.containerProps.width, this.containerProps.height);
      this.renderer.setSize(this.containerProps.width, this.containerProps.height);
      //this.renderer.setPixelRatio(window.devicePixelRatio);
      this.renderer.setPixelRatio(window.devicePixelRatio);
      this.renderer.render(this.scene, this.camera);
    });


  }

  CreateTestCurve(){
    this.keyframelist.AddKeyframe(0,0,-1,0,1,0);
  }

  public LoadKeyframeList(keyframelist: KeyframeList){
    this.keyframelist = keyframelist;
    this.keyframeListToCurve();
    this.UpdateCursor();
    this.timechanged$.emit(this.time);
    this.reset();
  }

  public setTime(time: number){
    this.time = time;
    this.UpdateCursor();
    this.timechanged$.emit(time);
  }

  public getTime(): number{
    return this.time;
  }

  public getValueAtTime(): number{
    return this.keyframelist.getValueAtTime(this.time);
  }

  public SetValueAutoKey( value: any ) {
    this.keyframelist.AddKeyframe(this.time,value,-1,0,+1,0);
    this.keyframeListToCurve();
    this.UpdateCurves();
    this.UpdateCursor();
    this.timechanged$.emit(this.time);
  }

  keyframeListToCurve(){
    let ctrlobject: THREE.Mesh = this.transformControl!.object as THREE.Mesh;
    let transformcontrolindex = -1;
    if(ctrlobject != undefined || null){
      transformcontrolindex = this.splineHelperObjects.indexOf(ctrlobject);
    }
    this.transformControl?.detach();
    this.keyframelist.Sort();
    for (let index = 0; index < this.curvesegments.length; index++) {
      const segment = this.curvesegments[index];
      segment.removecurve(this.scene, this.splineHelperObjects);

    }
    this.splineHelperObjects = [];
    console.log("keyframeListToCurve this.splineHelperObjects", this.splineHelperObjects);
    this.curvesegments = [];
    //this.scene.clear();
    let keyframes = this.keyframelist.keyframes
    for (let index = 0; index < keyframes.length; index++) {
      
      if(keyframes.length > 1 && index < keyframes.length - 1){
        let thiskey = keyframes[index];
        let nextkey = keyframes[index + 1];
        let v0: THREE.Vector3 = new THREE.Vector3(thiskey.position, thiskey.value, 0);
        let v1: THREE.Vector3 = new THREE.Vector3(thiskey.handlerightX, thiskey.handlerightY, 0);
        let v2: THREE.Vector3 = new THREE.Vector3(nextkey.handleleftX, nextkey.handleleftY, 0);
        let v3: THREE.Vector3 = new THREE.Vector3(nextkey.position, nextkey.value, 0);
        let curveseg: CurveSegment = new CurveSegment(this.scene, this.splineHelperObjects, v0, v1, v2, v3 );
        this.curvesegments.push(curveseg);

      }
      
    }
    if(transformcontrolindex >= -1 && transformcontrolindex < this.splineHelperObjects.length){
      this.transformControl?.attach(this.splineHelperObjects[transformcontrolindex])
    }
    if(keyframes.length == 1){
      ///todo
    }
  }

  UpdateCurves(){
    //this.keyframeListToCurve();
    
    let keyframes = this.keyframelist.keyframes;

    for (let index = 0; index < keyframes.length; index++) {
      
      if(keyframes.length > 1 && index < keyframes.length - 1){
        let currentseg = this.curvesegments[index];
        if(this.transformControl!.object === currentseg.mesh1 ||
          this.transformControl!.object === currentseg.mesh2 ||
          this.transformControl!.object === currentseg.mesh3 ||
          this.transformControl!.object === currentseg.mesh4
        ){
          this.curvesegments[index].UpdateCurve();
        }
        if(this.transformControl!.object === this.curvesegments[index].mesh4 && 
          this.curvesegments.length > index + 1
        ){///if the last controller is moved and there is a segment after this
            let v4 = currentseg.mesh4.position;
            this.curvesegments[index + 1].mesh1.position.set(v4.x, v4.y, v4.z);///connect handle 4 to handle 1 of next seg
            this.curvesegments[index + 1].UpdateCurve();
        }
        let thiskey = keyframes[index];
        let nextkey = keyframes[index + 1];

        let v0: THREE.Vector3 = new THREE.Vector3(thiskey.position, thiskey.value, 0);
        let v3: THREE.Vector3 = new THREE.Vector3(nextkey.position, nextkey.value, 0);
        thiskey.position = currentseg.mesh1.position.x;
        thiskey.value = currentseg.mesh1.position.y;
        thiskey.handlerightX = currentseg.mesh2.position.x;
        thiskey.handlerightY = currentseg.mesh2.position.y;
        nextkey.handleleftX = currentseg.mesh3.position.x;
        nextkey.handleleftY = currentseg.mesh3.position.y;
        nextkey.position = currentseg.mesh4.position.x;
        nextkey.value = currentseg.mesh4.position.y;
      }
      
    }
    // this.keyframeListToCurve();
  }

  UpdateCursor(){
    let value = this.keyframelist.getValueAtTime(this.time);
    this.curveCursor.position.set(this.time, value, 0);
    this.text.textContent = Number(value).toFixed(2);
  }


  onPointerDown( event: any ) {
    let container = this.container!;
    let x = ( (event.clientX - container.getBoundingClientRect().left) / container.getBoundingClientRect().width ) * 2 - 1;
    let y = - ( (event.clientY - container.getBoundingClientRect().top) / this.containerProps.height ) * 2 + 1;
    this.onDownPosition.x = event.clientX;
    this.onDownPosition.y = event.clientY;
  }

  onDblClick( event: any ) {
    let container = this.container!;
    let x = ( (event.clientX - container.getBoundingClientRect().left) / container.getBoundingClientRect().width ) * 2 - 1;
    let y = - ( (event.clientY - container.getBoundingClientRect().top) / this.containerProps.height ) * 2 + 1;
    let pos: THREE.Vector3 = new THREE.Vector3;
    this.camera.getWorldPosition(pos);
    let zoom = this.camera.zoom;
    console.log("this.camera.zoom: ", this.camera.zoom);
    let mouseScenePosX = x * this.camera.right / zoom + pos.x;
    let mouseScenePosY = y * this.camera.top / zoom + pos.y;
    this.keyframelist.AddKeyframe(mouseScenePosX,mouseScenePosY,-1,0,+1,0);
    this.keyframeListToCurve();
  }

  onPointerUp( event: any ) {

    this.onUpPosition.x = event.clientX;
    this.onUpPosition.y = event.clientY;
    if ( this.onDownPosition.distanceTo( this.onUpPosition ) === 0 ) {

      this.transformControl!.detach();
      this.render();

    }
    console.log("onPointerUp");
    this.keyframeListToCurve();
  }

  onPointerMove( event: any ) {
    let container = this.container!;
    let ContainerBBox:DOMRect = container.getBoundingClientRect();
    this.pointer.x = ( (event.clientX - ContainerBBox.left) / ContainerBBox.width ) * 2 - 1;
    this.pointer.y = - ( (event.clientY - container.getBoundingClientRect().top) / this.containerProps.height ) * 2 + 1;

    this.raycaster.setFromCamera( this.pointer, this.camera );
    const intersects = this.raycaster.intersectObjects( this.splineHelperObjects, false );
    if ( intersects.length > 0 ) {
      const object = intersects[ 0 ].object;
      
      if ( object !== this.transformControl!.object && !this.transformControl?.dragging) {// && !this.transformControl?.dragging
        this.transformControl!.attach( object );
      }
    }
  }

  public reset(){

    this.ContainerBBox = this.container.getBoundingClientRect();
    this.containerProps.x = this.ContainerBBox.left;
    this.containerProps.y = this.ContainerBBox.top;
    this.containerProps.width = this.ContainerBBox.width;
    //this.containerProps.height = Math.max(window.innerHeight * 0.7, 200);
    this.containerProps.height = this.ContainerBBox.height;

    let bbox = this.keyframelist.getBoundingBox();
    let firstkeyX = bbox[0];
    let lastkeyX = bbox[2];
    let minY = bbox[1];
    let maxY = bbox[3];

    let centerx = (lastkeyX - firstkeyX) * 0.5 + firstkeyX;

    this.camera.left = firstkeyX - 5;
    this.camera.right = lastkeyX + 5;
    this.camera.position.x = firstkeyX;
    this.camera.position.y = minY;
    this.camera.lookAt(new THREE.Vector3(this.camera.position.x, this.camera.position.y, 0));
    this.camera.top = maxY + 5;// this.frustumSize / 2;
    this.camera.bottom = minY - 5;//- this.frustumSize / 2;
    this.camera.updateProjectionMatrix();
    this.orbitcontrols.reset();
    this.transformControl!.setSize((lastkeyX - firstkeyX) * 0.015);
    // const aspect = this.containerProps.width / this.containerProps.height;//window.devicePixelRatio;//window.innerWidth / window.innerHeight;
    // this.camera.left = - this.frustumSize * aspect / 2;
    // this.camera.right = this.frustumSize * aspect / 2;
    // this.camera.top = this.frustumSize / 2;
    // this.camera.bottom = - this.frustumSize / 2;
    this.labelRenderer.setSize(this.containerProps.width, this.containerProps.height);
    this.labelRenderer.domElement.style.top = this.containerProps.y + 'px';
    this.renderer.setSize(this.containerProps.width, this.containerProps.height);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.render(this.scene, this.camera);
  }


  public render() {
    if(this.container != undefined && this.container.getBoundingClientRect().width != 0 && !this.loaded){
      this.reset();
      this.loaded = true;
    }
    if(this.renderer != undefined){
      this.renderer.render(this.scene, this.camera);
      this.labelRenderer.render(this.scene, this.camera);
      // this.time += 0.3;
      // if(this.time > 69.8)this.time = 0.1;
      this.UpdateCursor();

    }
  }
}

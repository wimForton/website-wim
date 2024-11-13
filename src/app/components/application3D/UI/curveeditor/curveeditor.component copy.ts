import { Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy, ViewChild, ElementRef, AfterViewInit, AfterViewChecked, model, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as THREE from 'three';

import { GUI } from 'three/addons/libs/lil-gui.module.min.js';

import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { TransformControls } from 'three/addons/controls/TransformControls.js';

@Component({
  selector: 'app-curveeditor-old',
  standalone: true,
  imports: [],
  templateUrl: './curveeditor.component.html',
  styleUrl: './curveeditor.component.css'
})
export class CurveeditorComponent implements AfterViewInit  {

  @ViewChild('curvecontainer', { read: ElementRef, static:false })//@ViewChild('viewportcontainer', { read: ElementRef })
  curvecontainer!: ElementRef;
  private container?: HTMLElement;
  private camera?: THREE.PerspectiveCamera;
  private scene?: THREE.Scene;
  private renderer: THREE.WebGLRenderer = new THREE.WebGLRenderer( { antialias: true } );
  private transformControl?: TransformControls;
  private onUpPosition = new THREE.Vector2();
  private onDownPosition = new THREE.Vector2();
  private splinePointsLength = 4;
  private splineHelperObjects: THREE.Mesh[] = [];
  private positions: any = [];
  private pointer = new THREE.Vector2();
  private ARC_SEGMENTS = 200;
  private raycaster: THREE.Raycaster = new THREE.Raycaster();

  /**
   *
   */
  constructor() {

  }

  ngAfterViewInit(): void {

    this.container = this.curvecontainer.nativeElement;
    this.renderer = new THREE.WebGLRenderer( { antialias: true } );
    this.renderer.setPixelRatio( window.devicePixelRatio );
    this.renderer.setSize( window.innerWidth, window.innerHeight );
    this.renderer.shadowMap.enabled = true;
    this.container!.appendChild( this.renderer.domElement );

    this.init();

    // function exportSpline() {

    //   const strplace = [];

    //   for ( let i = 0; i < splinePointsLength; i ++ ) {

    //     const p = splineHelperObjects[ i ].position;
    //     strplace.push( `new THREE.Vector3(${p.x}, ${p.y}, ${p.z})` );

    //   }

    //   console.log( strplace.join( ',\n' ) );
    //   const code = '[' + ( strplace.join( ',\n\t' ) ) + ']';
    //   prompt( 'copy and paste code', code );

    // }

  }
  init() {



    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color( 0xf0f0f0 );

    this.camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 10000 );
    this.camera.position.set( 0, 250, 1000 );
    this.scene.add( this.camera );

    this.scene.add( new THREE.AmbientLight( 0xf0f0f0, 3 ) );
    const light = new THREE.SpotLight( 0xffffff, 4.5 );
    light.position.set( 0, 1500, 200 );
    light.angle = Math.PI * 0.2;
    light.decay = 0;
    light.castShadow = true;
    light.shadow.camera.near = 200;
    light.shadow.camera.far = 2000;
    light.shadow.bias = - 0.000222;
    light.shadow.mapSize.width = 1024;
    light.shadow.mapSize.height = 1024;
    this.scene.add( light );

    const planeGeometry = new THREE.PlaneGeometry( 2000, 2000 );
    planeGeometry.rotateX( - Math.PI / 2 );
    const planeMaterial = new THREE.ShadowMaterial( { color: 0x000000, opacity: 0.2 } );

    const plane = new THREE.Mesh( planeGeometry, planeMaterial );
    plane.position.y = - 200;
    plane.receiveShadow = true;
    this.scene.add( plane );

    const helper = new THREE.GridHelper( 2000, 100 );
    helper.position.z = -20;
    helper.material.opacity = 0.25;
    helper.material.transparent = true;
    helper.rotateX(Math.PI / 2);
    this.scene.add( helper );





    // Controls
    const controls: OrbitControls = new OrbitControls( this.camera!, this.renderer!.domElement );
    //controls.damping = 0.2;
    controls.addEventListener( 'change', this.render );

    this.transformControl = new TransformControls( this.camera!, this.renderer!.domElement );
    this.transformControl.showZ = false;
    this.transformControl.addEventListener( 'change', this.render );
    this.transformControl.addEventListener( 'dragging-changed', function ( event: any ) {

      controls.enabled = ! event.value;

    } );
    this.scene.add( this.transformControl.getHelper() );

    // this.transformControl.addEventListener( 'objectChange', function () {

    //   this.updateSplineOutline();

    // } );
    this.transformControl.addEventListener( 'objectChange', this.updateSplineOutline)

    document.addEventListener( 'pointerdown', this.onPointerDown.bind(this) );
    document.addEventListener( 'pointerup', this.onPointerUp.bind(this) );
    document.addEventListener( 'pointermove', this.onPointerMove.bind(this) );
    window.addEventListener( 'resize', this.onWindowResize.bind(this) );
    //window.addEventListener( 'pageshow', onWindowPageshow );


    /*******
     * Curves
     *********/
    let curve: THREE.CubicBezierCurve = new THREE.CubicBezierCurve( new THREE.Vector2( -100, 100 ), new THREE.Vector2( -100, 0 ), new THREE.Vector2( 100, 0 ), new THREE.Vector2( 100, 100 ) );
    
    let points = curve.getPoints( 50 ); 
    let curvegeometry = new THREE.BufferGeometry().setFromPoints( points ); 
    let curvematerial = new THREE.LineBasicMaterial( { color: 0xff0000 } ); // Create the final object to add to the scene const curveObject = new THREE.Line( geometry, material );
    let curveObject = new THREE.Line( curvegeometry, curvematerial );
    this.scene.add(curveObject);
    curve.v0 = new THREE.Vector2( -100, 200 );
    points = curve.getPoints( 50 ); 
    curvegeometry = new THREE.BufferGeometry().setFromPoints( points ); 
    curveObject.geometry = curvegeometry;
    

    for ( let i = 0; i < this.splinePointsLength; i ++ ) {

      this.addSplineObject( this.positions[ i ] );

    }

    this.positions.length = 0;

    for ( let i = 0; i < this.splinePointsLength; i ++ ) {

      this.positions.push( this.splineHelperObjects[ i ].position );

    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute( 'position', new THREE.BufferAttribute( new Float32Array( this.ARC_SEGMENTS * 3 ), 3 ) );

    

    this.load( [ new THREE.Vector3( 289.76843686945404, 452.51481137238443, 0 ),
      new THREE.Vector3( - 53.56300074753207, 171.49711742836848, 0 ),
      new THREE.Vector3( - 91.40118730204415, 176.4306956436485, 0 ),
      new THREE.Vector3( - 383.785318791128, 491.1365363371675, 0 ) ] );

    this.render();

  }

  addPoint() {

    this.splinePointsLength ++;

    //positions.push( addSplineObject(position).position );

    this.updateSplineOutline();

    this.render();

  }
  removePoint() {

    if ( this.splinePointsLength <= 4 ) {

      return;

    }

    let point: THREE.Mesh = this.splineHelperObjects.pop()!;
    this.splinePointsLength --;
    this.positions.pop();

    if ( this.transformControl!.object === point ) this.transformControl!.detach();
    this.scene!.remove( point );

    this.updateSplineOutline();

    this.render();

  }

  load( new_positions: any ) {

    while ( new_positions.length > this.positions.length ) {

      this.addPoint();

    }

    while ( new_positions.length < this.positions.length ) {

      this.removePoint();

    }

    for ( let i = 0; i < this.positions.length; i ++ ) {

      this.positions[ i ].copy( new_positions[ i ] );

    }

    this.updateSplineOutline();

  }
  addSplineObject( position: any ) {
    const geometry = new THREE.BoxGeometry( 20, 20, 20 );
    const material = new THREE.MeshLambertMaterial( { color: Math.random() * 0xffffff } );
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
  onPointerMove( event: any ) {
    let container = this.container!;
    this.pointer.x = ( (event.clientX - container.getBoundingClientRect().left) / container.getBoundingClientRect().width ) * 2 - 1;
    this.pointer.y = - ( (event.clientY - container.getBoundingClientRect().top) / container.getBoundingClientRect().height ) * 2 + 1;
    //console.log("pointer.x", event.clientX, "pointer.y", container.offsetLeft);
    this.raycaster.setFromCamera( this.pointer, this.camera! );

    const intersects = this.raycaster.intersectObjects( this.splineHelperObjects, false );

    if ( intersects.length > 0 ) {

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
  public render() {


    this.renderer!.render( this.scene!, this.camera! );

  }

  onWindowResize() {

    this.camera!.aspect = this.container!.getBoundingClientRect().width / this.container!.getBoundingClientRect().height;
    this.camera!.updateProjectionMatrix();
    console.log("containerpos", this.container!.getBoundingClientRect().left, "---", this.container!.getBoundingClientRect().top);
    console.log("containerscale", this.container!.getBoundingClientRect().width, "-*-", this.container!.getBoundingClientRect().height);
    this.renderer!.setSize( this.container!.getBoundingClientRect().width, this.container!.getBoundingClientRect().height );

    this.render();

  }
}

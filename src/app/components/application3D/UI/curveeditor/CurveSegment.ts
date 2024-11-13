import * as THREE from 'three';
import CubicBezier from './cubic-bezier-easing';

export class CurveSegment{
    private calculateVal: CubicBezier = new CubicBezier();
    public curve: THREE.CubicBezierCurve3 = new THREE.CubicBezierCurve3;
    private controlpoints: THREE.Vector3[] = [];
    //private splineHelperObjects: THREE.Mesh[] = [];
    private mesh1: THREE.Mesh; 
    private mesh2: THREE.Mesh; 
    private mesh3: THREE.Mesh; 
    private mesh4: THREE.Mesh;
    private curveobject: THREE.Line = new THREE.Line;
    private handleleftline: THREE.Line = new THREE.Line; 
    private handlerightline: THREE.Line = new THREE.Line; 
    /**
     *
     */
    constructor(scene: THREE.Scene, splineHelperObjects: THREE.Mesh[], v0: THREE.Vector3, v1: THREE.Vector3, v2: THREE.Vector3, v3: THREE.Vector3) {
        const geometry = new THREE.BoxGeometry();
        const colorhelper = new THREE.Color().setRGB( 0, 0.5, 1 );
        const material = new THREE.MeshBasicMaterial( { color: colorhelper } );
        this.mesh1 = new THREE.Mesh( geometry, material );
        this.mesh1.position.set(v0.x, v0.y, v0.z);
        this.mesh1.scale.set(0.5,0.5,0.5);
        this.mesh2 = new THREE.Mesh( geometry, material );
        this.mesh2.position.set(v1.x, v1.y, v1.z);
        this.mesh2.scale.set(0.5,0.5,0.5);
        const colorhelperright = new THREE.Color().setRGB( 0, 1, 1 );
        const material2 = new THREE.MeshBasicMaterial( { color: colorhelperright } );
        this.mesh3 = new THREE.Mesh( geometry, material2 );
        this.mesh3.position.set(v2.x, v2.y, v2.z);
        this.mesh3.scale.set(0.5,0.5,0.5);
        this.mesh4 = new THREE.Mesh( geometry, material2 );
        this.mesh4.position.set(v3.x, v3.y, v3.z);
        this.mesh4.scale.set(0.5,0.5,0.5);
        scene.add( this.mesh1 );
        scene.add( this.mesh2 );
        scene.add( this.mesh3 );
        scene.add( this.mesh4 );
    
        splineHelperObjects.push(this.mesh1);
        splineHelperObjects.push(this.mesh2);
        splineHelperObjects.push(this.mesh3);
        splineHelperObjects.push(this.mesh4);

        this.curve = new THREE.CubicBezierCurve3( v0, v1, v2, v3 );
        let points = this.curve.getPoints( 50 ); 
        let curvegeometry = new THREE.BufferGeometry().setFromPoints( points ); 
        const color = new THREE.Color().setRGB( 0, 0, 1 );
        let curvematerial = new THREE.LineBasicMaterial( { color: color } ); 
        this.curveobject = new THREE.Line( curvegeometry, curvematerial );
        scene.add(this.curveobject);

        let pl1 = this.mesh1.position;
        let pl2 = this.mesh2.position;
        let handlepointsleft: THREE.Vector3[] = [];
        handlepointsleft.push(pl1);
        handlepointsleft.push(pl2);
        let handleleftgeometry = new THREE.BufferGeometry().setFromPoints( handlepointsleft );
        const colorhandle = new THREE.Color().setRGB( 0.5, 0.5, 0.5 );
        let handlematerial = new THREE.LineBasicMaterial( { color: colorhandle } ); 
        this.handleleftline = new THREE.Line( handleleftgeometry, handlematerial );
        scene.add(this.handleleftline);

        let pr1 = this.mesh3.position;
        let pr2 = this.mesh4.position;
        let handlepointsright: THREE.Vector3[] = [];
        handlepointsright.push(pr1);
        handlepointsright.push(pr2);
        let handlerightgeometry = new THREE.BufferGeometry().setFromPoints( handlepointsright );
        this.handlerightline = new THREE.Line( handlerightgeometry, handlematerial );
        scene.add(this.handlerightline);
        
    }
    UpdateCurve(){
        this.curve.v0 = this.mesh1.position;
        this.curve.v1 = this.mesh2.position;
        this.curve.v2 = this.mesh3.position;
        this.curve.v3 = this.mesh4.position;
        const points = this.curve.getPoints( 50 ); 
        const curvegeometry = new THREE.BufferGeometry().setFromPoints( points ); 
        console.log("UpdateCurve");
        this.curveobject.geometry = curvegeometry;

        let pl1 = this.mesh1.position;
        let pl2 = this.mesh2.position;
        let handlepointsleft: THREE.Vector3[] = [];
        handlepointsleft.push(pl1);
        handlepointsleft.push(pl2);
        let handleleftgeometry = new THREE.BufferGeometry().setFromPoints( handlepointsleft );
        this.handleleftline.geometry = handleleftgeometry;

        let pr1 = this.mesh3.position;
        let pr2 = this.mesh4.position;
        let handlepointsright: THREE.Vector3[] = [];
        handlepointsright.push(pr1);
        handlepointsright.push(pr2);
        let handlerightgeometry = new THREE.BufferGeometry().setFromPoints( handlepointsright );
        this.handlerightline.geometry = handlerightgeometry;
    }
    public GetValueAtTime( t: number): number{
        let a = this.mesh1.position;
        let b = this.mesh2.position;
        let c = this.mesh3.position;
        let d = this.mesh4.position;
        let time = t;
        /////////////////////normalize
        let offsetx = a.x;
        let offsety = a.y;
        let scalex = d.x - a.x;
        let scaley = d.y - a.y;
        if(scalex == 0)scalex = 0.000000000001;
        if(scaley == 0)scaley = 0.000000000001;
        //(move to origin), normalize scale
        let timeNormalized = (t - a.x) / scalex;
        let cpax = (b.x - a.x) / scalex;
        let cpay = (b.y - a.y) / scaley;
        let cpbx = (c.x - a.x) / scalex;
        let cpby = (c.y - a.y) / scaley;
        let nval = this.calculateVal.getValueAtTime(cpax, cpay, cpbx, cpby, timeNormalized);
        ////////////////////////unnormalize
        let rval = nval * scaley + a.y;
    
        return rval;
    }
  }
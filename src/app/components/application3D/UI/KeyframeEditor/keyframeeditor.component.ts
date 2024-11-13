import { AfterViewInit, Component, ElementRef, Input, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KeyframeList } from '../../3Dtools/ParticleSystem/propertytypes/keyframelist';
import {GUI, Controller} from 'lil-gui';
//import './temp/BezierController.js';
import $ from "jquery";
import { FreeDraggingDirective } from './free-dragging.directive';



@Component({
  selector: 'app-keyframeeditor',
  standalone: true,
  imports: [CommonModule, FreeDraggingDirective],
  templateUrl: './keyframeeditor.component.html',
  styleUrl: './keyframeeditor.component.css'
})
export class KeyframeEditorComponent implements AfterViewInit {
    @ViewChild('keyframeeditorcontainer', { read: ElementRef, static:false })//@ViewChild('viewportcontainer', { read: ElementRef })
    viewportcontainer!: ElementRef;
    container!: HTMLElement;

    public keyframelist: KeyframeList = new KeyframeList();

    constructor(){
    }
    ngAfterViewInit(): void {
      this.container = this.viewportcontainer.nativeElement;
      this.gridLines(this.container);
      
      const obj = {
        curve: [ .85, .05, .10, .95 ]
      };
      const gui = new GUI();
      
      const folder = gui.addFolder( 'Folder' );

      const folderParams = {
        number: 0.5,
        boolean: false,
        color: '#0cf',
        function() { console.log( 'hi' ) }
      };

      folder.add( folderParams, 'number', 0, 1 );
      folder.add( folderParams, 'boolean' );
      folder.addColor( folderParams, 'color' );
      folder.add( folderParams, 'function' );

      const params = {
        options: 10,
        boolean: true,
        string: 'lil-gui',
        number: 0,
        color: '#aa00ff',
        function() { console.log( 'hi' ) }
      };

      gui.add( params, 'options', { Small: 1, Medium: 10, Large: 100 } );
      gui.add( params, 'boolean' );
      gui.add( params, 'string' );
      gui.add( params, 'number' );
      gui.addColor( params, 'color' );
      gui.add( params, 'function' ).name( 'Custom Name' );
      //gui.addBezier( obj, 'curve' )

    }

    gridLines(container: HTMLElement)
    {
        const width = 800;
        const height = 600;
        const spacing = 100;

        for(let x = 0; x <= width; x += spacing)
        {
            const line = document.createElementNS("http://www.w3.org/2000/svg", "line");

            let start: number = 0;
            let end: number = 600;
            line.setAttributeNS(null, "x1", x.toString());
            line.setAttributeNS(null, "y1", start.toString());
            line.setAttributeNS(null, "x2", x.toString());
            line.setAttributeNS(null, "y2", end.toString());

            line.setAttributeNS(null, "stroke", "#D0D0D0");

            container.appendChild(line);
        }

        for(let y = 0; y <= height; y += spacing)
        {
            const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
            let start: number = 0;
            let end: number = 800;
            line.setAttributeNS(null, "x1", start.toString());
            line.setAttributeNS(null, "y1", y.toString());
            line.setAttributeNS(null, "x2", end.toString());
            line.setAttributeNS(null, "y2", y.toString());

            line.setAttributeNS(null, "stroke", "#D0D0D0");

            container.appendChild(line);
        }
    }


}
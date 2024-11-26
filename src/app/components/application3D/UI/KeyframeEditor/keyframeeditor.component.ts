import { AfterViewInit, Component, ElementRef, Input, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KeyframeList } from '../../3Dtools/ParticleSystem/propertytypes/keyframelist';
import {GUI, Controller} from 'lil-gui';
//import './temp/BezierController.js';
import $ from "jquery";
import { FreeDraggingDirective } from './free-dragging.directive';
import { Vector3D } from '../../3Dtools/Utils/Vector3D';



@Component({
  selector: 'app-keyframeeditor',
  standalone: true,
  imports: [CommonModule, FreeDraggingDirective],
  templateUrl: './keyframeeditor.component.html',
  styleUrl: './keyframeeditor.component.css'
})
export class KeyframeEditorComponent implements AfterViewInit {
    @ViewChild('keyframeeditorcontainer', { read: ElementRef, static:false })viewportcontainer!: ElementRef;
    container!: HTMLElement;

    //public keyframelist: KeyframeList = new KeyframeList();
    public vectors: Vector3D[] = [];

    constructor(){
    }
    ngAfterViewInit(): void {
      this.container = this.viewportcontainer.nativeElement;
      //this.gridLines(this.container);
      this.vectors.push(new Vector3D(200,0,0));

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